/**
 * The pure parts of building a dataset from a saved query: the row cap, making a row
 * Arrow-safe, and describing the columns.
 *
 * A dataset is a saved query the browser loads into DuckDB-WASM, so it is a bounded
 * export, not a page of a list: `DATASET_MAX_ROWS` (100 000 by default) is the ceiling,
 * and a result that hits it is reported as truncated rather than silently cut.
 */

const DEFAULT_MAX_ROWS = 100_000;

export function datasetMaxRows(env: Record<string, string | undefined> = process.env): number {
  const configured = Number.parseInt(env.DATASET_MAX_ROWS ?? "", 10);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_MAX_ROWS;
}

/**
 * The statement to run so the database stops at `maxRows + 1` rows (one extra, to tell
 * "exactly the cap" from "more than the cap"). The user's statement becomes a subquery.
 *
 * SQL Server is run as written and sliced afterwards: a subquery may not carry an
 * ORDER BY there, and most saved queries do.
 */
export function capRowsSql(sql: string, clientType: string, maxRows: number): string {
  const statement = sql.trim().replace(/;+\s*$/, "");
  if (clientType === "mssql") return statement;
  return `SELECT * FROM (${statement}) AS dataset_rows LIMIT ${maxRows + 1}`;
}

export interface CappedRows<T> {
  rows: T[];
  truncated: boolean;
}

export function applyRowCap<T>(rows: T[], maxRows: number): CappedRows<T> {
  return rows.length > maxRows
    ? { rows: rows.slice(0, maxRows), truncated: true }
    : { rows, truncated: false };
}

/**
 * Make a database value something Arrow can hold in a column: objects and arrays become
 * JSON text, binary becomes hex, a safe bigint becomes a number. Everything else
 * (numbers, strings, booleans, Dates, null) is already fine.
 */
export function toArrowValue(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (typeof value === "bigint") {
    return value >= BigInt(Number.MIN_SAFE_INTEGER) && value <= BigInt(Number.MAX_SAFE_INTEGER)
      ? Number(value)
      : value.toString();
  }
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (value instanceof Uint8Array) return Buffer.from(value).toString("hex");
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

export function toArrowRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) out[key] = toArrowValue(value);
    return out;
  });
}

// No leading zero (so "01234" and "007" stay text), at most 15 significant digits (so
// nothing loses precision as a double).
const PLAIN_NUMBER = /^-?(0|[1-9]\d*)(\.\d+)?$/;

function isSafeNumberText(value: unknown): value is string {
  if (typeof value !== "string" || !PLAIN_NUMBER.test(value)) return false;
  return value.replace(/[-.]/g, "").replace(/^0+(?=\d)/, "").length <= 15;
}

/**
 * PostgreSQL's driver returns `numeric` and `count(*)` (bigint) as strings, to avoid
 * losing precision, and a dataset full of text totals cannot be summed in DuckDB. The
 * rows carry no column types, so a column becomes numeric when it is text in every row
 * and every value is a plain number that a double holds exactly. A text column of
 * digits-only values is converted too — that is the cost of having no type information —
 * but one with leading zeros (postcodes, codes) never is.
 */
export function coerceNumericColumns(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  if (rows.length === 0) return rows;
  const numeric = Object.keys(rows[0]).filter((name) => {
    let sawValue = false;
    for (const row of rows) {
      const value = row[name];
      if (value === null || value === undefined) continue;
      if (!isSafeNumberText(value)) return false;
      sawValue = true;
    }
    return sawValue;
  });
  if (numeric.length === 0) return rows;
  return rows.map((row) => {
    const out = { ...row };
    for (const name of numeric) if (typeof out[name] === "string") out[name] = Number(out[name]);
    return out;
  });
}

export interface DatasetColumn {
  name: string;
  type: string;
  nullable: boolean;
}

/** Column name, a coarse type and nullability, read from the (already Arrow-safe) rows. */
export function describeColumns(rows: Record<string, unknown>[]): DatasetColumn[] {
  if (rows.length === 0) return [];
  return Object.keys(rows[0]).map((name) => {
    const sample = rows.find((r) => r[name] !== null && r[name] !== undefined)?.[name];
    let type = "varchar";
    if (typeof sample === "number") type = Number.isInteger(sample) ? "bigint" : "double";
    else if (typeof sample === "boolean") type = "boolean";
    else if (sample instanceof Date) type = "timestamp";
    return { name, type, nullable: rows.some((r) => r[name] === null || r[name] === undefined) };
  });
}
