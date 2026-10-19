import { describe, expect, it } from "bun:test";
import ExcelJS from "exceljs";
import { buildIntelligentUiWorkbook, type WorkbookInput } from "../export-xlsx";

const columns = ["region", "category", "total_sales", "order_count"];
// Postgres returns bigint/numeric as strings, so the fixture does too.
const rows = [
  { region: "South", category: "Electronics", total_sales: "4200000", order_count: 320 },
  { region: "North", category: "Electronics", total_sales: "3500000", order_count: 285 },
  { region: "West", category: "Furniture", total_sales: "2800000", order_count: 175 },
  { region: "East", category: "Furniture", total_sales: "1900000", order_count: 140 },
];

const base: WorkbookInput = {
  title: "Sales by region",
  question: "Show total sales by region",
  sql: "SELECT region FROM sales_order",
  dataSourceName: "Sakila",
  generatedBy: "analyst@example.com",
  columns,
  rows,
  views: [],
  generatedAt: new Date("2026-10-19T10:00:00Z"),
};

async function open(input: WorkbookInput): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load((await buildIntelligentUiWorkbook(input)) as unknown as ArrayBuffer);
  return wb;
}

describe("buildIntelligentUiWorkbook", () => {
  it("always has a Summary and a Data sheet holding the full result", async () => {
    const wb = await open(base);
    expect(wb.worksheets.map((s) => s.name)).toEqual(["Summary", "Data"]);

    const data = wb.getWorksheet("Data")!;
    expect(data.rowCount).toBe(rows.length + 1);
    expect(data.getRow(1).values).toEqual([undefined, ...columns]);
  });

  it("records the question, the SQL and who generated it", async () => {
    const summary = (await open(base)).getWorksheet("Summary")!;
    const text: string[] = [];
    summary.eachRow((row) => text.push(String(row.getCell(2).value ?? "")));
    expect(text).toContain("Show total sales by region");
    expect(text).toContain("SELECT region FROM sales_order");
    expect(text).toContain("analyst@example.com");
  });

  it("writes numeric columns as numbers, not the strings Postgres returned", async () => {
    const data = (await open(base)).getWorksheet("Data")!;
    expect(data.getCell("C2").value).toBe(4200000);
    expect(typeof data.getCell("C2").value).toBe("number");
    expect(data.getCell("A2").value).toBe("South");
  });

  it("makes a sheet per view with figures computed from the rows", async () => {
    const wb = await open({
      ...base,
      views: [
        { view: "kpi", title: "Orders", y: ["order_count"], aggregation: "sum" },
        {
          view: "table",
          title: "By category",
          x: "category",
          y: ["total_sales"],
          aggregation: "sum",
          sort: { field: "total_sales", direction: "desc" },
        },
      ],
    });

    expect(wb.worksheets.map((s) => s.name)).toEqual([
      "Summary",
      "1 Orders",
      "2 By category",
      "Data",
    ]);

    expect(wb.getWorksheet("1 Orders")!.getCell("B3").value).toBe(920);

    const table = wb.getWorksheet("2 By category")!;
    expect(table.getRow(3).values).toEqual([undefined, "category", "total_sales"]);
    // sorted by the summed figure, descending
    expect(table.getRow(4).values).toEqual([undefined, "Electronics", 7700000]);
    expect(table.getRow(5).values).toEqual([undefined, "Furniture", 4700000]);
  });

  it("embeds a chart picture for a chart view, or says so in the sheet when it cannot", async () => {
    const wb = await open({
      ...base,
      views: [{ view: "bar", title: "Sales", x: "region", y: ["total_sales"] }],
    });
    const sheet = wb.getWorksheet("1 Sales")!;
    const hasPicture = sheet.getImages().length > 0;
    const hasNote = String(sheet.getCell("A3").value ?? "").includes("could not be rendered");
    expect(hasPicture || hasNote).toBe(true);
    // Either way the figures are in the sheet.
    const values: unknown[] = [];
    sheet.eachRow((row) => values.push(row.getCell(1).value));
    expect(values).toContain("South");
  });

  it("keeps sheet names legal and unique", async () => {
    const wb = await open({
      ...base,
      views: [
        { view: "table", title: "Q1/Q2: [draft]?" },
        { view: "table", title: "Q1/Q2: [draft]?" },
      ],
    });
    const names = wb.worksheets.map((s) => s.name);
    expect(new Set(names.map((n) => n.toLowerCase())).size).toBe(names.length);
    for (const n of names) expect(/[\\/*?:[\]]/.test(n)).toBe(false);
  });

  it("serialises object values instead of failing", async () => {
    const wb = await open({
      ...base,
      columns: ["id", "meta"],
      rows: [{ id: 1, meta: { a: 1 } }],
    });
    expect(wb.getWorksheet("Data")!.getCell("B2").value).toBe('{"a":1}');
  });
});
