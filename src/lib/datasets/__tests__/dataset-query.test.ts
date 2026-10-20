import { describe, expect, it } from "bun:test";
import {
  applyRowCap,
  capRowsSql,
  coerceNumericColumns,
  datasetMaxRows,
  describeColumns,
  toArrowRows,
} from "../dataset-query";
import { rowsToArrowIPC } from "@/lib/export/arrow-exporter";
import { tableFromIPC } from "apache-arrow";

describe("datasetMaxRows", () => {
  it("defaults, honours an override, and ignores nonsense", () => {
    expect(datasetMaxRows({})).toBe(100_000);
    expect(datasetMaxRows({ DATASET_MAX_ROWS: "250" })).toBe(250);
    for (const bad of ["0", "-5", "lots", ""]) {
      expect(datasetMaxRows({ DATASET_MAX_ROWS: bad })).toBe(100_000);
    }
  });
});

describe("capRowsSql", () => {
  it("wraps the statement and asks for one row beyond the cap", () => {
    expect(capRowsSql("SELECT * FROM t;  ", "pg", 10)).toBe(
      "SELECT * FROM (SELECT * FROM t) AS dataset_rows LIMIT 11"
    );
  });

  it("leaves SQL Server statements alone (ORDER BY is not allowed in a subquery there)", () => {
    expect(capRowsSql("SELECT * FROM t ORDER BY a;", "mssql", 10)).toBe(
      "SELECT * FROM t ORDER BY a"
    );
  });
});

describe("applyRowCap", () => {
  it("reports truncation only when there were more rows than the cap", () => {
    expect(applyRowCap([1, 2, 3], 3)).toEqual({ rows: [1, 2, 3], truncated: false });
    expect(applyRowCap([1, 2, 3, 4], 3)).toEqual({ rows: [1, 2, 3], truncated: true });
  });
});

describe("toArrowRows / describeColumns", () => {
  const rows = toArrowRows([
    { id: 1n, name: "a", meta: { k: 1 }, at: new Date("2026-01-01T00:00:00Z"), blank: null },
    { id: 2n, name: null, meta: [1], at: new Date("2026-01-02T00:00:00Z"), blank: null },
  ]);

  it("makes values Arrow-safe", () => {
    expect(rows[0]).toMatchObject({ id: 1, meta: '{"k":1}' });
    expect(toArrowRows([{ big: 2n ** 70n }])[0].big).toBe((2n ** 70n).toString());
  });

  it("describes columns and nullability", () => {
    const columns = describeColumns(rows);
    expect(columns.find((c) => c.name === "id")).toEqual({
      name: "id",
      type: "bigint",
      nullable: false,
    });
    expect(columns.find((c) => c.name === "name")?.nullable).toBe(true);
    expect(columns.find((c) => c.name === "at")?.type).toBe("timestamp");
  });

  it("survives a round trip through Arrow, including an all-null column", () => {
    const table = tableFromIPC(rowsToArrowIPC(rows));
    expect(table.numRows).toBe(2);
    expect(table.getChild("name")?.get(1)).toBeNull();
    expect(table.getChild("blank")?.get(0)).toBeNull();
  });
});

describe("coerceNumericColumns", () => {
  it("turns the strings PostgreSQL returns for numeric and bigint into numbers", () => {
    const out = coerceNumericColumns([
      { total: "175200.00", n: "120", label: "East" },
      { total: "-3.5", n: null, label: "West" },
    ]);
    expect(out).toEqual([
      { total: 175200, n: 120, label: "East" },
      { total: -3.5, n: null, label: "West" },
    ]);
  });

  it("leaves a column alone if any value is not a plain, exactly representable number", () => {
    const rows = [{ zip: "01234" }, { zip: "98765" }];
    expect(coerceNumericColumns(rows)).toEqual(rows);
    const mixed = [{ v: "12" }, { v: "twelve" }];
    expect(coerceNumericColumns(mixed)).toEqual(mixed);
    const huge = [{ id: "12345678901234567890" }];
    expect(coerceNumericColumns(huge)).toEqual(huge);
  });

  it("leaves an all-null column alone", () => {
    const rows = [{ a: null }, { a: null }];
    expect(coerceNumericColumns(rows)).toEqual(rows);
  });
});
