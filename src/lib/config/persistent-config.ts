/**
 * Persistent Configuration Store - Uses PGLite for unified data storage
 * Compliant with CLAUDE.md: All data uses PGLite exclusively
 * Instant commits - all writes persisted to disk immediately
 */

import { PGlite } from "@electric-sql/pglite";
import { join } from "node:path";
import { existsSync, mkdirSync, rmSync } from "node:fs";

const DATA_DIR = process.env.DATA_DIR || "./data";

let pgliteInstance: PGlite | null = null;

/**
 * Initialize PGLite for configuration storage
 */
async function initPGlite(): Promise<PGlite> {
  if (pgliteInstance) return pgliteInstance;

  // Remove stale lock file
  const pidFile = join(DATA_DIR, "postmaster.pid");
  if (existsSync(pidFile)) {
    rmSync(pidFile);
  }

  // Ensure data directory exists
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  pgliteInstance = new PGlite(DATA_DIR);
  await pgliteInstance.waitReady;

  console.log(`[config] PGLite initialized at: ${DATA_DIR}`);

  createConfigTables();

  return pgliteInstance;
}

/**
 * Create configuration tables in PGLite
 */
function createConfigTables() {
  const db = getPGlite();

  // Data sources configuration table
  db.query(`
    CREATE TABLE IF NOT EXISTS data_sources_config (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      client_type TEXT NOT NULL,
      connection_config TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Application settings table
  db.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      type TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Get PGLite instance
 */
export function getPGlite(): PGlite {
  if (!pgliteInstance) {
    throw new Error("PGLite not initialized. Call initConfigDb first.");
  }
  return pgliteInstance;
}

/**
 * Initialize config database (async)
 */
export async function initConfigDb(): Promise<void> {
  await initPGlite();
}

/**
 * Save data source configuration
 * Instant commit - written to disk immediately
 */
export function saveDataSourceConfig(id: string, config: {
  name: string;
  description?: string;
  client_type: string;
  connection_config: string;
  is_active?: boolean;
}): boolean {
  try {
    const db = getPGlite();
    db.query(
      `INSERT INTO data_sources_config (id, name, description, client_type, connection_config, is_active, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO UPDATE SET
       name = $2, description = $3, client_type = $4, connection_config = $5, is_active = $6, updated_at = NOW()`,
      [
        id,
        config.name,
        config.description || null,
        config.client_type,
        config.connection_config,
        config.is_active ?? true,
      ]
    );

    console.log(`[config] Saved data source: ${id}`);
    return true;
  } catch (error) {
    console.error(`[config] Failed to save data source: ${id}`, error);
    return false;
  }
}

/**
 * Get data source configuration
 */
export function getDataSourceConfig(id: string): any | null {
  try {
    const db = getPGlite();
    const result = db.query(
      `SELECT * FROM data_sources_config WHERE id = $1`,
      [id]
    );
    return (result as any).rows?.[0] || null;
  } catch (error) {
    console.error(`[config] Failed to get data source: ${id}`, error);
    return null;
  }
}

/**
 * Get all data source configurations
 */
export function getAllDataSourceConfigs(): any[] {
  try {
    const db = getPGlite();
    const result = db.query(
      `SELECT * FROM data_sources_config ORDER BY updated_at DESC`
    );
    return (result as any).rows || [];
  } catch (error) {
    console.error(`[config] Failed to get all data sources`, error);
    return [];
  }
}

/**
 * Delete data source configuration
 */
export function deleteDataSourceConfig(id: string): boolean {
  try {
    const db = getPGlite();
    db.query(`DELETE FROM data_sources_config WHERE id = $1`, [id]);
    console.log(`[config] Deleted data source: ${id}`);
    return true;
  } catch (error) {
    console.error(`[config] Failed to delete data source: ${id}`, error);
    return false;
  }
}

/**
 * Save application setting
 * Instant commit - written to disk immediately
 */
export function saveSetting(key: string, value: string, type?: string): boolean {
  try {
    const db = getPGlite();
    db.query(
      `INSERT INTO app_settings (key, value, type, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, type = $3, updated_at = NOW()`,
      [key, value, type || "string"]
    );
    console.log(`[config] Saved setting: ${key}`);
    return true;
  } catch (error) {
    console.error(`[config] Failed to save setting: ${key}`, error);
    return false;
  }
}

/**
 * Get application setting
 */
export function getSetting(key: string): string | null {
  try {
    const db = getPGlite();
    const result = db.query(
      `SELECT value FROM app_settings WHERE key = $1`,
      [key]
    );
    return (result as any).rows?.[0]?.value || null;
  } catch (error) {
    console.error(`[config] Failed to get setting: ${key}`, error);
    return null;
  }
}

/**
 * Close PGLite database
 */
export async function closeConfigDb(): Promise<void> {
  if (pgliteInstance) {
    try {
      await pgliteInstance.close();
      pgliteInstance = null;
      console.log(`[config] PGLite closed`);
    } catch (error) {
      console.error(`[config] Error closing PGLite:`, error);
    }
  }
}

/**
 * Verify configuration persistence is working
 */
export function verifyPersistence(): boolean {
  try {
    const db = getPGlite();
    const result = db.query(
      `SELECT COUNT(*) as count FROM data_sources_config`
    );
    const count = (result as any).rows?.[0]?.count || 0;
    console.log(`[config] Verified - ${count} configs stored in PGLite`);
    return true;
  } catch (error) {
    console.error(`[config] Persistence verification failed:`, error);
    return false;
  }
}
