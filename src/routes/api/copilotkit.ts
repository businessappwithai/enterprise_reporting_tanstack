import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { translateNLToSQLViaMastra } from "@/lib/nlquery/mastra-ollama-translator";

/**
 * CopilotKit Runtime Endpoint
 * Provides agent and action configuration for CopilotKit client
 * Handles NL→SQL translation for Hospital Management System with Ollama
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

              // Get database schema
              const db = getDb();
              const tables = await db
                .selectFrom("information_schema.tables")
                .where("table_schema", "=", "public")
                .select("table_name")
                .execute();

              const schema = {
                tables: tables.map((t: any) => ({
                  name: t.table_name,
                  description: `Table: ${t.table_name}`,
                })),
              };

              // Translate NL to SQL using Ollama
              const result = await translateNLToSQLViaMastra(
                nlQuestion,
                schema as any
              );

              if (!result) {
                console.error(
                  "[CopilotKit] Failed to translate query - Ollama unavailable"
                );
                return json({
                  success: false,
                  error:
                    "Failed to translate query. Ensure Ollama is running locally with sqlcoder model.",
                });
              }

              console.log("[CopilotKit] SQL generated:", result.sql);

              return json({
                success: true,
                result: {
                  sql: result.sql,
                  explanation: result.explanation || "SQL generated via Ollama",
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
