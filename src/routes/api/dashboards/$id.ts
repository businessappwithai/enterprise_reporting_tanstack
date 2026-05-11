import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import type { DashboardLayout, DashboardWidget } from "@/types/database";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth();
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
          const { hasResourceAccess } = await import("@/lib/permissions/permissions");
          const hasAccess = await hasResourceAccess(session.user.id, "dashboard", id, "view");
          if (!hasAccess) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to view this dashboard",
                },
              },
              { status: 403 }
            );
          }

          const { getKnexDb: getDb } = await import("@/lib/db/config");
          const db = getDb();
          const dashboard = await db<DashboardLayout>("dashboard_layouts").where("id", id).first();
          if (!dashboard) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Dashboard not found" } },
              { status: 404 }
            );
          }

          const widgets = await db<DashboardWidget>("dashboard_widgets")
            .where("dashboard_id", id)
            .orderBy("created_at");
          return json({ success: true, data: { ...dashboard, widgets } });
        } catch (error) {
          console.error("Error fetching dashboard:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to fetch dashboard" },
            },
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

          const { hasResourceAccess } = await import("@/lib/permissions/permissions");
          const hasAccess = await hasResourceAccess(session.user.id, "dashboard", id, "edit");
          if (!hasAccess) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to edit this dashboard",
                },
              },
              { status: 403 }
            );
          }

          const { getKnexDb: getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          const existing = await db<DashboardLayout>("dashboard_layouts").where("id", id).first();
          if (!existing) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Dashboard not found" } },
              { status: 404 }
            );
          }

          const updates: Partial<DashboardLayout> = { updated_at: new Date().toISOString() };
          if (body.name !== undefined) updates.name = body.name;
          if (body.description !== undefined) updates.description = body.description;
          if (body.layoutConfig !== undefined)
            updates.layout_config = JSON.stringify(body.layoutConfig);
          if (body.themeConfig !== undefined)
            updates.theme_config = JSON.stringify(body.themeConfig);
          if (body.refreshConfig !== undefined)
            updates.refresh_config = JSON.stringify(body.refreshConfig);
          if (body.isPublic !== undefined) updates.is_public = body.isPublic;

          await db<DashboardLayout>("dashboard_layouts").where("id", id).update(updates);
          await logAudit({
            userId: session.user.id,
            action: "update",
            resourceType: "dashboard",
            resourceId: id,
          });

          const dashboard = await db<DashboardLayout>("dashboard_layouts").where("id", id).first();
          const widgets = await db<DashboardWidget>("dashboard_widgets").where("dashboard_id", id);
          return json({ success: true, data: { ...dashboard, widgets } });
        } catch (error) {
          console.error("Error updating dashboard:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to update dashboard" },
            },
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
          const { canDeleteResource } = await import("@/lib/permissions/permissions");
          const canDelete = await canDeleteResource(session.user.id, "dashboard", id);
          if (!canDelete) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to delete this dashboard",
                },
              },
              { status: 403 }
            );
          }

          const { getKnexDb: getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          await db<DashboardLayout>("dashboard_layouts").where("id", id).delete();
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
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to delete dashboard" },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
