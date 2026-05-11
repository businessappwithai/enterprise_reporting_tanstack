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

export const Route = createFileRoute("/api/admin/users/$id")({
  server: {
    handlers: {
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
            is_active?: boolean;
            display_name?: string;
          };

          const db = getDb();
          const now = new Date().toISOString();

          await db
            .updateTable("users")
            .set({ ...body, updated_at: now })
            .where("id", "=", id)
            .execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error updating user:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to update user" } },
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

          if (id === session.user.id) {
            return json(
              { success: false, error: { code: "INVALID_INPUT", message: "Cannot delete your own account" } },
              { status: 400 }
            );
          }

          const db = getDb();
          await db.deleteFrom("users").where("id", "=", id).execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting user:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete user" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
