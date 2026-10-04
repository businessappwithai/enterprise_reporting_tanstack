/**
 * One report cell as text.
 *
 * Every report screen used to print a value with `String(value)` unless it was
 * a JavaScript number, and the column's configured `formatter` was read by the
 * report editor and by nothing else. That was invisible for integers and loud
 * for money: node-postgres returns NUMERIC as a string so no digit is lost, as
 * mysql2 does DECIMAL, and a generated application stores money as
 * DECIMAL(18,4) — so an amount read `25955.7000`.
 *
 * Two rules, in order:
 *
 * 1. A configured formatter wins. An administrator who picked "currency" for a
 *    column gets currency, whatever the driver handed over.
 * 2. Otherwise a number, or a string that is plainly a decimal (digits with a
 *    point), is grouped with two decimals when it has a fraction. A string of
 *    digits with no point is left alone: it is as likely to be a postcode, a
 *    phone number or an account code as a count, and regrouping `02134` or
 *    `5551234567` would corrupt it.
 *
 * Decimal strings are formatted through `Intl` as strings rather than parsed to
 * a `Number`, which `Intl` treats as an exact decimal, so a value past 2^53
 * keeps its digits.
 */
import type { FormatterDefinition } from "@/types/database";

const DECIMAL = /^-?\d+\.\d+$/;
const NUMERIC = /^-?\d+(\.\d+)?$/;

type NumericInput = number | string;

/** Up to four decimals: the scale money is stored at. */
function grouped(value: NumericInput, locale?: string, decimals?: number): string {
  const text = String(value);
  const hasFraction =
    /\.\d*[1-9]/.test(text) || (typeof value === "number" && !Number.isInteger(value));
  const minimumFractionDigits = decimals ?? (hasFraction ? 2 : 0);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits: Math.max(decimals ?? 4, minimumFractionDigits),
  }).format(value as Parameters<Intl.NumberFormat["format"]>[0]);
}

/** A number or a numeric string, or null when the value is neither. */
function asNumeric(value: unknown): NumericInput | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "string" && NUMERIC.test(value.trim())) return value.trim();
  return null;
}

function withAffixes(text: string, formatter: FormatterDefinition): string {
  return `${formatter.options?.prefix ?? ""}${text}${formatter.options?.suffix ?? ""}`;
}

function applyFormatter(value: unknown, formatter: FormatterDefinition): string {
  const options = formatter.options ?? {};
  const numeric = asNumeric(value);

  switch (formatter.type) {
    case "number":
      return numeric === null
        ? String(value)
        : withAffixes(grouped(numeric, options.locale, options.decimals), formatter);
    case "currency":
      if (numeric === null) return String(value);
      return withAffixes(
        new Intl.NumberFormat(options.locale, {
          style: "currency",
          currency: options.currency || "USD",
          minimumFractionDigits: options.decimals ?? 2,
          maximumFractionDigits: options.decimals ?? 2,
        }).format(numeric as Parameters<Intl.NumberFormat["format"]>[0]),
        formatter
      );
    case "percentage":
      if (numeric === null) return String(value);
      return withAffixes(
        new Intl.NumberFormat(options.locale, {
          style: "percent",
          minimumFractionDigits: options.decimals ?? 0,
          maximumFractionDigits: options.decimals ?? 2,
        }).format(Number(numeric)),
        formatter
      );
    case "boolean": {
      const truthy =
        value === true || value === "true" || value === "t" || value === 1 || value === "1";
      return truthy ? (options.trueLabel ?? "Yes") : (options.falseLabel ?? "No");
    }
    case "date":
    case "datetime": {
      const date = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(date.getTime())) return String(value);
      return formatter.type === "date"
        ? date.toLocaleDateString(options.locale)
        : date.toLocaleString(options.locale);
    }
    case "text":
      return withAffixes(String(value), formatter);
    default:
      // "custom" names a formatter by string; running it would be evaluating
      // stored text as code, so it falls back to the default rendering.
      return defaultText(value);
  }
}

function defaultText(value: unknown): string {
  if (typeof value === "number") return grouped(value);
  if (typeof value === "string" && DECIMAL.test(value.trim())) return grouped(value.trim());
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * The text for one cell, or null for a missing value so each screen can draw
 * its own empty marker.
 */
export function formatCellValue(
  value: unknown,
  formatter?: FormatterDefinition | null
): string | null {
  if (value === null || value === undefined) return null;
  if (formatter?.type) return applyFormatter(value, formatter);
  return defaultText(value);
}
