import { beforeEach, describe, expect, it } from "bun:test";
import {
  allowClientLog,
  CLIENT_LOG_LIMIT,
  clientLogSchema,
  resetClientLogLimiter,
  withClientSource,
} from "../client-log";

const ok = { level: "info", message: "hello", component: "reports/list" };

describe("clientLogSchema", () => {
  it("accepts what useLogger sends", () => {
    expect(clientLogSchema.safeParse({ ...ok, metadata: { a: 1 } }).success).toBe(true);
  });

  it("refuses an unknown level", () => {
    expect(clientLogSchema.safeParse({ ...ok, level: "fatal" }).success).toBe(false);
  });

  it("refuses an empty or oversized message", () => {
    expect(clientLogSchema.safeParse({ ...ok, message: "" }).success).toBe(false);
    expect(clientLogSchema.safeParse({ ...ok, message: "x".repeat(4001) }).success).toBe(false);
  });

  it("refuses a component name that is not a plain identifier", () => {
    for (const component of ["", "a b", "<script>", "x".repeat(101)]) {
      expect(clientLogSchema.safeParse({ ...ok, component }).success).toBe(false);
    }
  });

  it("bounds metadata and the stack", () => {
    const big = { blob: "x".repeat(9 * 1024) };
    expect(clientLogSchema.safeParse({ ...ok, metadata: big }).success).toBe(false);
    expect(clientLogSchema.safeParse({ ...ok, errorStack: "x".repeat(16 * 1024 + 1) }).success).toBe(
      false
    );
  });
});

describe("withClientSource", () => {
  it("labels the entry, and the client cannot claim another source", () => {
    expect(withClientSource(undefined)).toEqual({ source: "client" });
    expect(withClientSource({ source: "server", a: 1 })).toEqual({ source: "client", a: 1 });
  });
});

describe("allowClientLog", () => {
  beforeEach(resetClientLogLimiter);

  it("allows the cap and refuses the next entry, per user", () => {
    for (let i = 0; i < CLIENT_LOG_LIMIT; i++) expect(allowClientLog("u1", 1000)).toBe(true);
    expect(allowClientLog("u1", 1000)).toBe(false);
    expect(allowClientLog("u2", 1000)).toBe(true);
  });

  it("recovers once the minute has passed", () => {
    for (let i = 0; i < CLIENT_LOG_LIMIT; i++) allowClientLog("u1", 1000);
    expect(allowClientLog("u1", 1000 + 60_001)).toBe(true);
  });
});
