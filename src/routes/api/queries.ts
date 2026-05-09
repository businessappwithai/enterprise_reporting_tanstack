import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { getDb } from "@/lib/db/config";
import { verifySession } from "@/lib/auth/session";
import type { SavedQuery } from "@/types/database";
import { randomUUID } from "crypto";

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

          const queries = await db<SavedQuery>("saved_queries")
            .orderBy("created_at", "desc")
            .limit(pageSize)
            .offset(page * pageSize);

          const countResult = await db<SavedQuery>("saved_queries").count("* as count").first();
          const total = Number((countResult as { count?: string })?.count || 0);

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

          const queryId = randomUUID();
          const db = getDb();

          await db("saved_queries").insert({
            id: queryId,
            name,
            description: description || null,
            data_source_id: dataSourceId,
            sql_content: sqlContent,
            parameters_schema: parametersSchema || null,
            created_by: session.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

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
