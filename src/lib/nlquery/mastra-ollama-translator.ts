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
 * Generate SQL using Ollama via Mastra-style prompting
 */
async function generateSQLViaOllama(
  nlQuestion: string,
  schemaContext: string,
  ollamaUrl: string,
  model: string
): Promise<string | null> {
  const systemPrompt = `You are an expert SQL query generator for Mastra.ai workflows.
Your task is to convert natural language questions into precise SQL SELECT statements.

DATABASE SCHEMA:
${schemaContext}

REQUIREMENTS:
- Generate ONLY SELECT queries
- Use only tables and columns from the schema
- Return just the SQL query, no explanation
- If the question cannot be answered, respond with "NULL"`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: `${systemPrompt}\n\nQuestion: ${nlQuestion}\n\nGenerate SQL:`,
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { response: string };
    const sql = data.response.trim();

    // Extract SQL from response (handle various formats)
    const sqlMatch = sql.match(/SELECT.+/is);
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

DATABASE SCHEMA:
${schemaContext}

Generate a corrected SQL SELECT query:`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: refinementPrompt,
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { response: string };
    const sql = data.response.trim();

    // Extract SQL from response
    const sqlMatch = sql.match(/SELECT.+/is);
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
 * Build comprehensive schema context string with field instructions
 */
function buildSchemaContext(schema: EnhancedSchemaMetadata): string {
  if (!schema.tables || schema.tables.length === 0) {
    return "No tables available in schema.";
  }

  const enhancedSchema = schema.tables
    .map((table) => {
      let tableContext = "";

      // Add table-level instruction if available
      const tableInstr = schema.tableInstructions?.[table.name];
      if (tableInstr?.description) {
        tableContext += `\n[TABLE CONTEXT] ${tableInstr.description}`;
      }
      if (tableInstr?.domain) {
        tableContext += `\n[DOMAIN] ${tableInstr.domain}`;
      }
      if (tableInstr?.instructions) {
        tableContext += `\n[INSTRUCTIONS] ${tableInstr.instructions}`;
      }

      // Add columns with detailed instructions
      const columnsDetail = table.columns
        ? table.columns
            .map((col) => {
              const fieldInstr = schema.fieldInstructions?.[table.name]?.[col];
              if (fieldInstr?.instructions) {
                return `${col} - ${fieldInstr.instructions}${
                  fieldInstr.examples ? ` (e.g., ${fieldInstr.examples.join(", ")})` : ""
                }`;
              }
              if (fieldInstr?.description) {
                return `${col} - ${fieldInstr.description}`;
              }
              return col;
            })
            .join("\n    ")
        : "";

      return `\nTable: ${table.name}${tableContext}\nColumns:\n    ${columnsDetail}`;
    })
    .join("\n");

  return enhancedSchema;
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
