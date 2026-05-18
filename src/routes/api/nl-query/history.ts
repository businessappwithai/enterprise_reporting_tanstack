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
          const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
          const offset = parseInt(url.searchParams.get("offset") || "0");
          // scope=role returns all successful queries for the user's primary role
          const scope = url.searchParams.get("scope") || "role";

          const db = getDb();

          // Primary role from JWT session (no extra DB call needed)
          const primaryRole = session.user.roles?.[0] ?? "viewer";

          let query = db
            .selectFrom("nl_query_context")
            .select([
              "id",
              "nl_question",
              "generated_sql",
              "data_source_id",
              "role_name",
              "user_id",
              "was_successful",
              "row_count",
              "execution_time_ms",
              "created_at",
            ])
            .where("was_successful", "=", true)
            .orderBy("created_at", "desc")
            .limit(limit)
            .offset(offset);

          if (dataSourceId) {
            query = query.where("data_source_id", "=", dataSourceId);
          }

          if (scope === "role") {
            // Show all successful queries for the same role (shared history)
            query = query.where("role_name", "=", primaryRole);
          } else {
            // Personal history: only the current user's queries
            query = query.where("user_id", "=", session.user.id);
          }

          const results = await query.execute();

          const totalQuery = db
            .selectFrom("nl_query_context")
            .select(db.fn.countAll().as("count"))
            .where("was_successful", "=", true);

          const [{ count }] = await (dataSourceId
            ? totalQuery.where("data_source_id", "=", dataSourceId)
            : totalQuery
          )
            .where(scope === "role" ? "role_name" : "user_id", "=", scope === "role" ? primaryRole : session.user.id)
            .execute();

          return json({
            success: true,
            data: results,
            meta: { total: Number(count), limit, offset },
          });
        } catch (error) {
          console.error("History fetch error:", error);
          return json(
            { success: false, error: { message: error instanceof Error ? error.message : "Failed to fetch history" } },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
          }

          const body = await request.json().catch(() => ({}));
          const { nl_question, generated_sql, data_source_id, row_count, execution_time_ms, was_successful } = body;

          if (!nl_question || !generated_sql) {
            return json({ success: false, error: { message: "nl_question and generated_sql are required" } }, { status: 400 });
          }

          const db = getDb();
          const primaryRole = session.user.roles?.[0] ?? "viewer";

          const id = crypto.randomUUID().replace(/-/g, "");

          await db
            .insertInto("nl_query_context")
            .values({
              id,
              nl_question,
              generated_sql,
              data_source_id: data_source_id || "",
              user_id: session.user.id,
              role_name: primaryRole,
              schema_context: "{}",
              rbac_context: "{}",
              row_count: row_count ?? 0,
              execution_time_ms: execution_time_ms ?? 0,
              was_successful: was_successful ?? true,
              created_by: session.user.id,
            })
            .execute();

          return json({ success: true, data: { id } });
        } catch (error) {
          console.error("History save error:", error);
          return json(
            { success: false, error: { message: error instanceof Error ? error.message : "Failed to save history" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
