import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { getConnection } from "@/lib/db/connection-manager";
import { translateNLToSQLViaLlama } from "@/lib/nlquery/llama-translator";
import { sql } from "kysely";

/**
 * CopilotKit Runtime Endpoint
 * Provides agent and action configuration for CopilotKit client
 * Handles NL→SQL translation for Hospital Management System with llama.cpp
 */

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

const runtimeConfig = {
  agents: [
    {
      name: "default",
      description: "SQL Query Assistant - Converts natural language to SQL for Hospital Management",
      instructions: "You are a helpful SQL assistant that converts natural language questions into SQL queries. You have access to the hospital management database and can help users query patient data, diagnoses, treatments, and statistics. Always generate safe, read-only SELECT queries.",
    },
  ],
  actions: [
    {
      name: "generateSQL",
      description: "Convert a natural language question into a SQL query",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The natural language question to convert to SQL",
          },
        },
        required: ["question"],
      },
    },
    {
      name: "executeSQL",
      description: "Execute a SQL query against the hospital management database",
      parameters: {
        type: "object",
        properties: {
          sql: {
            type: "string",
            description: "The SQL query to execute",
          },
        },
        required: ["sql"],
      },
    },
  ],
};

export const Route = createFileRoute("/api/copilotkit")({
  server: {
    handlers: {
      GET: async () => {
        console.log("[CopilotKit] GET /api/copilotkit - returning runtime config");
        return json(runtimeConfig);
      },

      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const path = body.path || "";
          console.log("[CopilotKit] POST", path, "- processing request");

          // Handle runtime info endpoint
          if (path === "/info") {
            console.log("[CopilotKit] Returning runtime info");
            return json(runtimeConfig);
          }

          // Handle execute action
          if (path && path.includes("execute")) {
            const session = await getSession(request);
            if (!session?.user) {
              return json({ error: "Unauthorized" }, { status: 401 });
            }

            const nlQuestion =
              body.input?.message ||
              body.input?.question ||
              body.nlQuestion ||
              "";

            if (!nlQuestion) {
              return json({
                success: false,
                error: "No question provided",
              });
            }

            try {
              console.log("[CopilotKit] Generating SQL for:", nlQuestion);

              const dataSourceId = body.input?.dataSourceId || body.dataSourceId;

              // Resolve the target connection: use selected data source if provided,
              // otherwise fall back to the main app DB.
              let targetDb: ReturnType<typeof getDb>;
              if (dataSourceId) {
                const appDb = getDb();
                const dataSource = await appDb
                  .selectFrom("data_sources")
                  .selectAll()
                  .where("id", "=", dataSourceId)
                  .where("is_deleted", "=", false)
                  .executeTakeFirst();
                if (dataSource) {
                  targetDb = await getConnection(dataSource as any) as any;
                } else {
                  targetDb = getDb();
                }
              } else {
                targetDb = getDb();
              }

              // Query the target data source's schema
              const tablesResult = await sql<{ table_name: string }>`
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
                ORDER BY table_name
              `.execute(targetDb);

              const allTableNames = tablesResult.rows.map((r) => r.table_name);

              // Score tables by keyword relevance to the question so the most relevant
              // tables appear first (and stay within the context window limit).
              const questionLower = nlQuestion.toLowerCase();
              const scored = allTableNames.map((name) => {
                const nameLower = name.toLowerCase().replace(/^bus_/, "");
                const words = nameLower.split(/[_\s]+/);
                const score = words.reduce(
                  (acc, w) => acc + (questionLower.includes(w) && w.length > 2 ? 1 : 0),
                  0
                );
                return { name, score };
              });
              scored.sort((a, b) => b.score - a.score);
              // Take top 40 — translator will further cap at its MAX_TABLES limit
              const relevantTables = scored.slice(0, 40).map((s) => s.name);

              // Fetch columns only for the selected tables (one query per table)
              const schemaTablesList = await Promise.all(
                relevantTables.map(async (tableName) => {
                  const colsResult = await sql<{ column_name: string; data_type: string }>`
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = ${tableName}
                    ORDER BY ordinal_position
                  `.execute(targetDb);
                  return {
                    name: tableName,
                    columns: colsResult.rows.map((c) => ({ name: c.column_name, type: c.data_type })),
                  };
                })
              );

              const schema = { tables: schemaTablesList };

              // Translate NL to SQL using llama.cpp with RBAC validation
              const result = await translateNLToSQLViaLlama(
                nlQuestion,
                schema as any,
                session.user.id,
                dataSourceId
              );

              if (!result) {
                console.error(
                  "[CopilotKit] Failed to translate query - llama.cpp reasoning server unavailable"
                );
                return json({
                  success: false,
                  error:
                    "Failed to translate query. Ensure llama.cpp reasoning server is running (set LLAMA_REASONING_URL environment variable if not on default port 8080) with Qwen3.6 model.",
                });
              }

              console.log("[CopilotKit] SQL generated:", result.sql);

              return json({
                success: true,
                result: {
                  sql: result.sql,
                  explanation: result.explanation || "SQL generated via Qwen3.6",
                  warnings: result.warnings || [],
                },
              });
            } catch (error) {
              console.error("[CopilotKit] Translation error:", error);
              return json({
                success: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to generate SQL",
              });
            }
          }

          // Default: return runtime config
          console.log("[CopilotKit] Returning default runtime config");
          return json(runtimeConfig);
        } catch (error) {
          console.error("[CopilotKit] Request error:", error);
          return json(runtimeConfig);
        }
      },
    },
  },
});
