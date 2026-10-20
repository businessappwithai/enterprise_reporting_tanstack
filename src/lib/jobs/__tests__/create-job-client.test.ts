import { describe, expect, it } from "bun:test";
import { createJobByName } from "../create-job-client";

type Handler = (url: string, init?: RequestInit) => { status: number; body: unknown };

const fakeFetch = (handler: Handler) => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fn = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const { status, body } = handler(url, init);
    return new Response(JSON.stringify(body), { status });
  };
  return { fn, calls };
};

const targets = (items: Array<{ id: string; name: string }>) => ({
  status: 200,
  body: { success: true, data: { items } },
});

const input = { name: "Weekly sales", jobType: "report", targetName: "QA Sales Report", cron: "0 8 * * 1" };

describe("createJobByName", () => {
  it("resolves the target by name and posts the body the route accepts", async () => {
    const { fn, calls } = fakeFetch((url) =>
      url.startsWith("/api/jobs/targets")
        ? targets([{ id: "r1", name: "QA Sales Report" }])
        : { status: 201, body: { success: true, data: { id: "j1" } } }
    );
    const result = await createJobByName(input, fn);
    expect(result.ok).toBe(true);
    expect(result.message).toContain("0 8 * * 1");
    expect(calls[0].url).toBe("/api/jobs/targets?type=report&search=QA%20Sales%20Report");
    expect(JSON.parse(String(calls[1].init?.body))).toEqual({
      name: "Weekly sales",
      job_type: "report",
      target_id: "r1",
      schedule_cron: "0 8 * * 1",
      parameters: { format: "csv" },
    });
  });

  it("refuses a job type the route does not know, without calling the server", async () => {
    const { fn, calls } = fakeFetch(() => ({ status: 500, body: {} }));
    const result = await createJobByName({ ...input, jobType: "report_export" }, fn);
    expect(result.ok).toBe(false);
    expect(result.message).toContain('"report"');
    expect(calls).toHaveLength(0);
  });

  it("says so when nothing matches", async () => {
    const { fn } = fakeFetch(() => targets([]));
    const result = await createJobByName(input, fn);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("no report matching");
  });

  it("asks which one when the name is ambiguous, and prefers an exact match", async () => {
    const two = [
      { id: "r1", name: "Sales" },
      { id: "r2", name: "Sales by region" },
    ];
    const ambiguous = fakeFetch(() => targets(two));
    const a = await createJobByName({ ...input, targetName: "sale" }, ambiguous.fn);
    expect(a.ok).toBe(false);
    expect(a.message).toContain('"Sales", "Sales by region"');

    const exact = fakeFetch((url) =>
      url.startsWith("/api/jobs/targets")
        ? targets(two)
        : { status: 201, body: { success: true, data: { id: "j1" } } }
    );
    const b = await createJobByName({ ...input, targetName: "sales" }, exact.fn);
    expect(b.ok).toBe(true);
    expect(JSON.parse(String(exact.calls[1].init?.body)).target_id).toBe("r1");
  });

  it("relays the server's reason instead of an HTTP status", async () => {
    const { fn } = fakeFetch((url) =>
      url.startsWith("/api/jobs/targets")
        ? targets([{ id: "r1", name: "QA Sales Report" }])
        : {
            status: 403,
            body: { success: false, error: { message: "You don't have permission to access: sales_order" } },
          }
    );
    const result = await createJobByName(input, fn);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("sales_order");
    expect(result.message).not.toContain("HTTP");
  });

  it("explains a job with no schedule honestly", async () => {
    const { fn } = fakeFetch((url) =>
      url.startsWith("/api/jobs/targets")
        ? targets([{ id: "r1", name: "QA Sales Report" }])
        : { status: 201, body: { success: true, data: { id: "j1" } } }
    );
    const result = await createJobByName({ ...input, cron: "" }, fn);
    expect(result.message).toContain("will not run by itself");
  });
});
