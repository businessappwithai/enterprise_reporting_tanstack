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

          // Generate sample chart data
          const sampleData = [
            { month: "January", sales: 4000, expenses: 2400, profit: 1600 },
            { month: "February", sales: 3000, expenses: 1398, profit: 1602 },
            { month: "March", sales: 2000, expenses: 9800, profit: -7800 },
            { month: "April", sales: 2780, expenses: 3908, profit: -1128 },
            { month: "May", sales: 1890, expenses: 4800, profit: -2910 },
            { month: "June", sales: 2390, expenses: 3800, profit: -1410 },
            { month: "July", sales: 3490, expenses: 4300, profit: -810 },
            { month: "August", sales: 4200, expenses: 3000, profit: 1200 },
            { month: "September", sales: 3800, expenses: 2700, profit: 1100 },
            { month: "October", sales: 4500, expenses: 3200, profit: 1300 },
            { month: "November", sales: 5100, expenses: 3800, profit: 1300 },
            { month: "December", sales: 6200, expenses: 4200, profit: 2000 },
          ];

          // Apply pagination
          const start = page * pageSize;
          const end = start + pageSize;
          const paginatedData = sampleData.slice(start, end);

          return json({
            success: true,
            data: {
              rows: paginatedData,
              totalRows: sampleData.length,
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
