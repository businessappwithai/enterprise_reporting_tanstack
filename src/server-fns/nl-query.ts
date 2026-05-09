"use server";

/**
 * Natural Language Query Server Functions
 *
 * Handles NL→SQL translation with validation (D3, D4)
 */

import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/db/config";
import { getConnection } from "@/lib/db/connection-manager";
import { validateSQLWithAllowlist, extractTables } from "@/lib/sql/antlr-validator";
import {
  reverseTranslateSql,
  assessTranslationConfidence,
  type SchemaMetadata,
} from "@/lib/validation/translation-validator";
import { validateQueryAccess } from "@/lib/permissions/query-access-validator";
import { logAudit } from "@/lib/security/audit";
import { requireAuth } from "@/lib/auth/middleware";
import type { DataSource } from "@/types/database";

export interface ExecuteNLQueryInput {
  nlQuestion: string;
  dataSourceId: string;
  timeout?: number;
}

export interface ExecuteNLQueryResult {
  success: boolean;
  sql?: string;
  englishMeaning?: string;
  confidence?: number;
  requiresApproval?: boolean;
  warning?: string;
  rows?: Record<string, unknown>[];
  error?: string;
  rowCount?: number;
  executionTime?: number;
}

const DEFAULT_TIMEOUT = 30000;
const CONFIDENCE_THRESHOLD = 0.9; // D3: ≥90% execute; <90% warn

/**
 * Execute a query generated from natural language
 *
 * Pipeline:
 * 1. NL→SQL translation (OpenAI)
 * 2. ANTLR validation (keyword allowlist)
 * 3. Translation validation (reverse-translate, semantic match)
 * 4. RBAC pre-flight check
 * 5. Execute
 * 6. Log to OpenKB (on success)
 */
export const executeNLQuery = createServerFn({
  method: "POST",
}).handler(async (input: ExecuteNLQueryInput): Promise<ExecuteNLQueryResult> => {
  const session = await requireAuth();
  const { nlQuestion, dataSourceId, timeout = DEFAULT_TIMEOUT } = input;

  if (!nlQuestion || nlQuestion.trim().length === 0) {
    return {
      success: false,
      error: "Natural language question is required",
    };
  }

  if (!dataSourceId) {
    return {
      success: false,
      error: "Data source ID is required",
    };
  }

  const db = getDb();

  // Get data source
  const dataSource = await db
    .selectFrom("data_sources")
    .selectAll()
    .where("id", "=", dataSourceId)
    .where("is_active", "=", true)
    .executeTakeFirst();

  if (!dataSource) {
    return {
      success: false,
      error: "Data source not found or inactive",
    };
  }

  try {
    // [Step 1] Translate NL to SQL (would use OpenAI in real implementation)
    // For MVP, return stub indicating need for OpenAI integration
    const generatedSQL = await nlToSQL(nlQuestion, dataSource);
    if (!generatedSQL) {
      await logAudit({
        userId: session.user.id,
        action: "nl_query_error",
        resourceType: "query",
        resourceId: dataSourceId,
        details: { nlQuestion, error: "Failed to generate SQL" },
      });
      return {
        success: false,
        error: "Could not translate your question to SQL. Try asking differently.",
      };
    }

    // [Step 2] ANTLR validation (D11: keyword allowlist)
    const antlrValidation = validateSQLWithAllowlist(generatedSQL);
    if (!antlrValidation.valid) {
      const errorMsg = antlrValidation.errors.map((e) => e.message).join("; ");
      return {
        success: false,
        sql: generatedSQL,
        error: `Generated query contains invalid syntax: ${errorMsg}`,
      };
    }

    // [Step 3] Translation validation (D4: reverse-translation semantic match)
    const schema = await getSchemaMetadata(dataSource);
    const reverseTranslation = await reverseTranslateSql(generatedSQL, nlQuestion, schema);

    const confidenceAssessment = assessTranslationConfidence(
      reverseTranslation,
      CONFIDENCE_THRESHOLD
    );

    // Log the generated query and its confidence
    await logAudit({
      userId: session.user.id,
      action: "nl_query_generated",
      resourceType: "query",
      resourceId: dataSourceId,
      details: {
        nlQuestion,
        generatedSQL: generatedSQL.substring(0, 500),
        confidence: reverseTranslation.confidence,
        englishMeaning: reverseTranslation.englishMeaning,
      },
    });

    // [D3] If confidence < 90%, warn but allow override
    if (confidenceAssessment.shouldWarn) {
      return {
        success: false,
        sql: generatedSQL,
        englishMeaning: reverseTranslation.englishMeaning,
        confidence: reverseTranslation.confidence,
        requiresApproval: true,
        warning: confidenceAssessment.message,
      };
    }

    // [Step 4] RBAC pre-flight check (D5)
    const accessValidation = await validateQueryAccess(session.user, generatedSQL, dataSourceId);

    if (!accessValidation.allowed) {
      await logAudit({
        userId: session.user.id,
        action: "query_access_denied",
        resourceType: "query",
        resourceId: dataSourceId,
        details: {
          nlQuestion,
          deniedTables: accessValidation.deniedTables,
          deniedColumns: accessValidation.deniedColumns,
          reason: accessValidation.reason,
        },
      });

      return {
        success: false,
        sql: generatedSQL,
        error: accessValidation.reason || "Access denied",
      };
    }

    // [Step 5] Execute query
    const connection = await getConnection(dataSource);
    const startTime = Date.now();
    const result = await connection.raw(generatedSQL).timeout(timeout);
    const executionTime = Date.now() - startTime;

    const rows = Array.isArray(result) ? result : result?.rows || [];

    // [Step 6] Log to OpenKB on success (D20-D25: auto-learn)
    try {
      const { logQueryToOpenKB } = await import("@/server-fns/openkb");
      await logQueryToOpenKB({
        nlQuestion,
        generatedSQL,
        executionTimeMs: executionTime,
        resultRowCount: rows.length,
      });
    } catch (error) {
      console.warn("[NLQuery] Failed to log to OpenKB:", error);
      // Non-fatal error - continue even if OpenKB logging fails
    }

    await logAudit({
      userId: session.user.id,
      action: "nl_query_executed",
      resourceType: "query",
      resourceId: dataSourceId,
      details: {
        nlQuestion,
        sql: generatedSQL.substring(0, 500),
        rowCount: rows.length,
        executionTime,
        confidence: reverseTranslation.confidence,
      },
    });

    return {
      success: true,
      sql: generatedSQL,
      englishMeaning: reverseTranslation.englishMeaning,
      confidence: reverseTranslation.confidence,
      rows: rows.slice(0, 100), // Return first 100 rows
      rowCount: rows.length,
      executionTime,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await logAudit({
      userId: session.user.id,
      action: "nl_query_error",
      resourceType: "query",
      resourceId: dataSourceId,
      details: { nlQuestion, error: errorMessage },
    });
    return {
      success: false,
      error: errorMessage,
    };
  }
});

/**
 * Translate NL question to SQL (stub - requires OpenAI integration)
 */
async function nlToSQL(nlQuestion: string, dataSource: DataSource): Promise<string | null> {
  // TODO: Implement with OpenAI or other LLM
  // For now, return null to indicate not implemented
  console.log(`[NL→SQL] Would translate: "${nlQuestion}" for datasource ${dataSource.id}`);
  return null;
}

/**
 * Get schema metadata for a datasource
 */
async function getSchemaMetadata(dataSource: DataSource): Promise<SchemaMetadata> {
  // TODO: Fetch actual schema from datasource
  // For now, return stub
  return {
    tables: [],
  };
}

/**
 * Allow manager to override low-confidence translation and execute anyway
 */
export const executeNLQueryWithOverride = createServerFn({
  method: "POST",
}).handler(
  async (input: ExecuteNLQueryInput & { approvedSQL: string }): Promise<ExecuteNLQueryResult> => {
    const session = await requireAuth();
    const { approvedSQL, dataSourceId, timeout = DEFAULT_TIMEOUT } = input;

    const db = getDb();
    const dataSource = await db
      .selectFrom("data_sources")
      .selectAll()
      .where("id", "=", dataSourceId)
      .where("is_active", "=", true)
      .executeTakeFirst();

    if (!dataSource) {
      return { success: false, error: "Data source not found" };
    }

    try {
      // Log the override
      await logAudit({
        userId: session.user.id,
        action: "nl_query_override",
        resourceType: "query",
        resourceId: dataSourceId,
        details: {
          sql: approvedSQL.substring(0, 500),
          reason: "Manager approved low-confidence translation",
        },
      });

      // Execute with override
      const connection = await getConnection(dataSource);
      const startTime = Date.now();
      const result = await connection.raw(approvedSQL).timeout(timeout);
      const executionTime = Date.now() - startTime;

      const rows = Array.isArray(result) ? result : result?.rows || [];

      return {
        success: true,
        sql: approvedSQL,
        rows: rows.slice(0, 100),
        rowCount: rows.length,
        executionTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
);
