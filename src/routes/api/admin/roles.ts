import { randomUUID } from "node:crypto";
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

export const Route = createFileRoute("/api/admin/roles")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const db = getDb();
          const roles = await db.selectFrom("roles").selectAll().orderBy("name", "asc").execute();

          return json({ success: true, data: roles });
        } catch (error) {
          console.error("Error fetching roles:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch roles" } },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const body = (await request.json()) as {
            name?: string;
            description?: string;
            permissions?: string[];
          };

          const { name, description, permissions = [] } = body;

          if (!name) {
            return json(
              {
                success: false,
                error: { code: "INVALID_INPUT", message: "Role name is required" },
              },
              { status: 400 }
            );
          }

          const db = getDb();
          const roleId = randomUUID();
          const now = new Date().toISOString();

          await db
            .insertInto("roles")
            .values({
              id: roleId,
              name,
              description: description ?? null,
              permissions: JSON.stringify(permissions),
              created_at: now,
            })
            .execute();

          return json({ success: true, data: { id: roleId } }, { status: 201 });
        } catch (error) {
          console.error("Error creating role:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to create role" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
