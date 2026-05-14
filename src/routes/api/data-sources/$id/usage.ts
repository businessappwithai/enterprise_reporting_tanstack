import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/data-sources/$id/usage")({
  server: {
    handlers: {
      GET: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: { message: "Unauthorized" } }, { status: 401 });
          }

          const db = getDb();

          // Check if data source exists
          const dataSource = await db
            .selectFrom("data_sources")
            .select("id")
            .where("id", "=", params.id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Count usage across different resources
          let queries = 0;
          let reports = 0;
          let charts = 0;

          try {
            const queriesResult = await db
              .selectFrom("saved_queries")
              .select(db.fn.count("id").as("count"))
              .where("data_source_id", "=", params.id)
              .executeTakeFirst();
            queries = parseInt(queriesResult?.count?.toString() || "0", 10);
          } catch {
            // Table may not exist, default to 0
          }

          try {
            const reportsResult = await db
              .selectFrom("reports")
              .select(db.fn.count("id").as("count"))
              .where("data_source_id", "=", params.id)
              .executeTakeFirst();
            reports = parseInt(reportsResult?.count?.toString() || "0", 10);
          } catch {
            // Table may not exist, default to 0
          }

          try {
            const chartsResult = await db
              .selectFrom("charts")
              .select(db.fn.count("id").as("count"))
              .where("data_source_id", "=", params.id)
              .executeTakeFirst();
            charts = parseInt(chartsResult?.count?.toString() || "0", 10);
          } catch {
            // Table may not exist, default to 0
          }

          return json({
            success: true,
            data: {
              queries,
              reports,
              charts,
            },
          });
        } catch (error) {
          console.error("Data source usage error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Internal server error",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
