/**
 * Turn a validated spec and an executed result into the rows a view displays.
 *
 * Every number the Intelligent UI shows comes out of this function. The model
 * chooses which columns and which aggregation; it never supplies a value, so a
 * figure on screen is always arithmetic over rows the NL pipeline returned.
 */

import { MAX_VIEW_ROWS, toNumber, type ViewFilter, type ViewSpec } from "./spec";

export interface AppliedView {
  columns: string[];
  rows: Record<string, unknown>[];
  /** True when `limit` or the display ceiling cut rows off. */
  truncated: boolean;
}

function matches(value: unknown, filter: ViewFilter): boolean {
  const { op } = filter;
  if (op === "contains") {
    return String(value ?? "")
      .toLowerCase()
      .includes(String(filter.value).toLowerCase());
  }

  const left = toNumber(value);
  const right = toNumber(filter.value);
  if (left !== null && right !== null) {
    switch (op) {
      case "eq":
        return left === right;
      case "neq":
        return left !== right;
      case "gt":
        return left > right;
      case "gte":
        return left >= right;
      case "lt":
        return left < right;
      case "lte":
        return left <= right;
    }
  }

  // Non-numeric comparison: only equality is meaningful (validateSpec refuses the rest).
  if (op === "eq") return String(value ?? "") === String(filter.value);
  if (op === "neq") return String(value ?? "") !== String(filter.value);
  return false;
}

function aggregate(values: unknown[], how: NonNullable<ViewSpec["aggregation"]>): number | null {
  if (how === "count") return values.filter((v) => v !== null && v !== undefined).length;
  const nums = values.map(toNumber).filter((n): n is number => n !== null);
  if (nums.length === 0) return null;
  switch (how) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "avg":
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "min":
      return Math.min(...nums);
    case "max":
      return Math.max(...nums);
  }
}

function compare(a: unknown, b: unknown): number {
  const na = toNumber(a);
  const nb = toNumber(b);
  if (na !== null && nb !== null) return na - nb;
  return String(a ?? "").localeCompare(String(b ?? ""));
}

export function applySpec(
  columns: string[],
  rows: Record<string, unknown>[],
  spec: ViewSpec
): AppliedView {
  let working = rows;

  for (const filter of spec.filters ?? []) {
    working = working.filter((row) => matches(row[filter.field], filter));
  }

  let outColumns = columns;

  if (spec.aggregation) {
    const yFields = spec.y ?? [];
    // A kpi is a single figure over every row; everything else groups by its category.
    const groupField = spec.view === "kpi" ? undefined : (spec.groupBy ?? spec.x);

    const groups = new Map<string, { key: unknown; rows: Record<string, unknown>[] }>();
    for (const row of working) {
      const key = groupField ? row[groupField] : "__all__";
      const id = String(key ?? "");
      const group = groups.get(id);
      if (group) group.rows.push(row);
      else groups.set(id, { key, rows: [row] });
    }

    const aggregated: Record<string, unknown>[] = [];
    for (const { key, rows: members } of groups.values()) {
      const out: Record<string, unknown> = {};
      if (groupField) out[groupField] = key;
      for (const field of yFields) {
        out[field] = aggregate(
          members.map((r) => r[field]),
          spec.aggregation
        );
      }
      aggregated.push(out);
    }

    working = aggregated;
    outColumns = [...(groupField ? [groupField] : []), ...yFields];
  }

  if (spec.sort) {
    const { field, direction } = spec.sort;
    const sign = direction === "asc" ? 1 : -1;
    working = [...working].sort((a, b) => sign * compare(a[field], b[field]));
  }

  const cap = Math.min(spec.limit ?? MAX_VIEW_ROWS, MAX_VIEW_ROWS);
  const truncated = working.length > cap;
  return { columns: outColumns, rows: truncated ? working.slice(0, cap) : working, truncated };
}
