/**
 * Five-field cron matching, shared by the monitoring runner and the job-definition runner.
 *
 * Kept free of imports (the monitoring scheduler pulls in the Trigger.dev SDK) so it can be
 * unit-tested and used anywhere. Times are matched in UTC unless a timezone is given.
 */

/**
 * Minimal 5-field cron matcher.
 *
 * Supports: exact values (5), wildcard (*), comma lists (1,3,5),
 *           step expressions (* /15), and ranges (1-5).
 * This is intentionally simple — production deployments with complex cron
 * expressions should use Trigger.dev self-hosted instead.
 */
export function matchesCronField(value: number, field: string): boolean {
  if (field === "*") return true;
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      const [range, step] = part.split("/");
      const stepN = parseInt(step, 10);
      let start = 0;
      let end = 59;
      if (range !== "*") {
        const [s, e] = range.split("-").map(Number);
        start = s;
        end = e ?? s;
      }
      if (value >= start && value <= end && (value - start) % stepN === 0) return true;
    } else if (part.includes("-")) {
      const [lo, hi] = part.split("-").map(Number);
      if (value >= lo && value <= hi) return true;
    } else if (parseInt(part, 10) === value) {
      return true;
    }
  }
  return false;
}

export function cronMatches(cron: string, date: Date): boolean {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  const [minute, hour, dom, month, dow] = parts;
  return (
    matchesCronField(date.getUTCMinutes(), minute) &&
    matchesCronField(date.getUTCHours(), hour) &&
    matchesCronField(date.getUTCDate(), dom) &&
    matchesCronField(date.getUTCMonth() + 1, month) &&
    matchesCronField(date.getUTCDay(), dow)
  );
}

/**
 * Timezone-aware cron matching.
 *
 * Converts the current UTC time to the rule's configured timezone using
 * Intl.DateTimeFormat, then evaluates the cron expression against the
 * local time components. Falls back to UTC if the timezone is invalid.
 */
export function cronMatchesWithTimezone(cron: string, dateUtc: Date, timezone: string): boolean {
  if (!timezone || timezone === "UTC") return cronMatches(cron, dateUtc);

  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    const parts = fmt.formatToParts(dateUtc);
    const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);

    const localMinute = get("minute");
    const localHour = get("hour") === 24 ? 0 : get("hour");
    const localDay = get("day");
    const localMonth = get("month");
    // Day of week: reconstruct from the local date
    const localDate = new Date(get("year"), localMonth - 1, localDay);
    const localDow = localDate.getDay();

    const cronParts = cron.trim().split(/\s+/);
    if (cronParts.length !== 5) return false;

    return (
      matchesCronField(localMinute, cronParts[0]) &&
      matchesCronField(localHour, cronParts[1]) &&
      matchesCronField(localDay, cronParts[2]) &&
      matchesCronField(localMonth, cronParts[3]) &&
      matchesCronField(localDow, cronParts[4])
    );
  } catch {
    // Invalid timezone — fall back to UTC
    return cronMatches(cron, dateUtc);
  }
}

const FIELD_BOUNDS: Array<[min: number, max: number]> = [
  [0, 59], // minute
  [0, 23], // hour
  [1, 31], // day of month
  [1, 12], // month
  [0, 6], // day of week — 7 is not matched by cronMatches, so it is not valid here
];

/**
 * True when `expression` is five fields, each of which `matchesCronField` can honour:
 * `*`, numbers, `a-b` ranges, `a,b` lists and `*` or `a-b` followed by `/step`, all within the
 * field's bounds. `matchesCronField` treats anything else as "never matches", so a job saved with
 * `every monday` would be accepted and silently never run; this is how it is refused instead.
 */
export function isValidCron(expression: string): boolean {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) return false;
  return fields.every((field, index) => {
    const [min, max] = FIELD_BOUNDS[index];
    const inBounds = (text: string) => /^\d+$/.test(text) && +text >= min && +text <= max;
    return field.split(",").every((part) => {
      const [range, step, extra] = part.split("/");
      if (extra !== undefined) return false;
      if (step !== undefined && !(/^\d+$/.test(step) && +step > 0)) return false;
      if (range === "*") return true;
      const [lo, hi, more] = range.split("-");
      if (more !== undefined) return false;
      return inBounds(lo) && (hi === undefined || (inBounds(hi) && +lo <= +hi));
    });
  });
}
