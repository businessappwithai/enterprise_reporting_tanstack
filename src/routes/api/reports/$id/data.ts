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

          if (!report.saved_query_id) {
            return json({ success: true, data: { rows: [], totalRows: 0 } });
          }

          // Get the query
          const query = await db
            .selectFrom("saved_queries")
            .selectAll()
            .where("id", "=", report.saved_query_id)
            .executeTakeFirst();

          if (!query) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Query not found" } },
              { status: 404 }
            );
          }

          // Get the data source
          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", query.data_source_id)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Get connection and execute query
          const connection = await getConnection(dataSource);

          // Execute query with pagination
          const offset = page * pageSize;
          const sql = query.sql_content;

          // Add LIMIT and OFFSET for pagination
          let paginatedSql = sql;
          if (!sql.toUpperCase().includes("LIMIT")) {
            paginatedSql += ` LIMIT ${pageSize} OFFSET ${offset}`;
          }

          // Execute the query
          const result = await connection.query(paginatedSql);

          // Get total count
          const countSql = `SELECT COUNT(*) as count FROM (${sql}) as subquery`;
          const countResult = await connection.query(countSql);
          const totalRows = (countResult.rows?.[0] as { count: number })?.count || 0;

          return json({
            success: true,
            data: {
              rows: result.rows || [],
              totalRows,
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
