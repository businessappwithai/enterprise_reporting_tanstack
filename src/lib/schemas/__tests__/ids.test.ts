import { describe, expect, it } from "bun:test";
import { createUserSchema, getUserSchema, updateUserSchema } from "../users";
import { getRoleSchema, updateRoleSchema } from "../roles";

// The ids the bootstrap writes, which are not UUIDs. Found by QA through the Users page:
// the NLQueryUser role could never be assigned, and these accounts could not be edited.
const BUILT_IN_USER_ID = "1aa00cc2af0225000c5c114df3eebb69";
const NLQUERY_USER_ID = "nlquery0user00000000000000000000";
const BUILT_IN_ROLE_IDS = ["admin-role-id", "nlquery0role00000000000000000000"];
const GENERATED_UUID = "3216873e-1ab8-47ee-93d0-d78ea687d9e8";

describe("user and role ids", () => {
  it("accepts the built-in accounts and roles", () => {
    expect(updateUserSchema.safeParse({ id: BUILT_IN_USER_ID }).success).toBe(true);
    expect(updateUserSchema.safeParse({ id: NLQUERY_USER_ID }).success).toBe(true);
    expect(getUserSchema.safeParse({ id: BUILT_IN_USER_ID }).success).toBe(true);
    expect(getRoleSchema.safeParse({ id: BUILT_IN_ROLE_IDS[0] }).success).toBe(true);
    expect(updateRoleSchema.safeParse({ id: BUILT_IN_ROLE_IDS[1] }).success).toBe(true);
  });

  it("lets a user be given a built-in role alongside a generated one", () => {
    const parsed = updateUserSchema.safeParse({
      id: GENERATED_UUID,
      roleIds: [GENERATED_UUID, ...BUILT_IN_ROLE_IDS],
    });
    expect(parsed.success).toBe(true);
    expect(
      createUserSchema.safeParse({
        email: "a@example.com",
        password: "longenough1",
        displayName: "A",
        roleIds: BUILT_IN_ROLE_IDS,
      }).success
    ).toBe(true);
  });

  it("still refuses an empty or absurd id", () => {
    expect(updateUserSchema.safeParse({ id: "" }).success).toBe(false);
    expect(updateUserSchema.safeParse({ id: "x".repeat(256) }).success).toBe(false);
    expect(updateUserSchema.safeParse({ id: GENERATED_UUID, roleIds: [""] }).success).toBe(false);
  });
});
