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

export const Route = createFileRoute("/api/admin/roles/$id")({
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
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          if (!role) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Role not found" } },
              { status: 404 }
            );
          }

          return json({ success: true, data: role });
        } catch (error) {
          console.error("Error fetching role:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch role" } },
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
          const body = (await request.json()) as {
            name?: string;
            description?: string;
            permissions?: string[];
          };

          const db = getDb();
          const updates: Record<string, unknown> = {};
          if (body.name !== undefined) updates.name = body.name;
          if (body.description !== undefined) updates.description = body.description;
          if (body.permissions !== undefined) updates.permissions = JSON.stringify(body.permissions);

          await db
            .updateTable("roles")
            .set(updates)
            .where("id", "=", id)
            .execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error updating role:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to update role" } },
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
          const db = getDb();

          await db.deleteFrom("user_roles").where("role_id", "=", id).execute();
          await db.deleteFrom("roles").where("id", "=", id).execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting role:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete role" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
