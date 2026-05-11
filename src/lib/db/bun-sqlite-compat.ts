/**
 * SQLite compatibility shim matching the better-sqlite3 API surface.
 * Uses bun:sqlite under Bun runtime, falls back to better-sqlite3 under Node/Vite SSR.
 *
 * Avoids top-level await so this module can be statically imported by Vite SSR.
 * Uses createRequire for synchronous loading of native modules.
 */

import { createRequire } from "node:module";

const _require = createRequire(import.meta.url);

// biome-ignore lint/suspicious/noExplicitAny: runtime compat
let BunDB: any;

const isBun = typeof (globalThis as any).Bun !== "undefined";

if (isBun) {
  // bun:sqlite is synchronously available under Bun via require
  BunDB = _require("bun:sqlite").Database;
} else {
  BunDB = _require("better-sqlite3");
}

class Statement {
  reader: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: bun:sqlite internals
  private _stmt: any;

  // biome-ignore lint/suspicious/noExplicitAny: bun:sqlite internals
  constructor(stmt: any, sql: string) {
    this._stmt = stmt;
    const trimmed = sql.trim().toUpperCase();
    this.reader = /^(SELECT|WITH|PRAGMA|EXPLAIN|VALUES)/.test(trimmed);
  }

  // Normalise args: detect single-array wrapping (some drivers wrap all params in one array)
  // and convert booleans to 0/1 (bun:sqlite rejects boolean values).
  private _normalizeArgs(args: unknown[]): unknown[] {
    const arr = args.length === 1 && Array.isArray(args[0]) ? (args[0] as unknown[]) : args;
    return arr.map((v) => (typeof v === "boolean" ? (v ? 1 : 0) : v));
  }

  run(...args: unknown[]): { changes: number; lastInsertRowid: number | bigint } {
    const params = this._normalizeArgs(args);
    const result = this._stmt.run(...params);
    return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
  }

  get(...args: unknown[]): unknown {
    const params = this._normalizeArgs(args);
    return this._stmt.get(...params);
  }

  all(...args: unknown[]): unknown[] {
    const params = this._normalizeArgs(args);
    return this._stmt.all(...params) as unknown[];
  }

  *iterate(...args: unknown[]): IterableIterator<unknown> {
    const params = this._normalizeArgs(args);
    yield* this._stmt.iterate(...params) as IterableIterator<unknown>;
  }

  // Stub methods present in better-sqlite3 but not needed with bun:sqlite
  pluck(_toggle = true): this {
    return this;
  }
  raw(_toggle = true): this {
    return this;
  }
  columns(): unknown[] {
    return [];
  }
}

export class Database {
  // biome-ignore lint/suspicious/noExplicitAny: bun:sqlite internals
  private _db: any;

  constructor(filename: string, _options?: { readonly?: boolean; nativeBinding?: string }) {
    this._db = new BunDB(filename);
    // Use prepare().run() — compatible with both bun:sqlite and better-sqlite3
    this._db.prepare("PRAGMA foreign_keys = ON").run();
    this._db.prepare("PRAGMA journal_mode = WAL").run();
  }

  prepare(sql: string): Statement {
    return new Statement(this._db.prepare(sql), sql);
  }

  pragma(str: string, options?: { simple?: boolean }): unknown {
    const result = this._db.prepare(`PRAGMA ${str}`).get();
    if (options?.simple) {
      return result ? Object.values(result as Record<string, unknown>)[0] : undefined;
    }
    return result;
  }

  close(): void {
    this._db.close();
  }

  get open(): boolean {
    return !this._db.closed;
  }
}

export default Database;
