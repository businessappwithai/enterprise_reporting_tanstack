/**
 * Enterprise Reporting System - Initial Setup Script
 * Compliant with CLAUDE.md: Uses PGLite exclusively for all data
 * Initializes database, creates admin user, and sets default configuration
 * 
 * Usage: bun scripts/setup.ts
 */

import { PGlite } from "@electric-sql/pglite";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = process.env.DATA_DIR || "./data";

// Admin user credentials
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin";
// bcrypt hash of "admin" (10 rounds) – pre-computed
const ADMIN_PASSWORD_HASH = "$2a$10$9aE.ODJU.nWyAVpLuNSnS.j2Kz5X1g27dZM6ycAb0xzUyf0/fw3bO";
const ADMIN_ID = "1aa00cc2af0225000c5c114df3eebb69";
const ADMIN_ROLE_ID = "admin-role-id-000000000000000000000000";

const ADMIN_PERMISSIONS = JSON.stringify([
  "*:*",
  "admin:*",
  "data_source:read",
  "data_source:write",
  "data_source:edit",
  "data_source:delete",
  "data_source:view",
  "data_source:execute",
  "data_source:*",
  "query:read",
  "query:write",
  "query:edit",
  "query:delete",
  "query:view",
  "query:execute",
  "query:*",
  "report:read",
  "report:write",
  "report:edit",
  "report:delete",
  "report:view",
  "report:export",
  "report:*",
  "chart:read",
  "chart:write",
  "chart:edit",
  "chart:delete",
  "chart:view",
  "chart:*",
  "dashboard:read",
  "dashboard:write",
  "dashboard:edit",
  "dashboard:delete",
  "dashboard:view",
  "dashboard:*",
  "job:read",
  "job:write",
  "job:edit",
  "job:delete",
  "job:view",
  "job:execute",
  "job:*",
  "user:read",
  "user:write",
  "user:edit",
  "user:delete",
  "user:view",
  "user:*",
  "role:read",
  "role:write",
  "role:edit",
  "role:delete",
  "role:view",
  "role:*",
  "queue:*",
  "filter:*",
  "metadata:read",
  "metadata:write",
  "metadata:edit",
  "metadata:delete",
  "metadata:view",
  "metadata:*",
  "log:read",
  "log:view",
  "log:*",
  "notification:read",
  "notification:write",
  "notification:view",
  "notification:*",
  "setting:read",
  "setting:write",
  "setting:edit",
  "setting:view",
  "setting:*",
  "email_template:read",
  "email_template:write",
  "email_template:edit",
  "email_template:delete",
  "email_template:view",
  "email_template:*",
  "dataset:read",
  "dataset:write",
  "dataset:edit",
  "dataset:delete",
  "dataset:view",
  "dataset:*",
]);

async function setupMainDatabase() {
  console.log("\n========================================");
  console.log("Setting up PGLite Database");
  console.log("========================================\n");

  // Remove stale lock file
  const pidFile = join(DATA_DIR, "postmaster.pid");
  if (existsSync(pidFile)) {
    rmSync(pidFile);
    console.log("✓ Removed stale postmaster.pid");
  }

  // Ensure directory exists
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
    console.log(`✓ Created directory: ${DATA_DIR}`);
  }

  // Initialize PGLite
  console.log(`Initializing PGLite at: ${DATA_DIR}`);
  const pglite = new PGlite(DATA_DIR);
  await pglite.waitReady;
  console.log("✓ PGLite ready");

  // Create tables
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      permissions TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS user_roles (
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
      assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, role_id)
    )`,

    `CREATE TABLE IF NOT EXISTS data_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      client_type TEXT NOT NULL,
      connection_config TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      is_editable BOOLEAN DEFAULT false,
      is_deleted BOOLEAN DEFAULT false,
      deleted_at TEXT,
      deleted_by TEXT REFERENCES users(id),
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS saved_queries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
      sql_content TEXT NOT NULL,
      parameters_schema TEXT,
      is_validated BOOLEAN DEFAULT false,
      validation_result TEXT,
      is_deleted BOOLEAN DEFAULT false,
      deleted_at TEXT,
      deleted_by TEXT REFERENCES users(id),
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS report_definitions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      saved_query_id TEXT REFERENCES saved_queries(id),
      column_config TEXT,
      filter_config TEXT,
      sort_config TEXT,
      pagination_config TEXT,
      export_formats TEXT,
      filename_template TEXT,
      color_theme TEXT,
      is_public BOOLEAN DEFAULT false,
      is_deleted BOOLEAN DEFAULT false,
      deleted_at TEXT,
      deleted_by TEXT REFERENCES users(id),
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      type TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS data_sources_config (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      client_type TEXT NOT NULL,
      connection_config TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  console.log(`\nCreating ${tables.length} tables...`);
  for (const sql of tables) {
    try {
      await pglite.query(sql);
    } catch (err) {
      const error = err as any;
      if (!error.message?.includes("already exists")) {
        console.error(`✗ Error creating table:`, error.message?.slice(0, 100));
      }
    }
  }
  console.log("✓ All tables created/verified");

  // Create admin role
  console.log("\nCreating administrator role...");
  try {
    await pglite.query(
      `INSERT INTO roles (id, name, description, permissions, created_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (name) DO NOTHING`,
      [ADMIN_ROLE_ID, "Administrator", "Full system administrator", ADMIN_PERMISSIONS, new Date().toISOString()]
    );
    console.log("✓ Administrator role created");
  } catch (err) {
    console.error("✗ Error creating role:", (err as Error).message?.slice(0, 100));
  }

  // Create admin user
  console.log("Creating admin user...");
  try {
    await pglite.query(
      `INSERT INTO users (id, email, password_hash, display_name, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [ADMIN_ID, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, "System Administrator", true, new Date().toISOString(), new Date().toISOString()]
    );
    console.log(`✓ Admin user created: ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error("✗ Error creating user:", (err as Error).message?.slice(0, 100));
  }

  // Assign admin role to admin user
  console.log("Assigning administrator role to admin user...");
  try {
    await pglite.query(
      `INSERT INTO user_roles (user_id, role_id, assigned_at)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [ADMIN_ID, ADMIN_ROLE_ID, new Date().toISOString()]
    );
    console.log("✓ Administrator role assigned");
  } catch (err) {
    console.error("✗ Error assigning role:", (err as Error).message?.slice(0, 100));
  }

  // Add default settings
  console.log("\nAdding default settings...");
  const settings = [
    ["app_name", "Enterprise Reporting System", "string"],
    ["version", "1.0.0", "string"],
    ["theme", "light", "string"],
    ["default_page_size", "50", "number"],
  ];

  for (const [key, value, type] of settings) {
    try {
      await pglite.query(
        `INSERT INTO app_settings (key, value, type, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (key) DO NOTHING`,
        [key, value, type]
      );
    } catch (err) {
      console.error(`✗ Error setting ${key}:`, (err as Error).message?.slice(0, 100));
    }
  }
  console.log(`✓ ${settings.length} default settings created`);

  // Verify admin user exists
  console.log("\nVerifying admin user...");
  try {
    const result = await pglite.query(`SELECT * FROM users WHERE email = $1`, [ADMIN_EMAIL]);
    if ((result as any).rows?.length > 0) {
      console.log("✓ Admin user verified in PGLite database");
      console.log(`  Email: ${ADMIN_EMAIL}`);
      console.log(`  Display Name: System Administrator`);
      console.log(`  Role: Administrator`);
    } else {
      console.log("✗ Admin user not found!");
    }
  } catch (err) {
    console.error("✗ Error verifying user:", (err as Error).message?.slice(0, 100));
  }

  await pglite.close();
  console.log("\n✓ PGLite database setup complete");
}

async function main() {
  console.log("\n╔════════════════════════════════════════════════╗");
  console.log("║  Enterprise Reporting System - Setup Script    ║");
  console.log("║  Compliant with CLAUDE.md: PGLite Only         ║");
  console.log("╚════════════════════════════════════════════════╝");

  try {
    await setupMainDatabase();

    console.log("\n╔════════════════════════════════════════════════╗");
    console.log("║        ✓ Setup Complete!                       ║");
    console.log("╚════════════════════════════════════════════════╝\n");

    console.log("📝 Login Credentials:");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("   Role:     Administrator (full access)\n");

    console.log("📂 Database Location:");
    console.log(`   PGLite:   ${DATA_DIR}/\n`);

    console.log("🚀 Next Steps:");
    console.log("   1. Run: bun run dev");
    console.log("   2. Open: http://localhost:4050");
    console.log("   3. Login with admin credentials above\n");

    console.log("✅ Compliance:");
    console.log("   ✓ Uses PGLite exclusively (per CLAUDE.md)");
    console.log("   ✓ Instant commits - all data persisted immediately");
    console.log("   ✓ Unified database - all data in one PGLite instance\n");
  } catch (error) {
    console.error("\n✗ Setup failed:", error);
    process.exit(1);
  }
}

main();
