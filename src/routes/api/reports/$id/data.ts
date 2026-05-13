import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/reports/$id/data")({
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

          const { id: reportId } = params;
          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get("page") || "0");
          const pageSize = parseInt(url.searchParams.get("pageSize") || "50");

          const { getDb } = await import("@/lib/db/config");
          const { getConnection } = await import("@/lib/db/connection-manager");
          const db = getDb();

          // Get report definition
          const report = await db
            .selectFrom("report_definitions")
            .selectAll()
            .where("id", "=", reportId)
            .executeTakeFirst();

          if (!report) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Report not found" } },
              { status: 404 }
            );
          }

          // Generate sample data for demonstration
          const sampleData = [
            { region: "North America", revenue: 125000, products_sold: 850, customers: 320 },
            { region: "Europe West", revenue: 98500, products_sold: 680, customers: 210 },
            { region: "Asia Pacific", revenue: 156200, products_sold: 920, customers: 450 },
            { region: "Latin America", revenue: 67300, products_sold: 380, customers: 140 },
            { region: "Middle East", revenue: 45600, products_sold: 250, customers: 95 },
            { region: "Africa", revenue: 32100, products_sold: 180, customers: 65 },
            { region: "East Asia", revenue: 189500, products_sold: 1100, customers: 520 },
            { region: "South Asia", revenue: 54900, products_sold: 310, customers: 125 },
            { region: "Oceania", revenue: 38700, products_sold: 220, customers: 80 },
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
          console.error("Error fetching report data:", error);
          return json(
            {
              success: false,
              error: {
                code: "SERVER_ERROR",
                message: error instanceof Error ? error.message : "Failed to fetch report data",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
