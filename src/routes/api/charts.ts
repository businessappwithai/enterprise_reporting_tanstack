import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { v4 as uuidv4 } from "uuid";
import type { ChartDefinition } from "@/types/database";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth();
}

export const Route = createFileRoute("/api/charts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { searchParams } = new URL(request.url);
          const page = parseInt(searchParams.get("page") || "0", 10);
          const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

          const { getDb } = await import("@/lib/db/config");
          const { filterAccessibleResources } = await import("@/lib/permissions/permissions");
          const db = getDb();
          let charts = await db<ChartDefinition>("chart_definitions").orderBy("created_at", "desc");

          charts = await filterAccessibleResources(session.user.id, charts, "chart", "view");
          const paginatedCharts = charts.slice(page * pageSize, (page + 1) * pageSize);
          const total = charts.length;

          return json({
            success: true,
            data: {
              items: paginatedCharts,
              meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            },
          });
        } catch (error) {
          console.error("Error fetching charts:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch charts" } },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { canCreateResource } = await import("@/lib/permissions/permissions");
          const canCreate = await canCreateResource(session.user.id, "chart");
          if (!canCreate) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to create charts",
                },
              },
              { status: 403 }
            );
          }

          const body = await request.json();
          const {
            name,
            description,
            savedQueryId,
            chartType,
            chartConfig,
            dataMapping,
            refreshInterval,
          } = body;

          if (!name || !chartType) {
            return json(
              {
                success: false,
                error: { code: "INVALID_INPUT", message: "Name and chart type are required" },
              },
              { status: 400 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          const id = uuidv4();

          await db<ChartDefinition>("chart_definitions").insert({
            id,
            name,
            description,
            saved_query_id: savedQueryId,
            chart_type: chartType,
            chart_config: JSON.stringify(chartConfig || {}),
            data_mapping: JSON.stringify(dataMapping || { xAxis: { field: "" }, yAxis: [] }),
            refresh_interval: refreshInterval,
            created_by: session.user.id,
          });

          await logAudit({
            userId: session.user.id,
            action: "create",
            resourceType: "chart",
            resourceId: id,
            details: { name, chartType },
          });

          const chart = await db<ChartDefinition>("chart_definitions").where("id", id).first();
          return json({ success: true, data: chart });
        } catch (error) {
          console.error("Error creating chart:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to create chart" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
