/**
 * The declarative view spec the Intelligent UI renders.
 *
 * The model never writes markup or code here. It names a view and the columns of a
 * result the NL pipeline has already executed and access-checked, and this file
 * decides whether that description is legal for that result. Anything it cannot
 * check is refused, in the same spirit as the access validators: an unverifiable
 * request is a "no", not a pass.
 */

import { z } from "zod";

export const VIEW_TYPES = ["table", "bar", "line", "area", "pie", "kpi"] as const;
export const AGGREGATIONS = ["sum", "avg", "count", "min", "max"] as const;
export const FILTER_OPS = ["eq", "neq", "gt", "gte", "lt", "lte", "contains"] as const;

/** Hard ceiling on rows a view may display, whatever the model asks for. */
export const MAX_VIEW_ROWS = 500;

export type ViewType = (typeof VIEW_TYPES)[number];
export type Aggregation = (typeof AGGREGATIONS)[number];

export const filterSchema = z.object({
  field: z.string().min(1),
  op: z.enum(FILTER_OPS),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const sortSchema = z.object({
  field: z.string().min(1),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

export const viewSpecSchema = z.object({
  view: z.enum(VIEW_TYPES),
  title: z.string().max(200).optional(),
  x: z.string().min(1).optional(),
  y: z.array(z.string().min(1)).max(8).optional(),
  groupBy: z.string().min(1).optional(),
  aggregation: z.enum(AGGREGATIONS).optional(),
  filters: z.array(filterSchema).max(10).optional(),
  sort: sortSchema.optional(),
  limit: z.number().int().min(1).max(MAX_VIEW_ROWS).optional(),
});

export type ViewSpec = z.infer<typeof viewSpecSchema>;
export type ViewFilter = z.infer<typeof filterSchema>;

export type ColumnKind = "number" | "string" | "boolean" | "unknown";

/** A numeric value, including the numeric strings Postgres returns for bigint/numeric. */
export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Infer a column's kind from the rows themselves. The pipeline returns column names
 * only, so the kind is whatever every non-null value agrees on.
 */
export function inferColumnKinds(
  columns: string[],
  rows: Record<string, unknown>[]
): Record<string, ColumnKind> {
  const kinds: Record<string, ColumnKind> = {};
  for (const column of columns) {
    let sawValue = false;
    let allNumeric = true;
    let allBoolean = true;
    for (const row of rows) {
      const value = row[column];
      if (value === null || value === undefined) continue;
      sawValue = true;
      if (toNumber(value) === null) allNumeric = false;
      if (typeof value !== "boolean") allBoolean = false;
    }
    if (!sawValue) kinds[column] = "unknown";
    else if (allBoolean) kinds[column] = "boolean";
    else if (allNumeric) kinds[column] = "number";
    else kinds[column] = "string";
  }
  return kinds;
}

export type SpecValidation = { ok: true; spec: ViewSpec } | { ok: false; errors: string[] };

/**
 * Check a raw spec against the columns of a real result. Errors are written to be
 * read back by the model, so they name the offending field and what is available.
 */
export function validateSpec(
  raw: unknown,
  columns: string[],
  kinds: Record<string, ColumnKind>
): SpecValidation {
  const parsed = viewSpecSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join(".") || "spec"}: ${i.message}`),
    };
  }

  const spec = parsed.data;
  const errors: string[] = [];
  const known = new Set(columns);
  const available = `Available columns: ${columns.join(", ") || "(none)"}`;

  const need = (field: string | undefined, where: string) => {
    if (field !== undefined && !known.has(field)) {
      errors.push(`${where} references unknown column "${field}". ${available}`);
    }
  };

  need(spec.x, "x");
  need(spec.groupBy, "groupBy");
  need(spec.sort?.field, "sort");
  for (const f of spec.y ?? []) need(f, "y");
  for (const f of spec.filters ?? []) need(f.field, "filters");

  const chart = spec.view === "bar" || spec.view === "line" || spec.view === "area";
  if ((chart || spec.view === "pie") && !spec.x) errors.push(`${spec.view} view needs an x column`);
  if ((chart || spec.view === "pie" || spec.view === "kpi") && !spec.y?.length) {
    errors.push(`${spec.view} view needs at least one y column`);
  }
  if (spec.view === "pie" && (spec.y?.length ?? 0) > 1) {
    errors.push("pie view takes exactly one y column");
  }
  if (spec.view === "kpi" && (spec.y?.length ?? 0) > 1) {
    errors.push("kpi view takes exactly one y column");
  }

  if (spec.aggregation && spec.aggregation !== "count") {
    for (const f of spec.y ?? []) {
      if (known.has(f) && kinds[f] !== "number") {
        errors.push(`${spec.aggregation} needs a numeric column, but "${f}" is ${kinds[f]}`);
      }
    }
  }

  for (const f of spec.filters ?? []) {
    if (f.op !== "eq" && f.op !== "neq" && f.op !== "contains" && known.has(f.field)) {
      if (kinds[f.field] !== "number" || toNumber(f.value) === null) {
        errors.push(`${f.op} on "${f.field}" needs a numeric column and a numeric value`);
      }
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, spec };
}
