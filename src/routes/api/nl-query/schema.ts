import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/nl-query/schema")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
          }

          const body = await request.json();
          const dataSourceId = body.data_source_id || body.dataSourceId;

          if (!dataSourceId) {
            return json(
              { success: false, error: { message: "data_source_id is required" } },
              { status: 400 }
            );
          }

          const db = getDb();

          // Get data source
          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", dataSourceId)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { success: false, error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Query PostgreSQL schema directly from information_schema
          const tables = await db.raw<{ table_name: string }[]>(
            `SELECT table_name FROM information_schema.tables
             WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
             ORDER BY table_name`
          );

          // Build schema with fields
          const schema: Record<string, any> = {};
          const tablesList = [];

          for (const { table_name } of tables) {
            const fields = await db.raw<{ column_name: string; data_type: string }[]>(
              `SELECT column_name, data_type FROM information_schema.columns
               WHERE table_schema = 'public' AND table_name = ?
               ORDER BY ordinal_position`,
              [table_name]
            );

            schema[table_name] = {
              description: `Table: ${table_name}`,
              fields: fields.map((f) => ({
                name: f.column_name,
                type: f.data_type,
                description: f.column_name,
              })),
            };

            tablesList.push({
              name: table_name,
              description: `Table: ${table_name}`,
              columns: fields.map((f) => f.column_name),
            });
          }

          return json({
            success: true,
            data: {
              data_source_id: dataSourceId,
              data_source_name: dataSource.name,
              client_type: dataSource.client_type,
              schema,
              tables: tablesList,
            },
          });
        } catch (error) {
          console.error("Schema fetch error:", error);
          return json(
            {
              success: false,
              error: {
                message: error instanceof Error ? error.message : "Failed to fetch schema",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
