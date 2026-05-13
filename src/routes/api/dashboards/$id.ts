import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/dashboards/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const { getDb } = await import("@/lib/db/config");
          const db = getDb();
          const dashboard = await db
            .selectFrom("dashboard_layouts")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          if (!dashboard) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Dashboard not found" } },
              { status: 404 }
            );
          }

          return json({ success: true, data: dashboard });
        } catch (error) {
          console.error("Error fetching dashboard:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch dashboard" } },
            { status: 500 }
          );
        }
      },

      PUT: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const body = await request.json();
          const { name, description, layout_config, is_public } = body;

          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          const existing = await db
            .selectFrom("dashboard_layouts")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          if (!existing) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Dashboard not found" } },
              { status: 404 }
            );
          }

          await db
            .updateTable("dashboard_layouts")
            .set({
              name: name ?? existing.name,
              description: description !== undefined ? description : existing.description,
              layout_config: layout_config ? JSON.stringify(layout_config) : existing.layout_config,
              is_public: is_public !== undefined ? is_public : existing.is_public,
              updated_at: new Date().toISOString(),
            })
            .where("id", "=", id)
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "update",
            resourceType: "dashboard",
            resourceId: id,
          });

          const dashboard = await db
            .selectFrom("dashboard_layouts")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();
          return json({ success: true, data: dashboard });
        } catch (error) {
          console.error("Error updating dashboard:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to update dashboard" } },
            { status: 500 }
          );
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();

          await db.deleteFrom("dashboard_layouts").where("id", "=", id).execute();

          await logAudit({
            userId: session.user.id,
            action: "delete",
            resourceType: "dashboard",
            resourceId: id,
          });

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting dashboard:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete dashboard" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
