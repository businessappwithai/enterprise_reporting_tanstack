import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { getConnectionManager } from "@/lib/db/connection-manager";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/nl-query/execute")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
          }

          const body = await request.json();
          const { query, data_source_id, generated_sql } = body;

          if (!query || !data_source_id) {
            return json(
              {
                success: false,
                error: { message: "query and data_source_id are required" },
              },
              { status: 400 }
            );
          }

          const db = getDb();

          // Get data source
          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", data_source_id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { success: false, error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // For now, if generated_sql is provided, use it. Otherwise, return a placeholder
          const sql = generated_sql || `SELECT * FROM information_schema.tables LIMIT 10;`;

          try {
            // Execute the query against the target data source
            const connManager = getConnectionManager();
            const client = connManager.getConnection(data_source_id);

            if (!client) {
              return json(
                {
                  success: false,
                  error: { message: "Failed to connect to data source" },
                },
                { status: 500 }
              );
            }

            const result = await client.query(sql);

            return json({
              success: true,
              data: {
                query,
                generated_sql: sql,
                results: result.rows || [],
                column_names: result.fields?.map((f: any) => f.name) || [],
                row_count: (result.rows || []).length,
                execution_time_ms: 0,
              },
            });
          } catch (queryError) {
            console.error("Query execution error:", queryError);
            return json(
              {
                success: false,
                error: {
                  message:
                    queryError instanceof Error
                      ? queryError.message
                      : "Failed to execute query",
                },
              },
              { status: 500 }
            );
          }
        } catch (error) {
          console.error("NL Query execute error:", error);
          return json(
            {
              success: false,
              error: {
                message: error instanceof Error ? error.message : "Failed to execute query",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
