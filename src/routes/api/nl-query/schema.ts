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
          const dataSourceId = body.data_source_id;

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

          // Get metadata entities (tables) for this data source
          const entities = await db
            .selectFrom("metadata_entities")
            .selectAll()
            .where("data_source_id", "=", dataSourceId)
            .execute();

          // Get fields for each entity
          const schema: Record<string, any> = {};
          for (const entity of entities) {
            const fields = await db
              .selectFrom("metadata_fields")
              .selectAll()
              .where("entity_id", "=", entity.id)
              .execute();

            schema[entity.name] = {
              description: entity.description,
              fields: fields.map((f) => ({
                name: f.name,
                type: f.type,
                description: f.description,
              })),
            };
          }

          return json({
            success: true,
            data: {
              data_source_id: dataSourceId,
              data_source_name: dataSource.name,
              client_type: dataSource.client_type,
              schema,
              tables: entities.map((e) => ({
                name: e.name,
                description: e.description,
              })),
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
