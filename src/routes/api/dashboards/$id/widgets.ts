import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { v4 as uuidv4 } from "uuid";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/dashboards/$id/widgets")({
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

          const { id: dashboardId } = params;
          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          const widgets = await db
            .selectFrom("dashboard_widgets")
            .selectAll()
            .where("dashboard_id", "=", dashboardId)
            .orderBy("created_at", "asc")
            .execute();

          return json({ success: true, data: { items: widgets } });
        } catch (error) {
          console.error("Error fetching widgets:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch widgets" } },
            { status: 500 }
          );
        }
      },

      POST: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id: dashboardId } = params;
          const body = await request.json();
          const { widgetType, reportId, chartId, positionConfig, widgetConfig } = body;

          if (!widgetType || !positionConfig) {
            return json(
              {
                success: false,
                error: {
                  code: "INVALID_INPUT",
                  message: "widgetType and positionConfig are required",
                },
              },
              { status: 400 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          const id = uuidv4();
          const now = new Date().toISOString();

          await db
            .insertInto("dashboard_widgets")
            .values({
              id,
              dashboard_id: dashboardId,
              widget_type: widgetType,
              report_id: reportId ?? null,
              chart_id: chartId ?? null,
              position_config: JSON.stringify(positionConfig),
              widget_config: widgetConfig ? JSON.stringify(widgetConfig) : null,
              created_at: now,
              updated_at: now,
            })
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "create",
            resourceType: "dashboard_widget",
            resourceId: id,
            details: { dashboardId, widgetType },
          });

          const widget = await db
            .selectFrom("dashboard_widgets")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          return json({ success: true, data: widget });
        } catch (error) {
          console.error("Error creating widget:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to create widget" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
