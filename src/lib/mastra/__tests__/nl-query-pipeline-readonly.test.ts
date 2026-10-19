import { beforeEach, describe, expect, it, mock } from "bun:test";

const audited: Record<string, unknown>[] = [];
mock.module("@/lib/security/audit", () => ({
  logAudit: async (entry: Record<string, unknown>) => {
    audited.push(entry);
  },
}));

const { executeNlQueryPipeline } = await import("../nl-query-pipeline");

// The refusal happens before anything touches a database, so a bare object is enough.
const dataSource = { id: "ds-1", client_type: "pg" } as never;

describe("executeNlQueryPipeline refuses anything that is not one read-only statement", () => {
  beforeEach(() => {
    audited.length = 0;
  });

  // Found by QA: entity access said nothing about writing, so these ran as written.
  const writes = [
    "INSERT INTO customer(name) VALUES ('x')",
    "UPDATE customer SET city = 'x' WHERE id = 1; SELECT 1",
    "SELECT 1; DROP TABLE customer",
    "DELETE FROM customer",
    "DROP TABLE customer",
    "TRUNCATE customer",
  ];

  for (const sql of writes) {
    it(`refuses: ${sql}`, async () => {
      const result = await executeNlQueryPipeline("q", sql, "user-1", dataSource);

      expect(result.accessGranted).toBe(false);
      expect(result.queryResults).toBeUndefined();
      expect(result.error).toContain("read-only");
    });
  }

  it("records the refused attempt in the audit log", async () => {
    await executeNlQueryPipeline("q", "DELETE FROM customer", "user-1", dataSource);

    expect(audited).toHaveLength(1);
    expect(audited[0]).toMatchObject({
      userId: "user-1",
      action: "execute",
      resourceType: "query",
      resourceId: "ds-1",
    });
    expect(audited[0].details).toMatchObject({ blocked: "not_read_only" });
  });
});
