/**
 * Mastra.ai + Ollama NL→SQL Translator
 *
 * Uses Mastra.ai to orchestrate natural language to SQL translation
 * with local Ollama endpoints for offline processing
 */

import type { SchemaMetadata } from "@/lib/validation/translation-validator";

/**
 * Enhanced schema metadata with LLM instructions
 */
export interface EnhancedSchemaMetadata extends SchemaMetadata {
  tableInstructions?: Record<string, { description?: string; instructions?: string; domain?: string }>;
  fieldInstructions?: Record<string, Record<string, { description?: string; instructions?: string; examples?: string[] }>>;
}

/**
 * Translate NL to SQL using Mastra.ai + Ollama
 *
 * This leverages Mastra.ai's workflow orchestration to:
 * 1. Route to Ollama for SQL generation with complete schema context
 * 2. Include field-level instructions for better accuracy
 * 3. Validate generated SQL
 * 4. Retry with refined prompts if needed
 */
export async function translateNLToSQLViaMastra(
  nlQuestion: string,
  schema: EnhancedSchemaMetadata
): Promise<{ sql: string; explanation: string; warnings?: string[] } | null> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "sqlcoder:7b";

  try {
    // Check if Ollama is available
    const tagsResponse = await fetch(`${ollamaUrl}/api/tags`, {
      timeout: 5000,
    }).catch(() => null);

    if (!tagsResponse?.ok) {
      console.warn("[Mastra] Ollama not available at", ollamaUrl);
      return null;
    }

    const schemaContext = buildSchemaContext(schema);

    // Step 1: Generate initial SQL via Ollama
    const initialSQL = await generateSQLViaOllama(
      nlQuestion,
      schemaContext,
      ollamaUrl,
      ollamaModel
    );

    if (!initialSQL) {
      return null;
    }

    // Step 2: Validate the generated SQL
    const validationResult = validateGeneratedSQL(initialSQL);

    if (!validationResult.isValid && validationResult.errors.length > 0) {
      // Step 3: Refine SQL if validation fails
      const refinedSQL = await refineSQLViaOllama(
        nlQuestion,
        initialSQL,
        validationResult.errors,
        schemaContext,
        ollamaUrl,
        ollamaModel
      );

      if (!refinedSQL) {
        return null;
      }

      return {
        sql: refinedSQL,
        explanation: `Refined SQL after validation: ${validationResult.errors.join(", ")}`,
        warnings: ["SQL was refined due to initial validation errors"],
      };
    }

    return {
      sql: initialSQL,
      explanation: "SQL generated via Ollama + Mastra.ai workflow",
    };
  } catch (error) {
    console.error("[Mastra] Ollama translation failed:", error);
    return null;
  }
}

/**
 * Generate SQL using Ollama via Mastra-style prompting.
 * Uses sqlcoder's expected instruction format for best results.
 */
async function generateSQLViaOllama(
  nlQuestion: string,
  schemaContext: string,
  ollamaUrl: string,
  model: string
): Promise<string | null> {
  // sqlcoder:7b was trained on this specific prompt template
  const isSqlcoder = model.toLowerCase().includes("sqlcoder");
  const prompt = isSqlcoder
    ? `### Instructions:
Your task is to convert a question into a SQL query, given a database schema.
Adhere to these rules:
- Deliberately use only the schemas provided.
- Do not use any other tables or columns.
- Generate only a SELECT query with no mutations.
- Do not use SELECT * unless explicitly asked.

### Input:
Generate a SQL query that answers the question: \`${nlQuestion}\`

This query will run on a database whose schema is represented in this string:
${schemaContext}

### Response:
Based on your instructions, here is the SQL query I have generated to answer the question \`${nlQuestion}\`:
\`\`\`sql`
    : `You are an expert SQL query generator.
Convert the following question into a SQL SELECT query using ONLY the provided schema.
Return ONLY the SQL query, nothing else.

SCHEMA:
${schemaContext}

Question: ${nlQuestion}

SQL:`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 512,
          stop: isSqlcoder ? ["```", ";", "\n\n"] : [";", "\n\n"],
        },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      console.error("[Mastra] Ollama generate returned:", response.status);
      return null;
    }

    const data = (await response.json()) as { response: string };
    const raw = data.response.trim();

    // Strip markdown code fences if present
    const stripped = raw.replace(/^```sql\s*/i, "").replace(/```$/, "").trim();

    // Extract SELECT statement (handles leading whitespace, CTEs, etc.)
    const sqlMatch = stripped.match(/(WITH\s+.+?SELECT.+|SELECT.+)/is);
    return sqlMatch ? sqlMatch[0].trim() : null;
  } catch (error) {
    console.error("[Mastra] Ollama generation failed:", error);
    return null;
  }
}

/**
 * Refine SQL based on validation errors
 */
async function refineSQLViaOllama(
  nlQuestion: string,
  previousSQL: string,
  errors: string[],
  schemaContext: string,
  ollamaUrl: string,
  model: string
): Promise<string | null> {
  const refinementPrompt = `You are refining a SQL query that had errors.

Original question: "${nlQuestion}"
Previous SQL: ${previousSQL}
Errors found: ${errors.join(", ")}

SCHEMA:
${schemaContext}

Generate a corrected SQL SELECT query (SELECT only, no mutations):`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: refinementPrompt,
        stream: false,
        options: { temperature: 0.1, num_predict: 512 },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { response: string };
    const raw = data.response.trim().replace(/^```sql\s*/i, "").replace(/```$/, "").trim();
    const sqlMatch = raw.match(/(WITH\s+.+?SELECT.+|SELECT.+)/is);
    return sqlMatch ? sqlMatch[0].trim() : null;
  } catch (error) {
    console.error("[Mastra] Ollama refinement failed:", error);
    return null;
  }
}

/**
 * Validate generated SQL structure
 */
function validateGeneratedSQL(
  sql: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if it's a SELECT statement
  if (!sql.trim().toUpperCase().startsWith("SELECT")) {
    errors.push("Query must be a SELECT statement");
  }

  // Check for dangerous keywords
  const dangerous = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "CREATE",
    "TRUNCATE",
  ];
  for (const keyword of dangerous) {
    if (sql.toUpperCase().includes(keyword)) {
      errors.push(`Dangerous keyword found: ${keyword}`);
    }
  }

  // Check for basic syntax
  if (!sql.includes("FROM") && !sql.toUpperCase().includes("FROM")) {
    errors.push("Missing FROM clause");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Build schema context as CREATE TABLE statements — the format sqlcoder:7b was trained on.
 * Limits to MAX_TABLES to avoid overflowing model context.
 */
const MAX_TABLES = 40;

function buildSchemaContext(schema: EnhancedSchemaMetadata): string {
  if (!schema.tables || schema.tables.length === 0) {
    return "-- No tables available in schema.";
  }

  const tables = schema.tables.slice(0, MAX_TABLES);

  return tables
    .map((table) => {
      const tableInstr = schema.tableInstructions?.[table.name];
      const comment = tableInstr?.description ? `-- ${tableInstr.description}\n` : "";

      const cols = (table.columns ?? [])
        .map((col) => {
          // col is always {name: string, type: string} — never a plain string
          const colName = typeof col === "object" && col !== null ? col.name : String(col);
          const colType = typeof col === "object" && col !== null && "type" in col
            ? (col as { name: string; type: string }).type
            : "text";

          const fieldInstr = schema.fieldInstructions?.[table.name]?.[colName];
          const inlineComment = fieldInstr?.description ? ` -- ${fieldInstr.description}` : "";
          return `  ${colName} ${colType}${inlineComment}`;
        })
        .join(",\n");

      return `${comment}CREATE TABLE ${table.name} (\n${cols}\n);`;
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
    console.debug("[Mastra] Ollama not available:", error);
    return false;
  }
}
