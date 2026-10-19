import { describe, expect, it } from "bun:test";
import { applySpec } from "../apply-spec";
import { inferColumnKinds, MAX_VIEW_ROWS, validateSpec } from "../spec";

const columns = ["region", "category", "total_sales", "order_count"];
// Postgres returns bigint/numeric as strings, so the fixture does too.
const rows = [
  { region: "South", category: "Electronics", total_sales: "4200000", order_count: 320 },
  { region: "North", category: "Electronics", total_sales: "3500000", order_count: 285 },
  { region: "West", category: "Furniture", total_sales: "2800000", order_count: 175 },
  { region: "East", category: "Furniture", total_sales: "1900000", order_count: 140 },
];
const kinds = inferColumnKinds(columns, rows);

describe("inferColumnKinds", () => {
  it("treats numeric strings as numbers and text as strings", () => {
    expect(kinds.total_sales).toBe("number");
    expect(kinds.order_count).toBe("number");
    expect(kinds.region).toBe("string");
  });

  it("reports unknown for an all-null column", () => {
    expect(inferColumnKinds(["a"], [{ a: null }]).a).toBe("unknown");
  });
});

describe("validateSpec", () => {
  it("accepts a legal bar chart", () => {
    const result = validateSpec(
      { view: "bar", x: "region", y: ["total_sales"], aggregation: "sum" },
      columns,
      kinds
    );
    expect(result.ok).toBe(true);
  });

  it("refuses a column the result does not have, and lists what it does", () => {
    const result = validateSpec(
      { view: "bar", x: "customer_name", y: ["total_sales"] },
      columns,
      kinds
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0]).toContain("customer_name");
      expect(result.errors[0]).toContain("region");
    }
  });

  it("refuses sum over a text column", () => {
    const result = validateSpec(
      { view: "bar", x: "region", y: ["category"], aggregation: "sum" },
      columns,
      kinds
    );
    expect(result.ok).toBe(false);
  });

  it("refuses a chart with no x or y", () => {
    const result = validateSpec({ view: "line" }, columns, kinds);
    expect(result.ok).toBe(false);
  });

  it("refuses a limit above the display ceiling", () => {
    const result = validateSpec({ view: "table", limit: MAX_VIEW_ROWS + 1 }, columns, kinds);
    expect(result.ok).toBe(false);
  });

  it("refuses an unknown view type", () => {
    expect(validateSpec({ view: "iframe" }, columns, kinds).ok).toBe(false);
  });

  it("refuses an ordering filter on a text column", () => {
    const result = validateSpec(
      { view: "table", filters: [{ field: "region", op: "gt", value: 3 }] },
      columns,
      kinds
    );
    expect(result.ok).toBe(false);
  });
});

describe("applySpec", () => {
  it("sums by category, computing from the rows", () => {
    const out = applySpec(columns, rows, {
      view: "bar",
      x: "category",
      y: ["total_sales"],
      aggregation: "sum",
    });
    expect(out.columns).toEqual(["category", "total_sales"]);
    const byCategory = Object.fromEntries(out.rows.map((r) => [r.category, r.total_sales]));
    expect(byCategory.Electronics).toBe(7700000);
    expect(byCategory.Furniture).toBe(4700000);
  });

  it("produces a single kpi figure over every row", () => {
    const out = applySpec(columns, rows, { view: "kpi", y: ["order_count"], aggregation: "sum" });
    expect(out.rows).toEqual([{ order_count: 920 }]);
  });

  it("averages, counts, min and max", () => {
    const base = { view: "kpi" as const, y: ["order_count"] };
    expect(applySpec(columns, rows, { ...base, aggregation: "avg" }).rows[0].order_count).toBe(230);
    expect(applySpec(columns, rows, { ...base, aggregation: "count" }).rows[0].order_count).toBe(4);
    expect(applySpec(columns, rows, { ...base, aggregation: "min" }).rows[0].order_count).toBe(140);
    expect(applySpec(columns, rows, { ...base, aggregation: "max" }).rows[0].order_count).toBe(320);
  });

  it("filters before aggregating", () => {
    const out = applySpec(columns, rows, {
      view: "kpi",
      y: ["total_sales"],
      aggregation: "sum",
      filters: [{ field: "category", op: "eq", value: "Furniture" }],
    });
    expect(out.rows[0].total_sales).toBe(4700000);
  });

  it("sorts numerically, not lexically, and applies the limit", () => {
    const out = applySpec(columns, rows, {
      view: "table",
      sort: { field: "total_sales", direction: "desc" },
      limit: 2,
    });
    expect(out.rows.map((r) => r.region)).toEqual(["South", "North"]);
    expect(out.truncated).toBe(true);
  });

  it("never returns more than the display ceiling", () => {
    const many = Array.from({ length: MAX_VIEW_ROWS + 50 }, (_, i) => ({ n: i }));
    const out = applySpec(["n"], many, { view: "table" });
    expect(out.rows.length).toBe(MAX_VIEW_ROWS);
    expect(out.truncated).toBe(true);
  });

  it("ignores non-numeric values rather than inventing zeros", () => {
    const out = applySpec(
      ["v"],
      [{ v: "10" }, { v: null }, { v: "x" }],
      { view: "kpi", y: ["v"], aggregation: "sum" }
    );
    expect(out.rows[0].v).toBe(10);
  });
});
