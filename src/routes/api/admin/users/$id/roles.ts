import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { getDb } from "@/lib/db/config";
import { verifySession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/permissions/permissions";

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

export const Route = createFileRoute("/api/admin/users/$id/roles")({
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

          const roles = await db
            .selectFrom("user_roles as ur")
            .innerJoin("roles as r", "r.id", "ur.role_id")
            .select(["r.id", "r.name", "r.description", "r.permissions", "ur.assigned_at"])
            .where("ur.user_id", "=", id)
            .execute();

          return json({ success: true, data: roles });
        } catch (error) {
          console.error("Error fetching user roles:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch user roles" } },
            { status: 500 }
          );
        }
      },

      POST: async ({ request, params }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const { id } = params;
          const body = (await request.json()) as { roleId?: string };
          const { roleId } = body;

          if (!roleId) {
            return json(
              { success: false, error: { code: "INVALID_INPUT", message: "Role ID is required" } },
              { status: 400 }
            );
          }

          const db = getDb();
          const now = new Date().toISOString();

          await db
            .insertInto("user_roles")
            .values({ user_id: id, role_id: roleId, assigned_at: now })
            .execute();

          return json({ success: true }, { status: 201 });
        } catch (error) {
          console.error("Error assigning role:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to assign role" } },
            { status: 500 }
          );
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const { id } = params;
          const body = (await request.json()) as { roleId?: string };
          const { roleId } = body;

          if (!roleId) {
            return json(
              { success: false, error: { code: "INVALID_INPUT", message: "Role ID is required" } },
              { status: 400 }
            );
          }

          const db = getDb();
          await db
            .deleteFrom("user_roles")
            .where("user_id", "=", id)
            .where("role_id", "=", roleId)
            .execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error removing role:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to remove role" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
