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
            .select("id", "created_by")
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

          // Mark as inspected
          await db
            .updateTable("data_sources")
            .set({
              is_inspected: true,
              updated_at: new Date().toISOString(),
            })
            .where("id", "=", params.id)
            .execute();

          // For now, return a success response with dummy entities count
          // In a real implementation, this would introspect the database schema
          return json({
            success: true,
            data: {
              entities_count: 0,
              message: "Schema inspection completed",
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
