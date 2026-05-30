import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { getConnection } from "@/lib/db/connection-manager";
import { findSimilarQueries, findRelevantSchema } from "@/lib/mastra/rag-store";
import type { DataSource } from "@/types/database";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/nl-query/rag-context")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
          }

          const body = await request.json();
          const { query, data_source_id } = body;

          if (!query || !data_source_id) {
            return json(
              { success: false, error: { message: "query and data_source_id are required" } },
              { status: 400 },
            );
          }

          const db = getDb();
          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", data_source_id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { success: false, error: { message: "Data source not found" } },
              { status: 404 },
            );
          }

          const connection = await getConnection(dataSource as unknown as DataSource);

          const [similarQueries, relevantSchema] = await Promise.all([
            findSimilarQueries(connection, data_source_id, query, 3),
            findRelevantSchema(connection, data_source_id, query, 5),
          ]);

          const contextParts: string[] = [];

          if (similarQueries.length > 0) {
            contextParts.push("SIMILAR PAST QUERIES THAT WORKED:");
            for (const q of similarQueries) {
              contextParts.push(`  Q: "${q.naturalLanguageQuery}"`);
              contextParts.push(`  SQL: ${q.generatedSql}`);
              contextParts.push("");
            }
          }

          if (relevantSchema.length > 0) {
            contextParts.push("RELEVANT TABLES WITH SAMPLE DATA:");
            for (const s of relevantSchema) {
              contextParts.push(`  ${s.schemaText}`);
              if (s.sampleData && s.sampleData.length > 0) {
                contextParts.push(`  Samples: ${JSON.stringify(s.sampleData.slice(0, 3))}`);
              }
              contextParts.push("");
            }
          }

          return json({
            success: true,
            data: {
              similarQueries,
              relevantSchema,
              contextText: contextParts.join("\n"),
            },
          });
        } catch (error) {
          console.error("RAG context error:", error);
          return json(
            {
              success: false,
              error: {
                message: error instanceof Error ? error.message : "Failed to fetch RAG context",
              },
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
