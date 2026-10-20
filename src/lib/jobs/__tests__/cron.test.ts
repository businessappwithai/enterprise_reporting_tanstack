import { describe, expect, it } from "bun:test";
import { cronMatches, cronMatchesWithTimezone, isValidCron } from "../cron";

const at = (iso: string) => new Date(iso);

describe("cronMatches", () => {
  it("matches exact values and wildcards", () => {
    expect(cronMatches("30 8 * * *", at("2026-10-19T08:30:00Z"))).toBe(true);
    expect(cronMatches("30 8 * * *", at("2026-10-19T08:31:00Z"))).toBe(false);
    expect(cronMatches("* * * * *", at("2026-10-19T03:07:00Z"))).toBe(true);
  });

  it("matches lists, ranges and steps", () => {
    expect(cronMatches("0,30 * * * *", at("2026-10-19T05:30:00Z"))).toBe(true);
    expect(cronMatches("*/15 * * * *", at("2026-10-19T05:45:00Z"))).toBe(true);
    expect(cronMatches("*/15 * * * *", at("2026-10-19T05:50:00Z"))).toBe(false);
    expect(cronMatches("0 9-17 * * *", at("2026-10-19T12:00:00Z"))).toBe(true);
    expect(cronMatches("0 9-17 * * *", at("2026-10-19T18:00:00Z"))).toBe(false);
  });

  it("matches the day of week (2026-10-19 is a Monday)", () => {
    expect(cronMatches("0 8 * * 1", at("2026-10-19T08:00:00Z"))).toBe(true);
    expect(cronMatches("0 8 * * 2", at("2026-10-19T08:00:00Z"))).toBe(false);
  });

  it("never matches something that is not five fields", () => {
    expect(cronMatches("* * * *", at("2026-10-19T08:00:00Z"))).toBe(false);
    expect(cronMatches("every monday", at("2026-10-19T08:00:00Z"))).toBe(false);
  });
});

describe("cronMatchesWithTimezone", () => {
  it("evaluates in the given timezone", () => {
    // 08:00 UTC is 04:00 in New York in October (EDT, UTC-4).
    const when = at("2026-10-19T08:00:00Z");
    expect(cronMatchesWithTimezone("0 4 * * *", when, "America/New_York")).toBe(true);
    expect(cronMatchesWithTimezone("0 8 * * *", when, "America/New_York")).toBe(false);
    expect(cronMatchesWithTimezone("0 8 * * *", when, "UTC")).toBe(true);
  });
});

describe("isValidCron", () => {
  it("accepts what the matcher can honour", () => {
    for (const ok of ["* * * * *", "0 8 * * 1", "*/15 9-17 * * 1-5", "0,30 * 1,15 * *", "5-10/2 * * * *"]) {
      expect(isValidCron(ok)).toBe(true);
    }
  });

  it("refuses what would be saved and then silently never run", () => {
    for (const bad of [
      "",
      "every monday",
      "* * * *",
      "* * * * * *",
      "60 * * * *",
      "* 24 * * *",
      "* * 0 * *",
      "* * * 13 *",
      "* * * * 7",
      "*/0 * * * *",
      "9-5 * * * *",
      "1-2-3 * * * *",
      "a * * * *",
    ]) {
      expect(isValidCron(bad)).toBe(false);
    }
  });
});
