import { beforeEach, describe, expect, it, mock } from "bun:test";

// Each test scripts what the next getSession calls do: return a value, or throw.
let getSessionCalls: Array<() => unknown> = [];
let getSessionCallCount = 0;

mock.module("@/lib/auth/better-auth", () => ({
  SESSION_COOKIE_NAME: "ers.session_token",
  getAuth: () => ({
    api: {
      getSession: async () => {
        const next = getSessionCalls[getSessionCallCount++];
        return next ? next() : null;
      },
    },
  }),
}));

// The role lookup: a chain that ends in an empty role list.
const chain: Record<string, unknown> = {};
for (const method of ["selectFrom", "innerJoin", "where", "selectAll"]) {
  chain[method] = () => chain;
}
chain.execute = async () => [];
mock.module("@/lib/db/config", () => ({ getDb: () => chain }));

const { getSessionFromHeaders, SessionUnavailableError } = await import("../session");

const headers = new Headers({ cookie: "ers.session_token=abc.def" });
const signedIn = () => ({
  user: { id: "u1", email: "a@example.com", name: "A" },
  session: { expiresAt: new Date(Date.now() + 60_000) },
});
const outage = () => {
  throw new Error("connect ECONNREFUSED 127.0.0.1:5432");
};

describe("getSessionFromHeaders tells 'signed out' from 'could not check'", () => {
  beforeEach(() => {
    getSessionCalls = [];
    getSessionCallCount = 0;
  });

  it("is null when Better Auth finds no session", async () => {
    getSessionCalls = [() => null];
    expect(await getSessionFromHeaders(headers)).toBeNull();
    expect(getSessionCallCount).toBe(1);
  });

  it("resolves a session", async () => {
    getSessionCalls = [signedIn];
    const session = await getSessionFromHeaders(headers);
    expect(session?.user.id).toBe("u1");
  });

  // Found by QA: under load the guard sent signed-in users to /login.
  it("retries once, so a dropped connection is not an outage", async () => {
    getSessionCalls = [outage, signedIn];
    const session = await getSessionFromHeaders(headers);
    expect(session?.user.id).toBe("u1");
    expect(getSessionCallCount).toBe(2);
  });

  it("throws SessionUnavailableError, not null, when the database stays down", async () => {
    getSessionCalls = [outage, outage];
    const result = getSessionFromHeaders(headers);
    await expect(result).rejects.toBeInstanceOf(SessionUnavailableError);
  });
});
