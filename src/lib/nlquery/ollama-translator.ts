/**
 * Ollama-powered NL→SQL Translator
 *
 * Converts natural language questions to SQL using local Ollama endpoint.
 * Uses sqlcoder or similar model for SQL generation.
 */

import type { SchemaMetadata } from "@/lib/validation/translation-validator";

interface OllamaResponse {
  response: string;
  done: boolean;
}

/**
 * Generate SQL from natural language question using local Ollama
 */
export async function translateNLToSQLViaOllama(
  nlQuestion: string,
  schema: SchemaMetadata
): Promise<{ sql: string; explanation: string; warnings?: string[] } | null> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "sqlcoder";

  try {
    // Build schema context from metadata
    const schemaContext = buildSchemaContext(schema);

    const systemPrompt = `You are an expert SQL query generator. Your task is to convert natural language questions into SQL SELECT statements.

STRICT REQUIREMENTS:
1. ONLY generate SELECT queries - absolutely NO INSERT, UPDATE, DELETE, DROP, or other mutation statements
2. Use only the tables and columns provided in the schema below
3. Handle NULL values appropriately
4. Assume standard SQL syntax (works across PostgreSQL and SQLite)
5. Provide clear explanations of what the query does

DATABASE SCHEMA:
${schemaContext}

When the user asks a question, generate the most accurate SQL query that answers it.
Return ONLY SELECT statements. If a query is impossible given the schema, return null.

RESPONSE FORMAT:
Return your response in this exact format:
QUERY: <SQL SELECT statement here>
EXPLANATION: <Brief explanation of what the query does>
WARNINGS: <Optional comma-separated list of warnings or assumptions>`;

    const prompt = `${systemPrompt}\n\nUser question: "${nlQuestion}"\n\nGenerate a SQL SELECT query that answers this question.`;

    // Call Ollama API
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error(`[NL→SQL] Ollama API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as OllamaResponse;
    const responseText = data.response;

    // Parse response
    const queryMatch = responseText.match(/QUERY:\s*(.+?)(?=EXPLANATION:|$)/s);
    const explanationMatch = responseText.match(/EXPLANATION:\s*(.+?)(?=WARNINGS:|$)/s);
    const warningsMatch = responseText.match(/WARNINGS:\s*(.+?)$/s);

    const sql = queryMatch?.[1]?.trim() || "";
    const explanation = explanationMatch?.[1]?.trim() || "";
    const warnings = warningsMatch?.[1]?.trim().split(",").map(w => w.trim()).filter(Boolean) || [];

    if (!sql) {
      console.warn("[NL→SQL] No SQL found in Ollama response");
      return null;
    }

    return {
      sql,
      explanation: explanation || "Query generated from natural language question",
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    console.error("[NL→SQL] Ollama translation failed:", error);
    return null;
  }
}

/**
 * Build schema context string from metadata for use in prompts
 */
function buildSchemaContext(schema: SchemaMetadata): string {
  if (!schema.tables || schema.tables.length === 0) {
    return "No tables available in schema.";
  }

  return schema.tables
    .map((table) => {
      const columns = table.columns ? table.columns.map((c) => `  - ${c}`).join("\n") : "";
      return `Table: ${table.name}\n${columns}`;
    })
    .join("\n\n");
}

/**
 * Check if Ollama is available and responding
 */
export async function isOllamaAvailable(): Promise<boolean> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, { timeout: 5000 });
    return response.ok;
  } catch (error) {
    console.debug("[NL→SQL] Ollama not available:", error);
    return false;
  }
}
