import { createFileRoute } from "@tanstack/react-router";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { json } from "@/lib/server/response";
import { sqlEditorConfig, validatePageSize } from "@/lib/config/pagination";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/logs/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const body = (await request.json()) as {
            level: "info" | "warn" | "error" | "debug";
            message: string;
            component: string;
            metadata?: Record<string, unknown>;
            errorStack?: string;
          };

          const db = getDb();

          await db
            .insertInto("logs")
            .values({
              timestamp: new Date(),
              level: body.level,
              message: body.message,
              component: body.component,
              user_id: session.user.id as any,
              metadata: body.metadata ? JSON.stringify(body.metadata) : null,
              error_stack: body.errorStack,
            })
            .execute();

          return json({ success: true });
        } catch (error) {
          console.error("[LOGS API ERROR]", error);
          return json(
            {
              success: false,
              error: {
                code: "ERROR",
                message: error instanceof Error ? error.message : "Unknown error",
              },
            },
            { status: 500 }
          );
        }
      },

      GET: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const url = new URL(request.url);
          const level = url.searchParams.get("level");
          const component = url.searchParams.get("component");
          const userId = url.searchParams.get("userId");
          const limit = validatePageSize(parseInt(url.searchParams.get("limit") || "100", 10));
          const offset = parseInt(url.searchParams.get("offset") || "0", 10);

          const db = getDb();

          // Check if user is admin
          const userWithRoles = await db
            .selectFrom("users")
            .selectAll()
            .where("id", "=", session.user.id as any)
            .executeTakeFirst();

          const isAdmin = userWithRoles?.is_admin || false;

          // Non-admins can only see their own logs
          const filterByUserId = userId && isAdmin ? userId : session.user.id;

          let query = db
            .selectFrom("logs")
            .selectAll()
            .where("user_id", "=", filterByUserId as any);

          if (level) {
            query = query.where("level", "=", level);
          }

          if (component) {
            query = query.where("component", "=", component);
          }

          query = query.orderBy("timestamp", "desc");

          const logsQuery = query.limit(limit).offset(offset);

          const logs = await logsQuery.execute();

          const countQuery = db
            .selectFrom("logs")
            .select(db.fn.count<number>("id").as("count"))
            .where("user_id", "=", filterByUserId as any);

          let countQueryWithFilters = countQuery;

          if (level) {
            countQueryWithFilters = countQueryWithFilters.where("level", "=", level);
          }

          if (component) {
            countQueryWithFilters = countQueryWithFilters.where("component", "=", component);
          }

          const countResult = await countQueryWithFilters.executeTakeFirst();
          const totalCount = countResult?.count || 0;

          // Enrich logs with user email
          const logsWithEmail = await Promise.all(
            logs.map(async (log) => {
              const user = await db
                .selectFrom("users")
                .select(["id", "email"])
                .where("id", "=", log.user_id as any)
                .executeTakeFirst();
              return {
                ...log,
                user_email: user?.email || "unknown",
              };
            })
          );

          return json({
            success: true,
            data: {
              logs: logsWithEmail,
              pagination: {
                limit,
                offset,
                totalCount,
                hasMore: offset + logs.length < totalCount,
              },
            },
          });
        } catch (error) {
          console.error("[LOGS GET ERROR]", error);
          return json(
            {
              success: false,
              error: {
                code: "ERROR",
                message: error instanceof Error ? error.message : "Unknown error",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
