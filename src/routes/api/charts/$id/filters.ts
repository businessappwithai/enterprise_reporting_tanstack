import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { randomUUID } from "crypto";

async function getSession(request: Request) {
  const { getAuthSession } = await import("@/lib/auth/config");
  return getAuthSession();
}

export const Route = createFileRoute("/api/charts/$id/filters")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session) return json({ error: "Unauthorized" }, { status: 401 });

          const { getConfigDB } = await import("@/lib/db/config");
          const db = getConfigDB();
          const filters = await db("chart_filters as cf")
            .join("filter_definitions as fd", "cf.filter_id", "fd.id")
            .select(
              "cf.id",
              "cf.chart_id",
              "cf.filter_id",
              "cf.target_column",
              "cf.filter_order",
              "fd.name as filter_name",
              "fd.description",
              "fd.data_source_id",
              "fd.filter_query",
              "fd.display_field",
              "fd.value_field"
            )
            .where("cf.chart_id", params.id)
            .orderBy("cf.filter_order");

          return json(filters);
        } catch (error) {
          console.error("Error fetching chart filters:", error);
          return json({ error: "Failed to fetch chart filters" }, { status: 500 });
        }
      },

      POST: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session) return json({ error: "Unauthorized" }, { status: 401 });

          const body = await request.json();
          const { filter_id, target_column } = body;

          if (!filter_id || !target_column) {
            return json({ error: "Missing required fields" }, { status: 400 });
          }

          const { getConfigDB } = await import("@/lib/db/config");
          const db = getConfigDB();
          const chart = await db("chart_definitions").where("id", params.id).first();
          if (!chart) return json({ error: "Chart not found" }, { status: 404 });

          const maxOrderResult = await db("chart_filters")
            .where("chart_id", params.id)
            .max("filter_order as max_order")
            .first();
          const nextOrder = (maxOrderResult?.max_order ?? -1) + 1;

          const newChartFilter = {
            id: randomUUID(),
            chart_id: params.id,
            filter_id,
            target_column,
            filter_order: nextOrder,
            created_at: new Date().toISOString(),
          };
          await db("chart_filters").insert(newChartFilter);

          return json(newChartFilter, { status: 201 });
        } catch (error) {
          console.error("Error adding chart filter:", error);
          return json({ error: "Failed to add chart filter" }, { status: 500 });
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session) return json({ error: "Unauthorized" }, { status: 401 });

          const { getConfigDB } = await import("@/lib/db/config");
          const db = getConfigDB();
          await db("chart_filters").where("chart_id", params.id).del();
          return json({ success: true });
        } catch (error) {
          console.error("Error deleting chart filters:", error);
          return json({ error: "Failed to delete chart filters" }, { status: 500 });
        }
      },
    },
  },
});
