/**
 * Server-side Arrow IPC export.
 * Converts query results into Arrow IPC format for streaming to clients.
 */

import * as Arrow from "apache-arrow";

export interface ArrowRow {
  [key: string]: unknown;
}

function buildTable(rows: ArrowRow[], columnMeta?: { name: string; type: string }[]): Arrow.Table {
  if (rows.length === 0) return Arrow.tableFromArrays({});

  const keys = columnMeta ? columnMeta.map((c) => c.name) : Object.keys(rows[0]);
  const columns: Record<string, Arrow.Vector> = {};

  for (const key of keys) {
    const values = rows.map((r) => r[key] ?? null);
    // Name the type rather than let Arrow infer it. Inference calls an all-null column
    // `Null` (DuckDB refuses to insert that), makes strings dictionary-encoded, and makes
    // Dates a Date64 that drops the time of day.
    const sample = values.find((v) => v !== null);
    if (sample === undefined || typeof sample === "string") {
      columns[key] = Arrow.vectorFromArray(values, new Arrow.Utf8());
    } else if (sample instanceof Date) {
      columns[key] = Arrow.vectorFromArray(values, new Arrow.TimestampMillisecond());
    } else {
      columns[key] = Arrow.vectorFromArray(values);
    }
  }

  return new Arrow.Table(columns);
}

/**
 * Convert an array of row objects to an Arrow IPC buffer (stream format).
 */
export function rowsToArrowIPC(
  rows: ArrowRow[],
  columnMeta?: { name: string; type: string }[]
): Uint8Array {
  return Arrow.tableToIPC(buildTable(rows, columnMeta), "stream");
}

/**
 * Convert rows to Arrow IPC file format.
 */
export function rowsToArrowFile(
  rows: ArrowRow[],
  columnMeta?: { name: string; type: string }[]
): Uint8Array {
  return Arrow.tableToIPC(buildTable(rows, columnMeta), "file");
}
