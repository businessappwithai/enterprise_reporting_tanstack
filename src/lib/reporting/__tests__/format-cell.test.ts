import { describe, expect, test } from "bun:test";
import { formatCellValue } from "../format-cell";

describe("formatCellValue — no formatter configured", () => {
  test("a NUMERIC string, as node-postgres returns money, is grouped to two decimals", () => {
    expect(formatCellValue("25955.7000")).toBe("25,955.70");
    expect(formatCellValue("6882.7900")).toBe("6,882.79");
    expect(formatCellValue("-42.5000")).toBe("-42.50");
  });

  test("a whole NUMERIC drops the zero decimals", () => {
    expect(formatCellValue("1200.0000")).toBe("1,200");
  });

  test("decimals past the second survive up to the scale money is stored at", () => {
    expect(formatCellValue("0.0125")).toBe("0.0125");
  });

  test("a value past 2^53 keeps every digit", () => {
    expect(formatCellValue("123456789012345.6789")).toBe("123,456,789,012,345.6789");
  });

  test("a string of digits with no point is left alone — it may be a code", () => {
    expect(formatCellValue("02134")).toBe("02134");
    expect(formatCellValue("5551234567")).toBe("5551234567");
  });

  test("JavaScript numbers are grouped as before", () => {
    expect(formatCellValue(1234567)).toBe("1,234,567");
    expect(formatCellValue(3.5)).toBe("3.50");
  });

  test("missing values return null so each screen draws its own marker", () => {
    expect(formatCellValue(null)).toBeNull();
    expect(formatCellValue(undefined)).toBeNull();
  });

  test("text is unchanged", () => {
    expect(formatCellValue("needs_analysis")).toBe("needs_analysis");
  });
});

describe("formatCellValue — a configured formatter wins", () => {
  test("currency", () => {
    expect(
      formatCellValue("25955.7000", {
        type: "currency",
        options: { currency: "USD", locale: "en-US" },
      })
    ).toBe("$25,955.70");
  });

  test("number with fixed decimals", () => {
    expect(
      formatCellValue("25955.7000", { type: "number", options: { decimals: 0, locale: "en-US" } })
    ).toBe("25,956");
  });

  test("percentage", () => {
    expect(
      formatCellValue("0.125", { type: "percentage", options: { decimals: 1, locale: "en-US" } })
    ).toBe("12.5%");
  });

  test("text keeps a decimal exactly as stored", () => {
    expect(formatCellValue("25955.7000", { type: "text" })).toBe("25955.7000");
  });

  test("a non-numeric value under a numeric formatter is shown as it is", () => {
    expect(formatCellValue("n/a", { type: "currency" })).toBe("n/a");
  });
});
