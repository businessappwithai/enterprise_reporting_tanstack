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

export const Route = createFileRoute("/api/admin/permissions")({
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
          const permissions = await db
            .selectFrom("resource_permissions")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();

          return json({ success: true, data: permissions });
        } catch (error) {
          console.error("Error fetching permissions:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to fetch permissions" },
            },
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
            resource_type?: string;
            resource_id?: string;
            role_id?: string;
            permission_level?: string;
          };

          const { resource_type, resource_id, role_id, permission_level } = body;

          if (!resource_type || !resource_id || !role_id || !permission_level) {
            return json(
              {
                success: false,
                error: { code: "INVALID_INPUT", message: "All permission fields are required" },
              },
              { status: 400 }
            );
          }

          const db = getDb();
          const permId = randomUUID();
          const now = new Date().toISOString();

          await db
            .insertInto("resource_permissions")
            .values({
              id: permId,
              resource_type,
              resource_id,
              role_id,
              permission_level,
              created_at: now,
            })
            .execute();

          return json({ success: true, data: { id: permId } }, { status: 201 });
        } catch (error) {
          console.error("Error creating permission:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to create permission" },
            },
            { status: 500 }
          );
        }
      },

      DELETE: async ({ request }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const body = (await request.json()) as { id?: string };
          const { id } = body;

          if (!id) {
            return json(
              {
                success: false,
                error: { code: "INVALID_INPUT", message: "Permission ID is required" },
              },
              { status: 400 }
            );
          }

          const db = getDb();
          await db.deleteFrom("resource_permissions").where("id", "=", id).execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting permission:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to delete permission" },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
