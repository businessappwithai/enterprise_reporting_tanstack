import { describe, expect, it } from "bun:test";
import path from "node:path";
import { contentTypeFor, resolveOutputFile } from "../output-dir";

const DIR = "/srv/app/job-outputs";

describe("resolveOutputFile", () => {
  it("accepts a file inside the output directory, absolute or relative to it", () => {
    expect(resolveOutputFile("/srv/app/job-outputs/report_1.csv", DIR)).toBe(
      "/srv/app/job-outputs/report_1.csv"
    );
    const cwd = process.cwd();
    expect(resolveOutputFile(path.join("job-outputs", "x.csv"), path.join(cwd, "job-outputs"))).toBe(
      path.join(cwd, "job-outputs", "x.csv")
    );
  });

  it("refuses anything that resolves outside it", () => {
    for (const stored of [
      "/etc/passwd",
      "/srv/app/job-outputs/../.env",
      "/srv/app/job-outputs-evil/x.csv",
      "/srv/app/job-outputs",
      "",
    ]) {
      expect(resolveOutputFile(stored, DIR)).toBeNull();
    }
  });
});

describe("contentTypeFor", () => {
  it("maps the formats a job can produce", () => {
    expect(contentTypeFor("a.csv")).toContain("text/csv");
    expect(contentTypeFor("a.XLSX")).toContain("spreadsheetml");
    expect(contentTypeFor("a.pdf")).toBe("application/pdf");
    expect(contentTypeFor("a.bin")).toBe("application/octet-stream");
  });
});
