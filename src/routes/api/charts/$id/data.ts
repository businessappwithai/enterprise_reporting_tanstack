import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/charts/$id/data")({
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

          const { id: chartId } = params;
          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          const chart = await db
            .selectFrom("chart_definitions")
            .selectAll()
            .where("id", "=", chartId)
            .executeTakeFirst();

          if (!chart) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Chart not found" } },
              { status: 404 }
            );
          }

          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get("page") || "0");
          const pageSize = parseInt(url.searchParams.get("pageSize") || "50");

          // For demo purposes, return empty rows since sample queries reference non-existent tables
          // In a real scenario, the data source connection would execute the query
          return json({
            success: true,
            data: {
              rows: [],
              totalRows: 0,
              pageIndex: page,
              pageSize,
            },
          });
        } catch (error) {
          console.error("Error fetching chart data:", error);
          return json(
            {
              success: false,
              error: {
                code: "SERVER_ERROR",
                message: error instanceof Error ? error.message : "Failed to fetch chart data",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
