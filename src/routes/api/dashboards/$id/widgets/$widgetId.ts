import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/dashboards/$id/widgets/$widgetId")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { widgetId } = params;
          const body = await request.json();

          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();

          const existing = await db
            .selectFrom("dashboard_widgets")
            .selectAll()
            .where("id", "=", widgetId)
            .executeTakeFirst();

          if (!existing) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Widget not found" } },
              { status: 404 }
            );
          }

          const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
          if (body.positionConfig !== undefined)
            updates.position_config = JSON.stringify(body.positionConfig);
          if (body.widgetConfig !== undefined)
            updates.widget_config = JSON.stringify(body.widgetConfig);
          if (body.reportId !== undefined) updates.report_id = body.reportId;
          if (body.chartId !== undefined) updates.chart_id = body.chartId;
          if (body.widgetType !== undefined) updates.widget_type = body.widgetType;

          await db
            .updateTable("dashboard_widgets")
            .set(updates)
            .where("id", "=", widgetId)
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "update",
            resourceType: "dashboard_widget",
            resourceId: widgetId,
          });

          const widget = await db
            .selectFrom("dashboard_widgets")
            .selectAll()
            .where("id", "=", widgetId)
            .executeTakeFirst();

          return json({ success: true, data: widget });
        } catch (error) {
          console.error("Error updating widget:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to update widget" } },
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

          const { widgetId } = params;
          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();

          await db.deleteFrom("dashboard_widgets").where("id", "=", widgetId).execute();

          await logAudit({
            userId: session.user.id,
            action: "delete",
            resourceType: "dashboard_widget",
            resourceId: widgetId,
          });

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting widget:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete widget" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
