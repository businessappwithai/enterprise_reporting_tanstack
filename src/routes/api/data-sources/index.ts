import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { randomUUID } from "node:crypto";
import { encrypt } from "@/lib/security/encryption";
import { logAudit } from "@/lib/security/audit";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/data-sources/")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { error: { message: "Unauthorized" } },
              { status: 401 }
            );
          }

          const db = getDb();
          const dataSources = await db
            .selectFrom("data_sources")
            .selectAll()
            .orderBy("is_deleted", "asc")
            .orderBy("name", "asc")
            .execute();

          // Strip sensitive connection_config from list response
          const sanitized = dataSources.map(
            ({ connection_config: _cc, ...rest }) => rest
          );

          // Log audit asynchronously without blocking the response
          logAudit({
            userId: session.user.id,
            action: "read",
            resourceType: "data_source",
            details: { operation: "listDataSources", count: sanitized.length },
          }).catch((err) => {
            console.error("Audit log error:", err);
          });

          return json({
            success: true,
            data: {
              items: sanitized,
              meta: { total: sanitized.length }
            }
          });
        } catch (error) {
          console.error("Data sources list error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Internal server error",
              },
            },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { error: { message: "Unauthorized" } },
              { status: 401 }
            );
          }

          const body = await request.json();
          const { name, description, clientType, connectionConfig } = body;

          if (!name || !clientType || !connectionConfig) {
            return json(
              { error: { message: "Missing required fields: name, clientType, connectionConfig" } },
              { status: 400 }
            );
          }

          const db = getDb();
          const id = randomUUID();
          const encryptedConfig = encrypt(JSON.stringify(connectionConfig));
          const now = new Date().toISOString();

          await db
            .insertInto("data_sources")
            .values({
              id,
              name,
              description: description || null,
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

          // Log audit asynchronously without blocking the response
          logAudit({
            userId: session.user.id,
            action: "create",
            resourceType: "data_source",
            resourceId: id,
            details: { name, clientType },
          }).catch((err) => {
            console.error("Audit log error:", err);
          });

          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          // Strip sensitive data from response
          const { connection_config: _cc, ...safeDataSource } = dataSource || {};

          return json({ success: true, item: safeDataSource }, { status: 201 });
        } catch (error) {
          console.error("Data sources create error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Internal server error",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
