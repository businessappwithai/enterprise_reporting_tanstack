import { randomUUID } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/queries")({
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

          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get("page") || "0", 10);
          const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);

          const db = getDb();

          const queries = await db
            .selectFrom("saved_queries")
            .selectAll()
            .orderBy("created_at", "desc")
            .limit(pageSize)
            .offset(page * pageSize)
            .execute();

          const countResult = await db
            .selectFrom("saved_queries")
            .select(db.fn.count<number>("id").as("count"))
            .executeTakeFirstOrThrow();
          const total = Number(countResult.count);

          return json({
            success: true,
            data: {
              items: queries,
              meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            },
          });
        } catch (error) {
          console.error("Error fetching queries:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch queries" } },
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

          const body = (await request.json()) as {
            name: string;
            description?: string;
            dataSourceId: string;
            sqlContent: string;
            parametersSchema?: unknown;
          };

          const { name, description, dataSourceId, sqlContent, parametersSchema } = body;

          if (!name || !dataSourceId || !sqlContent) {
            return json(
              {
                success: false,
                error: {
                  code: "INVALID_INPUT",
                  message: "Name, dataSourceId, and sqlContent are required",
                },
              },
              { status: 400 }
            );
          }

          const db = getDb();
          const queryId = randomUUID();
          const now = new Date().toISOString();

          await db
            .insertInto("saved_queries")
            .values({
              id: queryId,
              name,
              description: description ?? null,
              data_source_id: dataSourceId,
              sql_content: sqlContent,
              parameters_schema: parametersSchema ? JSON.stringify(parametersSchema) : null,
              is_validated: false,
              validation_result: null,
              is_deleted: false,
              deleted_at: null,
              deleted_by: null,
              created_by: session.user.id,
              created_at: now,
              updated_at: now,
            })
            .execute();

          return json({ success: true, data: { id: queryId } }, { status: 201 });
        } catch (error) {
          console.error("Error creating query:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to create query" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
