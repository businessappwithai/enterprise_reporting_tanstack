import { createAPIFileRoute } from "@tanstack/react-start/server";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { randomUUID } from "node:crypto";
import { encrypt, decrypt } from "@/lib/security/encryption";
import { logAudit } from "@/lib/security/audit";

export const Route = createAPIFileRoute("/api/data-sources/")({
  methods: ["GET", "POST"],
  handler: async (request: Request): Promise<Response> => {
    try {
      // Verify authentication
      const cookie = request.headers.get("cookie") || "";
      const match = cookie.match(/session_token=([^;]+)/);
      const token = match?.[1];

      if (!token) {
        return json({ error: { message: "Unauthorized" } }, { status: 401 });
      }

      const session = await verifySession(token);
      if (!session) {
        return json({ error: { message: "Invalid session" } }, { status: 401 });
      }

      if (request.method === "GET") {
        // List data sources
        const db = getDb();
        const dataSources = await db
          .selectFrom("data_sources")
          .selectAll()
          .where("is_deleted", "=", false)
          .orderBy("name", "asc")
          .execute();

        // Strip sensitive connection_config from list response
        const sanitized = dataSources.map(({ connection_config: _cc, ...rest }) => rest);

        await logAudit({
          userId: session.user.id,
          action: "read",
          resourceType: "data_source",
          details: { operation: "listDataSources", count: sanitized.length },
        });

        return json({
          items: sanitized,
          meta: { total: sanitized.length },
        });
      } else if (request.method === "POST") {
        // Create data source
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

        // Strip sensitive data from response
        const { connection_config: _cc, ...safeDataSource } = dataSource || {};

        return json({ item: safeDataSource }, { status: 201 });
      }

      return json({ error: { message: "Method not allowed" } }, { status: 405 });
    } catch (error) {
      console.error("Data sources API error:", error);
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
});
