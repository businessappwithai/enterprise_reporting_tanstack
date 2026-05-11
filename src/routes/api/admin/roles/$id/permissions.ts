import { createFileRoute } from "@tanstack/react-router";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { isAdmin } from "@/lib/permissions/permissions";
import { json } from "@/lib/server/response";

async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  const session = await verifySession(token);
  if (!session?.user) return null;
  const admin = await isAdmin(session.user.id);
  if (!admin) return null;
  return session;
}

export const Route = createFileRoute("/api/admin/roles/$id/permissions")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const { id } = params;
          const db = getDb();

          const role = await db
            .selectFrom("roles")
            .select(["id", "name", "permissions"])
            .where("id", "=", id)
            .executeTakeFirst();

          if (!role) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Role not found" } },
              { status: 404 }
            );
          }

          const permissions = JSON.parse(role.permissions || "[]");
          return json({ success: true, data: permissions });
        } catch (error) {
          console.error("Error fetching role permissions:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to fetch permissions" },
            },
            { status: 500 }
          );
        }
      },

      PATCH: async ({ request, params }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const { id } = params;
          const body = (await request.json()) as { permissions?: string[] };
          const { permissions = [] } = body;

          const db = getDb();
          await db
            .updateTable("roles")
            .set({ permissions: JSON.stringify(permissions) })
            .where("id", "=", id)
            .execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error updating role permissions:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to update permissions" },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
