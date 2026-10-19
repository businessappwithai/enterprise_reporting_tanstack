import { describe, expect, it } from "bun:test";
import {
  isAdminUser,
  refuseUnlessOwnerOrAdmin,
  refuseWithoutPermission,
} from "../resource-guard";

// The permission sets the seed gives the built-in roles.
const nlQueryUser = { id: "u-nlq", roles: ["NLQueryUser"], permissions: ["nl_query:*"] };
const analyst = {
  id: "u-analyst",
  roles: ["Analyst"],
  permissions: ["data_source:view", "query:*", "report:*", "chart:*", "dashboard:view", "dashboard:edit"],
};
const viewer = {
  id: "u-viewer",
  roles: ["Viewer"],
  permissions: ["data_source:view", "query:view", "report:view", "chart:view", "dashboard:view"],
};
const administrator = {
  id: "u-admin",
  roles: ["Administrator"],
  permissions: ["*:*", "admin:*", "report:*"],
};

describe("refuseWithoutPermission", () => {
  // Found by QA: the nlquery account permanently deleted an administrator's report.
  it("refuses an account that only holds nl_query:*, for every resource and action", () => {
    for (const resource of ["report", "chart", "dashboard", "query", "log", "setting"] as const) {
      for (const action of ["view", "create", "edit", "delete"] as const) {
        expect(refuseWithoutPermission(nlQueryUser, resource, action)?.status).toBe(403);
      }
    }
  });

  it("honours the distinctions the seeded roles already make", () => {
    expect(refuseWithoutPermission(analyst, "report", "delete")).toBeNull(); // report:*
    expect(refuseWithoutPermission(analyst, "dashboard", "edit")).toBeNull();
    expect(refuseWithoutPermission(analyst, "dashboard", "delete")?.status).toBe(403);
    expect(refuseWithoutPermission(viewer, "report", "view")).toBeNull();
    expect(refuseWithoutPermission(viewer, "report", "edit")?.status).toBe(403);
    expect(refuseWithoutPermission(viewer, "chart", "delete")?.status).toBe(403);
  });

  it("allows an administrator everything", () => {
    expect(refuseWithoutPermission(administrator, "log", "view")).toBeNull();
    expect(refuseWithoutPermission(administrator, "dashboard", "delete")).toBeNull();
  });

  it("says what was refused", async () => {
    const body = (await refuseWithoutPermission(viewer, "report", "delete")?.json()) as {
      error: { code: string; message: string };
    };
    expect(body.error.code).toBe("FORBIDDEN");
    expect(body.error.message).toBe("You do not have permission to delete reports");
  });
});

describe("refuseUnlessOwnerOrAdmin", () => {
  it("lets an owner change their own row", () => {
    expect(refuseUnlessOwnerOrAdmin(analyst, "u-analyst", "report")).toBeNull();
  });

  it("refuses holding report:* as a licence to change someone else's report", () => {
    expect(refuseUnlessOwnerOrAdmin(analyst, "u-admin", "report")?.status).toBe(403);
  });

  it("lets an administrator change anyone's", () => {
    expect(refuseUnlessOwnerOrAdmin(administrator, "u-analyst", "report")).toBeNull();
  });

  it("refuses a row with no recorded owner to a non-administrator", () => {
    expect(refuseUnlessOwnerOrAdmin(analyst, null, "report")?.status).toBe(403);
    expect(refuseUnlessOwnerOrAdmin(analyst, undefined, "report")?.status).toBe(403);
  });
});

describe("isAdminUser", () => {
  it("recognises the Admin and Administrator roles and the wildcard permissions", () => {
    expect(isAdminUser({ roles: ["Admin"], permissions: [] })).toBe(true);
    expect(isAdminUser({ roles: ["Administrator"], permissions: [] })).toBe(true);
    expect(isAdminUser({ roles: ["Custom"], permissions: ["admin:*"] })).toBe(true);
    expect(isAdminUser({ roles: ["Custom"], permissions: ["*:*"] })).toBe(true);
  });

  it("does not treat a resource wildcard as administrator", () => {
    expect(isAdminUser(analyst)).toBe(false);
    expect(isAdminUser(nlQueryUser)).toBe(false);
  });
});
