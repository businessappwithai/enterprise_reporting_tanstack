import { randomUUID } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { createDataSourceSchema } from "@/lib/schemas/data-sources";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/data-sources")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          const dataSources = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("is_deleted", "=", false)
            .orderBy("name", "asc")
            .execute();

          // Strip sensitive connection_config from the list response
          const sanitizedSources = dataSources.map(({ connection_config: _cc, ...rest }) => rest);

          return json({
            success: true,
            data: { items: sanitizedSources, meta: { total: sanitizedSources.length } },
          });
        } catch (error) {
          console.error("Error fetching data sources:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to fetch data sources" },
            },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const body = await request.json();
          const result = await createDataSourceSchema.safeParseAsync(body);

          if (!result.success) {
            return json(
              { success: false, error: { code: "INVALID_INPUT", message: "Validation failed", details: result.error.flatten() } },
              { status: 422 }
            );
          }

          const { name, description, clientType, connectionConfig } = result.data;

          const { getDb } = await import("@/lib/db/config");
          const { encrypt } = await import("@/lib/security/encryption");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          const id = randomUUID();
          const encryptedConfig = encrypt(JSON.stringify(connectionConfig));
          const now = new Date().toISOString();

          await db
            .insertInto("data_sources")
            .values({
              id,
              name,
              description: description ?? null,
              client_type: clientType,
              connection_config: encryptedConfig,
              is_active: true,
              is_editable: false,
              is_deleted: false,
              deleted_at: null,
              deleted_by: null,
              created_by: session.user.id,
              created_at: now,
              updated_at: now,
            })
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "create",
            resourceType: "data_source",
            resourceId: id,
            details: { name, clientType },
          });

          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          return json({ success: true, data: dataSource }, { status: 201 });
        } catch (error) {
          console.error("Error creating data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to create data source" },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
