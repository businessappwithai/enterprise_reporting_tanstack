import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import type { ChartDefinition } from "@/types/database";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth();
}

export const Route = createFileRoute("/api/charts/$id")({
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
          const hasAccess = await hasResourceAccess(session.user.id, "chart", id, "view");
          if (!hasAccess) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to view this chart",
                },
              },
              { status: 403 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const db = getDb();
          const chart = await db<ChartDefinition>("chart_definitions").where("id", id).first();
          if (!chart) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Chart not found" } },
              { status: 404 }
            );
          }

          return json({ success: true, data: chart });
        } catch (error) {
          console.error("Error fetching chart:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch chart" } },
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
          const hasAccess = await hasResourceAccess(session.user.id, "chart", id, "edit");
          if (!hasAccess) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to edit this chart",
                },
              },
              { status: 403 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          const existing = await db<ChartDefinition>("chart_definitions").where("id", id).first();
          if (!existing) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Chart not found" } },
              { status: 404 }
            );
          }

          const updates: Partial<ChartDefinition> = { updated_at: new Date().toISOString() };
          if (body.name !== undefined) updates.name = body.name;
          if (body.description !== undefined) updates.description = body.description;
          if (body.savedQueryId !== undefined) updates.saved_query_id = body.savedQueryId;
          if (body.chartType !== undefined) updates.chart_type = body.chartType;
          if (body.chartConfig !== undefined)
            updates.chart_config = JSON.stringify(body.chartConfig);
          if (body.dataMapping !== undefined)
            updates.data_mapping = JSON.stringify(body.dataMapping);
          if (body.refreshInterval !== undefined) updates.refresh_interval = body.refreshInterval;

          await db<ChartDefinition>("chart_definitions").where("id", id).update(updates);
          await logAudit({
            userId: session.user.id,
            action: "update",
            resourceType: "chart",
            resourceId: id,
          });

          const chart = await db<ChartDefinition>("chart_definitions").where("id", id).first();
          return json({ success: true, data: chart });
        } catch (error) {
          console.error("Error updating chart:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to update chart" } },
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
          const canDelete = await canDeleteResource(session.user.id, "chart", id);
          if (!canDelete) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to delete this chart",
                },
              },
              { status: 403 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          await db<ChartDefinition>("chart_definitions").where("id", id).delete();
          await logAudit({
            userId: session.user.id,
            action: "delete",
            resourceType: "chart",
            resourceId: id,
          });

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting chart:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete chart" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
