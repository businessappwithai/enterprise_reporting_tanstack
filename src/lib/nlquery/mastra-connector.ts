/**
 * Mastra.ai Agent Connector
 *
 * Connects to a running Mastra.ai server for NL→SQL translation
 */

import type { SchemaMetadata } from "@/lib/validation/translation-validator";

export interface MastraAgentRequest {
  nlQuestion: string;
  schema: SchemaMetadata;
  context?: Record<string, unknown>;
}

export interface MastraAgentResponse {
  sql: string;
  explanation: string;
  confidence?: number;
  warnings?: string[];
}

/**
 * Check if Mastra agent is available
 */
export async function isMastraAvailable(): Promise<boolean> {
  const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";
  try {
    const response = await fetch(`${mastraUrl}/health`, {
      timeout: 5000,
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Translate NL to SQL using Mastra.ai agent
 */
export async function translateNLToSQLViaMastra(
  nlQuestion: string,
  schema: SchemaMetadata,
  context?: Record<string, unknown>
): Promise<MastraAgentResponse | null> {
  const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";

  try {
    const response = await fetch(`${mastraUrl}/api/nl-to-sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nlQuestion,
        schema,
        context,
      }),
      timeout: 30000,
    });

    if (!response.ok) {
      console.error(`[Mastra] Translation failed with status ${response.status}`);
      return null;
    }

    const data = await response.json() as MastraAgentResponse;
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
    const response = await fetch(`${mastraUrl}/api/validate-sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
      timeout: 10000,
    });

    if (!response.ok) {
      return { isValid: false, errors: ["Validation failed"] };
    }

    const data = await response.json() as { isValid: boolean; errors?: string[] };
    return data;
  } catch (error) {
    console.error("[Mastra] Validation error:", error);
    return { isValid: false, errors: ["Validation service unavailable"] };
  }
}
