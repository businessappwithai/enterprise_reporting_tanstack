import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { refuseForbiddenTarget, refuseWithoutDataSourcePermission } from "../data-source-guard";

// The permission sets the seed gives the built-in roles.
const nlQueryUser = { roles: ["NLQueryUser"], permissions: ["nl_query:*"] };
const analyst = {
  roles: ["Analyst"],
  permissions: ["data_source:view", "query:*", "report:*", "chart:*"],
};
const viewer = { roles: ["Viewer"], permissions: ["data_source:view", "query:view"] };
const administrator = { roles: ["Administrator"], permissions: ["*:*", "admin:*", "data_source:*"] };

describe("refuseWithoutDataSourcePermission", () => {
  // Found by QA: the nlquery account created a data source pointing at 169.254.169.254.
  it("refuses an account that only holds nl_query:*", async () => {
    const refusal = refuseWithoutDataSourcePermission(nlQueryUser, "create");
    expect(refusal?.status).toBe(403);
    expect(((await refusal?.json()) as { error: { message: string } }).error.message).toContain(
      "permission to manage data sources"
    );
  });

  it("refuses roles that can only view data sources", () => {
    expect(refuseWithoutDataSourcePermission(analyst, "create")?.status).toBe(403);
    expect(refuseWithoutDataSourcePermission(viewer, "create")?.status).toBe(403);
  });

  it("allows an administrator", () => {
    expect(refuseWithoutDataSourcePermission(administrator, "create")).toBeNull();
    expect(refuseWithoutDataSourcePermission(administrator, "delete")).toBeNull();
  });

  it("is per action: create does not imply delete", () => {
    const creator = { roles: ["Custom"], permissions: ["data_source:create"] };
    expect(refuseWithoutDataSourcePermission(creator, "create")).toBeNull();
    expect(refuseWithoutDataSourcePermission(creator, "delete")?.status).toBe(403);
  });

  it("refuses a user with no permissions at all", () => {
    expect(refuseWithoutDataSourcePermission({ roles: [], permissions: [] }, "create")?.status).toBe(
      403
    );
  });
});

describe("refuseForbiddenTarget", () => {
  const saved = process.env.ALLOW_PRIVATE_DATA_SOURCES;
  beforeEach(() => {
    delete process.env.ALLOW_PRIVATE_DATA_SOURCES;
  });
  afterEach(() => {
    if (saved === undefined) delete process.env.ALLOW_PRIVATE_DATA_SOURCES;
    else process.env.ALLOW_PRIVATE_DATA_SOURCES = saved;
  });

  for (const host of ["169.254.169.254", "127.0.0.1", "10.0.0.5", "192.168.1.10", "172.16.0.1"]) {
    it(`refuses ${host}`, async () => {
      expect((await refuseForbiddenTarget({ host }))?.status).toBe(403);
    });
  }

  it("allows a public address", async () => {
    expect(await refuseForbiddenTarget({ host: "8.8.8.8" })).toBeNull();
  });

  it("does not judge a config with no host (a file or connection string)", async () => {
    expect(await refuseForbiddenTarget({})).toBeNull();
    expect(await refuseForbiddenTarget(undefined)).toBeNull();
    expect(await refuseForbiddenTarget(null)).toBeNull();
  });

  it("lets an operator whose database really is internal opt out", async () => {
    process.env.ALLOW_PRIVATE_DATA_SOURCES = "1";
    expect(await refuseForbiddenTarget({ host: "10.0.0.5" })).toBeNull();
  });
});
