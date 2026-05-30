import { createFileRoute } from "@tanstack/react-router";
import { sql } from "kysely";
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

          // Keyword-based table matching fallback
          const queryWords = query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
          const keywordMatched = await (async () => {
            try {
              const allSchema = await sql<{ table_name: string; schema_text: string; sample_data: string | null }>`
                SELECT table_name, schema_text, sample_data::text
                FROM nl_schema_embeddings
                WHERE data_source_id = ${data_source_id}
                  AND table_name LIKE 'bus_%'
              `.execute(connection);

              const matched: typeof relevantSchema = [];
              const alreadyFound = new Set(relevantSchema.map((s) => s.tableName));

              for (const row of allSchema.rows) {
                if (alreadyFound.has(row.table_name)) continue;
                const tableStem = row.table_name.replace("bus_", "").replace(/_/g, " ");
                const tableWords = tableStem.split(" ");
                const isMatch = queryWords.some((qw: string) =>
                  tableWords.some((tw) => tw.startsWith(qw) || qw.startsWith(tw))
                );
                if (isMatch) {
                  matched.push({
                    tableName: row.table_name,
                    schemaText: row.schema_text,
                    sampleData: row.sample_data ? JSON.parse(row.sample_data) : null,
                    similarity: 0.5,
                  });
                }
              }
              return matched.slice(0, 5);
            } catch {
              return [];
            }
          })();

          const allRelevantSchema = [...relevantSchema, ...keywordMatched];

          const contextParts: string[] = [];

          if (similarQueries.length > 0) {
            contextParts.push("SIMILAR PAST QUERIES THAT WORKED:");
            for (const q of similarQueries) {
              contextParts.push(`  Q: "${q.naturalLanguageQuery}"`);
              contextParts.push(`  SQL: ${q.generatedSql}`);
              contextParts.push("");
            }
          }

          if (allRelevantSchema.length > 0) {
            contextParts.push("RELEVANT TABLE SCHEMAS:");
            for (const s of allRelevantSchema.slice(0, 3)) {
              contextParts.push(`  ${s.schemaText}`);
              if (s.sampleData && s.sampleData.length > 0) {
                const keys = Object.keys(s.sampleData[0]);
                const vals = keys.map((k) => `${k}=${s.sampleData![0][k]}`).join(", ");
                contextParts.push(`  Example row: ${vals}`);
              }
            }
          }

          return json({
            success: true,
            data: {
              similarQueries,
              relevantSchema: allRelevantSchema,
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
