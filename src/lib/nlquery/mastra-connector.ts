/**
 * Mastra.ai Agent Connector
 *
 * Connects to a running Mastra.ai server for NL→SQL translation
 * Enhanced with pgvector context for improved accuracy
 */

import type { SchemaMetadata } from "@/lib/validation/translation-validator";
import { buildMastraContextPrompt } from "./nl-query-context-service";

export interface MastraAgentRequest {
  nlQuestion: string;
  schema: SchemaMetadata;
  context?: Record<string, unknown>;
  contextPrompt?: string; // Enhanced context with similar successful queries
}

export interface MastraAgentResponse {
  sql: string;
  explanation: string;
  confidence?: number;
  warnings?: string[];
  canExecute?: boolean; // Whether the query should be allowed based on RBAC
  executionReason?: string; // Why it can/can't be executed
}

/**
 * Check if Mastra agent is available
 */
export async function isMastraAvailable(): Promise<boolean> {
  const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${mastraUrl}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Translate NL to SQL using Mastra.ai agent with enhanced context
 */
export async function translateNLToSQLViaMastra(
  nlQuestion: string,
  schema: SchemaMetadata,
  context?: Record<string, unknown>,
  contextPrompt?: string
): Promise<MastraAgentResponse | null> {
  const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";

  try {
    // Include pgvector-enhanced context if provided
    const enhancedContext = contextPrompt
      ? {
          ...context,
          contextFromSimilarQueries: contextPrompt,
        }
      : context;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${mastraUrl}/api/nl-to-sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nlQuestion,
        schema,
        context: enhancedContext,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[Mastra] Translation failed with status ${response.status}`);
      return null;
    }

    const data = (await response.json()) as MastraAgentResponse;
    return data;
  } catch (error) {
    console.error("[Mastra] Connection error:", error);
    return null;
  }
}

/**
 * Validate SQL using Mastra.ai
 */
export async function validateSQLViaMastra(sql: string): Promise<{ isValid: boolean; errors: string[] }> {
  const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${mastraUrl}/api/validate-sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { isValid: false, errors: ["Validation failed"] };
    }

    const data = (await response.json()) as { isValid: boolean; errors?: string[] };
    return { ...data, errors: data.errors || [] };
  } catch (error) {
    console.error("[Mastra] Validation error:", error);
    return { isValid: false, errors: ["Validation service unavailable"] };
  }
}
