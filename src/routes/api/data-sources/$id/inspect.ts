import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { getConnection } from "@/lib/db/connection-manager";
import { introspectSchema } from "@/lib/sql/schema-introspection";
import { randomUUID } from "node:crypto";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/data-sources/$id/inspect")({
  server: {
    handlers: {
      POST: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: { message: "Unauthorized" } }, { status: 401 });
          }

          const db = getDb();

          // Check if data source exists
          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", params.id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Allow owner or admins to inspect
          const userRoles = session.user.roles || [];
          const isAdmin = userRoles.includes("admin");
          const isOwner = dataSource.created_by === session.user.id;

          if (!isAdmin && !isOwner) {
            return json(
              { error: { message: "Forbidden" } },
              { status: 403 }
            );
          }

          // Introspect the schema
          const connection = await getConnection(dataSource);
          const { schema } = await introspectSchema(connection, dataSource.client_type);

          let entitiesCreated = 0;
          const now = new Date().toISOString();

          // Create metadata entities for each table and view
          const tables = schema.tables || [];
          const views = schema.views || [];
          const allEntities = [
            ...tables.map((t: any) => ({ ...t, entity_type: "table" })),
            ...views.map((v: any) => ({ ...v, entity_type: "view" })),
          ];

          for (const entity of allEntities) {
            // Check if entity already exists
            const existing = await db
              .selectFrom("metadata_entity_header")
              .select("id")
              .where("data_source_id", "=", params.id)
              .where("entity_name", "=", entity.name)
              .where("entity_schema", "is", entity.schema || null)
              .executeTakeFirst();

            if (!existing) {
              const headerId = randomUUID();

              // Create entity header
              await db
                .insertInto("metadata_entity_header")
                .values({
                  id: headerId,
                  data_source_id: params.id,
                  entity_name: entity.name,
                  entity_schema: entity.schema || null,
                  entity_type: entity.entity_type,
                  schema_metadata: JSON.stringify(entity),
                  is_active: false,
                  is_hidden: true,
                  created_by: session.user.id,
                  created_at: now,
                  updated_at: now,
                })
                .execute();

              // Create field entries for columns
              const columns = entity.columns || [];
              for (const col of columns) {
                await db
                  .insertInto("metadata_entity_field")
                  .values({
                    id: randomUUID(),
                    entity_header_id: headerId,
                    field_name: col.name,
                    data_type: col.type,
                    is_nullable: col.nullable !== false,
                    is_primary_key: col.isPrimaryKey || false,
                    is_foreign_key: col.isForeignKey || false,
                    foreign_key_table: col.foreignKeyTable || null,
                    foreign_key_column: col.foreignKeyColumn || null,
                    default_value: col.defaultValue || null,
                    is_display_field: false,
                    is_searchable: true,
                    created_at: now,
                    updated_at: now,
                  })
                  .execute();
              }

              entitiesCreated++;
            }
          }

          // Mark as inspected
          await db
            .updateTable("data_sources")
            .set({
              is_inspected: true,
              updated_at: now,
            })
            .where("id", "=", params.id)
            .execute();

          return json({
            success: true,
            data: {
              entities_count: entitiesCreated,
              total_entities: allEntities.length,
              message: `Schema inspection completed. ${entitiesCreated} new entities imported.`,
            },
          });
        } catch (error) {
          console.error("Data source inspect error:", error);
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
