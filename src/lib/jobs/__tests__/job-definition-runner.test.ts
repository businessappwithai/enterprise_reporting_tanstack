import { beforeEach, describe, expect, it } from "bun:test";

// No mock.module here: it is process-wide in Bun and would leak into the worker tests. The
// runner's collaborators are injected, so the real (never-called) imports are harmless.
import { runDueJobDefinitions } from "../job-definition-runner";
type Deps = Parameters<typeof runDueJobDefinitions>[1] & object;

const NOW = new Date("2026-10-19T08:00:30Z"); // Monday 08:00 UTC; seconds must not matter

const job = (over: Record<string, unknown> = {}) => ({
  id: "j1",
  name: "Weekly sales",
  job_type: "report",
  target_id: "r1",
  schedule_cron: "0 8 * * 1",
  parameters: '{"format":"xlsx"}',
  created_by: "u1",
  ...over,
});

let calls: string[];
let finished: Array<{ id: string; status: string; error?: string }>;
let claimed: Set<string>;
let running: boolean;
let jobs: ReturnType<typeof job>[];
let result: { success: boolean; error?: string; outputLocation?: string; duration: number };

const deps = (): Deps => ({
  listScheduled: async () => jobs,
  isRunning: async () => running,
  claim: async (jobId, minute) => {
    const key = `${jobId}@${minute}`;
    if (claimed.has(key)) return null;
    claimed.add(key);
    return `exec-${jobId}`;
  },
  finish: async (id, outcome) => {
    finished.push({ id, status: outcome.status, error: outcome.error });
  },
  runReport: async (j, userId, format) => {
    calls.push(`report:${j.target_id}:${userId}:${format}`);
    return result;
  },
  runExport: async (j, userId, format) => {
    calls.push(`export:${j.target_id}:${userId}:${format}`);
    return result;
  },
});

describe("runDueJobDefinitions", () => {
  beforeEach(() => {
    calls = [];
    finished = [];
    claimed = new Set();
    running = false;
    jobs = [job()];
    result = { success: true, outputLocation: "./job-outputs/x.xlsx", duration: 12 };
  });

  it("runs a due report job as its creator, in its format, and records completion", async () => {
    const summary = await runDueJobDefinitions(NOW, deps());
    expect(summary.started).toEqual(["j1"]);
    expect(calls).toEqual(["report:r1:u1:xlsx"]);
    expect(finished).toEqual([{ id: "exec-j1", status: "completed", error: undefined }]);
  });

  it("runs an export job through the export worker", async () => {
    jobs = [job({ job_type: "export", target_id: "q1", parameters: null })];
    await runDueJobDefinitions(NOW, deps());
    expect(calls).toEqual(["export:q1:u1:csv"]);
  });

  it("does nothing for a job that is not due this minute", async () => {
    jobs = [job({ schedule_cron: "0 9 * * 1" }), job({ id: "j2", schedule_cron: "0 8 * * 2" })];
    const summary = await runDueJobDefinitions(NOW, deps());
    expect(summary.started).toEqual([]);
    expect(calls).toEqual([]);
  });

  it("runs a minute once however often it is polled", async () => {
    const d = deps();
    await runDueJobDefinitions(NOW, d);
    const second = await runDueJobDefinitions(new Date("2026-10-19T08:00:50Z"), d);
    expect(second.skipped).toEqual([{ jobId: "j1", reason: "claimed" }]);
    expect(calls).toHaveLength(1);
  });

  it("does not start a job that is still running", async () => {
    running = true;
    const summary = await runDueJobDefinitions(NOW, deps());
    expect(summary.skipped).toEqual([{ jobId: "j1", reason: "running" }]);
    expect(calls).toEqual([]);
    expect(claimed.size).toBe(0);
  });

  it("records a refusal from the worker as a failure with its reason", async () => {
    result = { success: false, error: "You don't have permission to access: hr_salaries", duration: 3 };
    await runDueJobDefinitions(NOW, deps());
    expect(finished).toEqual([
      { id: "exec-j1", status: "failed", error: "You don't have permission to access: hr_salaries" },
    ]);
  });

  it("records a job with no owner as a failure, without running anything", async () => {
    jobs = [job({ created_by: null })];
    await runDueJobDefinitions(NOW, deps());
    expect(calls).toEqual([]);
    expect(finished[0].status).toBe("failed");
    expect(finished[0].error).toContain("no owner");
  });

  it("records a worker that throws, and carries on with the other jobs", async () => {
    jobs = [job(), job({ id: "j2", target_id: "r2" })];
    const d = deps();
    d.runReport = async (j) => {
      if (j.id === "j1") throw new Error("boom");
      calls.push(`report:${j.target_id}`);
      return result;
    };
    await runDueJobDefinitions(NOW, d);
    expect(finished.map((f) => `${f.id}:${f.status}`).sort()).toEqual([
      "exec-j1:failed",
      "exec-j2:completed",
    ]);
    expect(calls).toEqual(["report:r2"]);
  });

  it("ignores a schedule it cannot parse", async () => {
    jobs = [job({ schedule_cron: "every monday" })];
    const summary = await runDueJobDefinitions(NOW, deps());
    expect(summary.started).toEqual([]);
  });
});
