/**
 * Email templates as stored, and as the screens and the batch worker use them.
 *
 * Stored in `email_templates` (snake_case, `column_mappings` as JSON text); handed to the
 * UI as `EmailTemplate` (camelCase, parsed), which is the shape the page and the editor were
 * written against. `body` is NOT NULL in the table and the batch worker falls back to it, so
 * it carries the same HTML as `html_body`.
 */

import { z } from "zod";
import type { EmailTemplate } from "@/lib/email/email-service";

export interface EmailTemplateRow {
  id: string;
  name: string;
  subject: string;
  body: string;
  html_body: string | null;
  column_mappings: string | null;
  query_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

function parseMappings(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function toEmailTemplate(row: EmailTemplateRow): EmailTemplate {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    htmlBody: row.html_body ?? row.body,
    queryId: row.query_id ?? undefined,
    columnMappings: parseMappings(row.column_mappings),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** What the editor sends, for create and for update alike. */
export const emailTemplateInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Name is too long"),
  subject: z.string().trim().min(1, "Subject is required").max(500, "Subject is too long"),
  htmlBody: z
    .string()
    .min(1, "HTML body is required")
    .max(200_000, "HTML body is too long (200,000 characters at most)"),
  queryId: z.string().trim().min(1).max(255).nullable().optional(),
  columnMappings: z
    .record(
      z.string().regex(/^\w+$/, "Placeholder names are letters, digits and underscores"),
      z.string().max(255)
    )
    .default({}),
});

export type EmailTemplateInput = z.infer<typeof emailTemplateInputSchema>;

/** `{{name}}` placeholders in a template, in first-seen order. Block helpers are not placeholders. */
export function placeholdersIn(text: string): string[] {
  const names = [...text.matchAll(/{{(\w+)}}/g)].map((m) => m[1]);
  return [...new Set(names)];
}

/**
 * The variables one recipient row produces — the same rule the batch worker applies
 * (src/lib/jobs/workers/email-batch-worker.ts): each mapped placeholder takes its column's
 * value, plus the worker's own `_` variables. A preview built any other way would show an
 * email the worker would not send.
 */
export function variablesForRow(
  mappings: Record<string, string>,
  row: Record<string, unknown>,
  context: { index: number; total: number; reportName?: string }
): Record<string, unknown> {
  const variables: Record<string, unknown> = {};
  for (const [placeholder, column] of Object.entries(mappings)) {
    if (column) variables[placeholder] = row[column];
  }
  variables._recipientNumber = context.index + 1;
  variables._totalRecipients = context.total;
  variables._reportName = context.reportName ?? "(report name)";
  variables._generatedAt = new Date().toISOString();
  return variables;
}
