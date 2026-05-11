/**
 * SQLite wrapper - Provides database access using bun:sqlite (Bun) or better-sqlite3 (Node)
 */

import fs from "fs";
import path from "path";

const isBun = typeof (globalThis as any).Bun !== "undefined";
// biome-ignore lint/suspicious/noExplicitAny: dynamic import for runtime compat
let Database: any;
if (isBun) {
  const mod = await import("bun:sqlite");
  Database = mod.default || mod.Database;
} else {
  const mod = await import("better-sqlite3");
  Database = mod.default;
}

class BunSQLiteWrapper {
  private db: Database.Database;

  constructor(dbPath: string) {
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);
    // Enable foreign keys
    this.db.exec("PRAGMA foreign_keys = ON");
  }

  /**
   * Execute a raw query
   */
  query(sql: string, params: any[] = []): any[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  /**
   * Execute a write operation (INSERT, UPDATE, DELETE)
   */
  run(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number } {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  /**
   * Get a single record
   */
  get(sql: string, params: any[] = []): any | null {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params);
  }

  /**
   * Close the database
   */
  close(): void {
    this.db.close();
  }
}

let wrapperInstance: BunSQLiteWrapper | null = null;

export function getBunSQLiteWrapper(dbPath?: string): BunSQLiteWrapper {
  if (!wrapperInstance) {
    const path = dbPath || process.env.DATABASE_PATH || "./data/config.sqlite";
    wrapperInstance = new BunSQLiteWrapper(path);
  }
  return wrapperInstance;
}

export async function closeBunSQLiteWrapper(): Promise<void> {
  if (wrapperInstance) {
    wrapperInstance.close();
    wrapperInstance = null;
  }
}

export { BunSQLiteWrapper };
