import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { translateNLToSQLViaMastra } from "@/lib/nlquery/mastra-ollama-translator";

/**
 * CopilotKit Runtime Endpoint
 * Provides agent and action configuration for CopilotKit client
 * Handles NL→SQL translation for Hospital Management System
 */

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

const agentConfig = {
  agents: [
    {
      name: "default",
      description: "NL Query Agent - Translates natural language to SQL for Hospital Management",
      instructions: "You are an assistant that helps users query databases using natural language. You understand SQL and can help formulate queries based on user questions.",
    },
  ],
  actions: [
    {
      name: "executeNLQuery",
      description: "Execute a natural language query against the database",
      parameters: [
        {
          name: "query",
          type: "string",
          description: "The natural language query",
        },
      ],
    },
  ],
};

export const Route = createFileRoute("/api/copilotkit")({
  server: {
    handlers: {
      GET: async () => {
        console.log("[CopilotKit] GET /api/copilotkit - returning agents config");
        return json(agentConfig);
      },

      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const path = body.path || "";
          console.log("[CopilotKit] POST /api/copilotkit, path:", path);

          // Handle different CopilotKit runtime requests
          if (path === "/info") {
            console.log("[CopilotKit] POST /info - returning agents config");
            return json(agentConfig);
          }

          // Handle agent execution requests
          if (path && path.includes("execute")) {
            console.log("[CopilotKit] POST execute - processing NL query");

            const session = await getSession(request);
            if (!session?.user) {
              return json(
                { error: "Unauthorized" },
                { status: 401 }
              );
            }

            const nlQuestion = body.input?.message || body.nlQuestion || "";
            if (!nlQuestion) {
              return json({
                success: false,
                error: "No question provided",
              });
            }

            try {
              // Get database schema
              const db = getDb();
              const tables = await db
                .selectFrom("metadata_entities")
                .selectAll()
                .execute();

              const schema = {
                tables: tables.map((t: any) => ({
                  name: t.name,
                  description: t.description,
                })),
              };

              // Translate NL to SQL
              const result = await translateNLToSQLViaMastra(nlQuestion, schema as any);

              if (!result) {
                return json({
                  success: false,
                  error: "Failed to translate query. Ensure Ollama is running with a SQL model.",
                });
              }

              return json({
                success: true,
                result: {
                  sql: result.sql,
                  explanation: result.explanation,
                  warnings: result.warnings,
                },
              });
            } catch (error) {
              console.error("[CopilotKit] Query translation error:", error);
              return json({
                success: false,
                error: error instanceof Error ? error.message : "Translation failed",
              });
            }
          }

          console.log("[CopilotKit] POST default - returning agents config");
          return json(agentConfig);
        } catch (error) {
          console.error("[CopilotKit] POST error:", error);
          return json(agentConfig);
        }
      },
    },
  },
});
