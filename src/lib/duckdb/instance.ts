/**
 * DuckDB-Wasm instance management.
 * Creates and manages a singleton DuckDB instance running in a Web Worker.
 */

import * as duckdb from "@duckdb/duckdb-wasm";
import duckdbEhWasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import duckdbMvpWasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import duckdbEhWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import duckdbMvpWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import type { AsyncDuckDB, AsyncDuckDBConnection, DuckDBInstanceOptions } from "./types";
import { DEFAULT_DUCKDB_OPTIONS } from "./types";

let dbInstance: AsyncDuckDB | null = null;
let initPromise: Promise<AsyncDuckDB> | null = null;

// The engine is served from this application's own origin, not from jsDelivr. A browser
// refuses to construct a Worker from a cross-origin script ("Script at https://cdn.jsdelivr.net/…
// cannot be accessed from origin …"), so loading the bundles from the CDN never started
// DuckDB at all — and an on-premise install should not need a public CDN to open a page.
// (The pthread/COI bundles are left out; they need a further worker and nothing here uses threads.)
const BUNDLES: duckdb.DuckDBBundles = {
  mvp: { mainModule: duckdbMvpWasm, mainWorker: duckdbMvpWorker },
  eh: { mainModule: duckdbEhWasm, mainWorker: duckdbEhWorker },
};

/**
 * Select the best available DuckDB bundle for the current browser.
 */
async function selectBundle(): Promise<duckdb.DuckDBBundle> {
  return await duckdb.selectBundle(BUNDLES);
}

/**
 * Initialize and return a singleton DuckDB-Wasm instance.
 * If already initialized, returns the existing instance.
 */
export async function initDuckDB(options: DuckDBInstanceOptions = {}): Promise<AsyncDuckDB> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  const opts = { ...DEFAULT_DUCKDB_OPTIONS, ...options };

  initPromise = (async () => {
    const bundle = await selectBundle();

    const worker = new Worker(bundle.mainWorker ?? "");
    const logger = new duckdb.ConsoleLogger(
      opts.enableLogging ? duckdb.LogLevel.INFO : duckdb.LogLevel.WARNING
    );

    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    // Apply configuration
    const conn = await db.connect();
    try {
      if (opts.maxMemory) {
        const mb = Math.floor(opts.maxMemory / (1024 * 1024));
        await conn.query(`SET memory_limit = '${mb}MB'`);
      }
      // Only the pthread (COI) bundle has threads; setting them on the others is an error.
      if (opts.threads && bundle.pthreadWorker) {
        await conn.query(`SET threads = ${opts.threads}`);
      }
    } finally {
      await conn.close();
    }

    dbInstance = db;
    return db;
  })();

  try {
    return await initPromise;
  } catch (err) {
    initPromise = null;
    throw err;
  }
}

/**
 * Get the current DuckDB instance (null if not initialized).
 */
export function getDuckDB(): AsyncDuckDB | null {
  return dbInstance;
}

/**
 * Create a new connection to the DuckDB instance.
 */
export async function createConnection(): Promise<AsyncDuckDBConnection> {
  const db = await initDuckDB();
  return db.connect();
}

/**
 * Close the DuckDB instance and release resources.
 */
export async function closeDuckDB(): Promise<void> {
  if (dbInstance) {
    await dbInstance.terminate();
    dbInstance = null;
    initPromise = null;
  }
}
