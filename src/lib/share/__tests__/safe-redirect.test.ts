import { describe, expect, it } from "bun:test";
import { safeRedirectTarget } from "../safe-redirect";

describe("safeRedirectTarget", () => {
  it("accepts a path on this site, with its query and hash", () => {
    expect(safeRedirectTarget("/share/dashboard/abc-123")).toBe("/share/dashboard/abc-123");
    expect(safeRedirectTarget("/reports?page=2#top")).toBe("/reports?page=2#top");
  });

  it("refuses anything that would leave the site", () => {
    for (const bad of [
      "//evil.example.com",
      "/\\evil.example.com",
      "https://evil.example.com/x",
      "http://evil.example.com",
      "javascript:alert(1)",
      "evil.example.com",
      "",
      null,
      undefined,
    ]) {
      expect(safeRedirectTarget(bad as string | null | undefined)).toBeNull();
    }
  });

  it("refuses control characters that browsers strip before resolving a URL", () => {
    expect(safeRedirectTarget("/\t/evil.example.com")).toBeNull();
    expect(safeRedirectTarget("/ok\nLocation: x")).toBeNull();
  });

  it("does not bounce back to the login page", () => {
    expect(safeRedirectTarget("/login")).toBeNull();
    expect(safeRedirectTarget("/login?redirect=/x")).toBeNull();
  });

  it("refuses an absurdly long value", () => {
    expect(safeRedirectTarget("/" + "a".repeat(3000))).toBeNull();
  });
});
