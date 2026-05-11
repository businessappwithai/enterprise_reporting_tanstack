import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/data-sources/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Data source not found" } },
              { status: 404 }
            );
          }

          let connectionConfig;
          try {
            const isEncrypted =
              dataSource.connection_config.length > 64 &&
              /^[0-9a-fA-F]+$/.test(dataSource.connection_config);
            if (isEncrypted) {
              const { decrypt } = await import("@/lib/security/encryption");
              connectionConfig = JSON.parse(decrypt(dataSource.connection_config));
            } else {
              connectionConfig = JSON.parse(dataSource.connection_config);
              // Re-encrypt in background
              const { encrypt } = await import("@/lib/security/encryption");
              const encryptedConfig = encrypt(JSON.stringify(connectionConfig));
              db.updateTable("data_sources")
                .set({ connection_config: encryptedConfig })
                .where("id", "=", id)
                .execute()
                .catch(console.error);
            }
          } catch (decryptError) {
            console.error(
              "Failed to decrypt connection config",
              { dataSourceId: id },
              decryptError
            );
            throw decryptError;
          }

          return json({ success: true, data: { ...dataSource, connectionConfig } });
        } catch (error) {
          console.error("Error fetching data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to fetch data source" },
            },
            { status: 500 }
          );
        }
      },

      PATCH: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const body = await request.json();
          const { name, description, clientType, connectionConfig } = body;

          if (!name || !clientType || !connectionConfig) {
            return json(
              {
                success: false,
                error: { code: "INVALID_INPUT", message: "Missing required fields" },
              },
              { status: 400 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const { decrypt } = await import("@/lib/security/encryption");
          const { encrypt } = await import("@/lib/security/encryption");
          const { closeConnection } = await import("@/lib/db/connection-manager");
          const db = getDb();

          const existing = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!existing) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Data source not found" } },
              { status: 404 }
            );
          }

          let finalConnectionConfig = connectionConfig;
          if (!connectionConfig.password) {
            const existingConfig = JSON.parse(decrypt(existing.connection_config));
            finalConnectionConfig = { ...connectionConfig, password: existingConfig.password };
          }

          await db
            .updateTable("data_sources")
            .set({
              name,
              description: description ?? null,
              client_type: clientType,
              connection_config: encrypt(JSON.stringify(finalConnectionConfig)),
              updated_at: new Date().toISOString(),
            })
            .where("id", "=", id)
            .execute();

          await closeConnection(id);

          const updatedDataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          return json({ success: true, data: updatedDataSource });
        } catch (error) {
          console.error("Error updating data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to update data source" },
            },
            { status: 500 }
          );
        }
      },

      PUT: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const body = await request.json();
          const { name, description, clientType, connectionConfig } = body;

          if (!name || !clientType || !connectionConfig) {
            return json(
              {
                success: false,
                error: { code: "INVALID_INPUT", message: "Missing required fields" },
              },
              { status: 400 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const { decrypt } = await import("@/lib/security/encryption");
          const { encrypt } = await import("@/lib/security/encryption");
          const { closeConnection } = await import("@/lib/db/connection-manager");
          const db = getDb();

          const existing = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!existing) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Data source not found" } },
              { status: 404 }
            );
          }

          let finalConnectionConfig = connectionConfig;
          if (!connectionConfig.password) {
            const existingConfig = JSON.parse(decrypt(existing.connection_config));
            finalConnectionConfig = { ...connectionConfig, password: existingConfig.password };
          }

          await db
            .updateTable("data_sources")
            .set({
              name,
              description: description ?? null,
              client_type: clientType,
              connection_config: encrypt(JSON.stringify(finalConnectionConfig)),
              updated_at: new Date().toISOString(),
            })
            .where("id", "=", id)
            .execute();

          await closeConnection(id);

          const updatedDataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          return json({ success: true, data: updatedDataSource });
        } catch (error) {
          console.error("Error updating data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to update data source" },
            },
            { status: 500 }
          );
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const { getDb } = await import("@/lib/db/config");
          const { closeConnection } = await import("@/lib/db/connection-manager");
          const db = getDb();

          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Count queries, reports, charts that depend on this data source
          const queryCountResult = await db
            .selectFrom("saved_queries")
            .select(db.fn.count<number>("id").as("count"))
            .where("data_source_id", "=", id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();
          const queries = Number(queryCountResult?.count ?? 0);

          // For reports/charts, we check via a subquery using sql
          // Using a simpler approach: fetch query ids, then count dependent resources
          let reports = 0;
          let charts = 0;
          if (queries > 0) {
            const queryIds = await db
              .selectFrom("saved_queries")
              .select("id")
              .where("data_source_id", "=", id)
              .where("is_deleted", "=", false)
              .execute();
            const qIds = queryIds.map((q) => q.id);

            if (qIds.length > 0) {
              const reportCountResult = await db
                .selectFrom("report_definitions")
                .select(db.fn.count<number>("id").as("count"))
                .where("saved_query_id", "in", qIds)
                .where("is_deleted", "=", false)
                .executeTakeFirst();
              reports = Number(reportCountResult?.count ?? 0);

              const chartCountResult = await db
                .selectFrom("chart_definitions")
                .select(db.fn.count<number>("id").as("count"))
                .where("saved_query_id", "in", qIds)
                .where("is_deleted", "=", false)
                .executeTakeFirst();
              charts = Number(chartCountResult?.count ?? 0);
            }
          }

          if (queries > 0 || reports > 0 || charts > 0) {
            return json(
              {
                success: false,
                error: {
                  code: "IN_USE",
                  message: "Cannot delete data source: it is in use",
                  details: { queries, reports, charts },
                },
              },
              { status: 400 }
            );
          }

          // Soft delete
          await db
            .updateTable("data_sources")
            .set({
              is_deleted: true,
              is_active: false,
              deleted_at: new Date().toISOString(),
              deleted_by: session.user.id,
              updated_at: new Date().toISOString(),
            })
            .where("id", "=", id)
            .execute();

          await closeConnection(id);

          return json({ success: true, data: { message: "Data source deleted successfully" } });
        } catch (error) {
          console.error("Error deleting data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to delete data source" },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
