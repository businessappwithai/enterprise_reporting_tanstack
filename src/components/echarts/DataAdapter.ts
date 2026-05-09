/**
 * Data adapter: converts query result rows to ECharts data structures.
 */

import type { DataMapping } from "@/types/wasm";

/**
 * Extract category (x-axis) values from rows using the data mapping.
 */
export function extractCategories(rows: Record<string, unknown>[], mapping: DataMapping): string[] {
  if (!mapping.x) return [];
  return rows.map((r) => String(r[mapping.x!] ?? ""));
}

/**
 * Extract series values from rows.
 * Supports single y or multi-y columns.
 */
export function extractSeries(
  rows: Record<string, unknown>[],
  mapping: DataMapping
): { name: string; data: number[] }[] {
  const yColumns = Array.isArray(mapping.y) ? mapping.y : mapping.y ? [mapping.y] : [];

  return yColumns.map((col) => ({
    name: col,
    data: rows.map((r) => Number(r[col] ?? 0)),
  }));
}

/**
 * Extract grouped series (for stacked/grouped charts).
 */
export function extractGroupedSeries(
  rows: Record<string, unknown>[],
  mapping: DataMapping
): { name: string; data: number[] }[] {
  if (!mapping.group || !mapping.y) return extractSeries(rows, mapping);

  const yColumn = Array.isArray(mapping.y) ? mapping.y[0] : mapping.y;
  const groups = new Map<string, Map<string, number>>();
  const categories = new Set<string>();

  for (const row of rows) {
    const groupVal = String(row[mapping.group] ?? "");
    const catVal = String(row[mapping.x!] ?? "");
    const value = Number(row[yColumn] ?? 0);

    categories.add(catVal);
    if (!groups.has(groupVal)) groups.set(groupVal, new Map());
    const existing = groups.get(groupVal)!.get(catVal) ?? 0;
    groups.get(groupVal)!.set(catVal, existing + value);
  }

  const catArray = Array.from(categories);
  return Array.from(groups.entries()).map(([name, valMap]) => ({
    name,
    data: catArray.map((cat) => valMap.get(cat) ?? 0),
  }));
}

/**
 * Extract scatter data (x, y pairs).
 */
export function extractScatterData(
  rows: Record<string, unknown>[],
  mapping: DataMapping
): [number, number][] {
  const yColumn = Array.isArray(mapping.y) ? mapping.y[0] : (mapping.y ?? "");
  return rows.map((r) => [Number(r[mapping.x!] ?? 0), Number(r[yColumn] ?? 0)]);
}

/**
 * Extract pie data (name, value pairs).
 */
export function extractPieData(
  rows: Record<string, unknown>[],
  mapping: DataMapping
): { name: string; value: number }[] {
  const yColumn = Array.isArray(mapping.y) ? mapping.y[0] : (mapping.y ?? "");
  return rows.map((r) => ({
    name: String(r[mapping.x!] ?? ""),
    value: Number(r[yColumn] ?? 0),
  }));
}
