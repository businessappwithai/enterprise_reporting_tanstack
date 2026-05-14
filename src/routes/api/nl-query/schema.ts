import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { getConnection } from "@/lib/db/connection-manager";
import { introspectSchema } from "@/lib/sql/schema-introspection";

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
            return json(
              { success: false, error: { message: "Unauthorized" } },
              { status: 401 }
            );
          }

          const body = await request.json();
          const { data_source_id: dataSourceId, refresh } = body;

          if (!dataSourceId) {
            return json(
              { success: false, error: { message: "Missing data_source_id" } },
              { status: 400 }
            );
          }

          const db = getDb();

          // Get the data source
          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", dataSourceId)
            .where("is_active", "=", true)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { success: false, error: { message: "Data source not found or inactive" } },
              { status: 404 }
            );
          }

          // Get connection and introspect schema
          const connection = await getConnection(dataSource);
          const { schema, logs } = await introspectSchema(connection, dataSource.client_type);

          // Fetch RBAC information for NL context
          const userRoles = await db
            .selectFrom("user_roles")
            .select("role_name")
            .where("user_id", "=", session.user.id)
            .execute();

          const roleNames = userRoles.map((r: any) => r.role_name);

          // Build RBAC context for NL query generation
          const rbacContext = {
            currentUserId: session.user.id,
            currentUserEmail: session.user.email,
            currentUserRoles: roleNames,
            dataSourceId,
            dataSourceName: dataSource.name,
          };

          return json({
            success: true,
            data: {
              tables: schema.tables || [],
              views: schema.views || [],
              logs,
              rbacContext,
            },
          });
        } catch (error) {
          console.error("Schema introspection error:", error);
          return json(
            {
              success: false,
              error: {
                message: error instanceof Error ? error.message : "Failed to introspect schema",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
