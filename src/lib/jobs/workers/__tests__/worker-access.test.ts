import { beforeEach, describe, expect, it, mock } from "bun:test";

// What the workers touch, stubbed. The point of the test is what happens when the job's owner
// is refused: the data source must never be opened.
let refusal: string | null = null;
let connectionsOpened = 0;
const queryRow = { id: "q1", name: "Q", sql_content: "SELECT 1", data_source_id: "ds1", saved_query_id: "q1" };

const chain: Record<string, unknown> = {};
for (const method of ["selectFrom", "where", "selectAll"]) chain[method] = () => chain;
chain.executeTakeFirst = async () => queryRow;
mock.module("@/lib/db/config", () => ({ getDb: () => chain }));
mock.module("@/lib/db/connection-manager", () => ({
  getConnection: async () => {
    connectionsOpened++;
    throw new Error("connection opened");
  },
}));
mock.module("@/lib/permissions/actor", () => ({ refuseJobQuery: async () => refusal }));
mock.module("@/lib/security/audit", () => ({ logAudit: async () => {} }));

const { processReportJob } = await import("../report-worker");
const { processExportJob } = await import("../export-worker");
const { processEmailBatchJob } = await import("../email-batch-worker");

describe("job workers run stored SQL as the job's owner", () => {
  beforeEach(() => {
    refusal = "You don't have permission to access: hr_salaries";
    connectionsOpened = 0;
  });

  it("report job: a refused owner never reaches the data source", async () => {
    const result = await processReportJob({ type: "report:generate", reportId: "r1", userId: "u1" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("hr_salaries");
    expect(connectionsOpened).toBe(0);
  });

  it("export job: a refused owner never reaches the data source", async () => {
    const result = await processExportJob({ type: "data:export", queryId: "q1", userId: "u1", format: "csv" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("hr_salaries");
    expect(connectionsOpened).toBe(0);
  });

  it("email batch job: a refused owner never reaches the data source", async () => {
    const result = await processEmailBatchJob({
      type: "email:batch",
      queryId: "q1",
      emailTemplateId: "t1",
      recipientQueryId: "q2",
      recipientEmailColumn: "email",
      userId: "u1",
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain("hr_salaries");
    expect(connectionsOpened).toBe(0);
  });

  it("an allowed owner does reach it (so the tests above are not passing for another reason)", async () => {
    refusal = null;
    const result = await processExportJob({ type: "data:export", queryId: "q1", userId: "u1", format: "csv" });
    expect(connectionsOpened).toBe(1);
    expect(result.error).toContain("connection opened");
  });
});
