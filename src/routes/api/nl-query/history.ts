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

export const Route = createFileRoute("/api/nl-query/history")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
          }

          const url = new URL(request.url);
          const dataSourceId = url.searchParams.get("data_source_id");
          const limit = parseInt(url.searchParams.get("limit") || "50");
          const offset = parseInt(url.searchParams.get("offset") || "0");

          const db = getDb();

          let query = db
            .selectFrom("saved_queries")
            .selectAll()
            .orderBy("created_at", "desc")
            .limit(limit)
            .offset(offset);

          if (dataSourceId) {
            query = query.where("data_source_id", "=", dataSourceId);
          }

          const results = await query.execute();

          return json({
            success: true,
            data: results.map((q) => ({
              id: q.id,
              query: q.name,
              generated_sql: q.sql,
              created_at: q.created_at,
            })),
          });
        } catch (error) {
          console.error("History fetch error:", error);
          return json(
            {
              success: false,
              error: {
                message: error instanceof Error ? error.message : "Failed to fetch history",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
