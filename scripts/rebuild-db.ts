/**
 * Rebuilds the database with the correct schema matching Kysely types.
 * Uses PGLite for in-process PostgreSQL
 * Run: bun scripts/rebuild-db.ts
 */
import { PGlite } from "@electric-sql/pglite";
import { existsSync, mkdirSync } from "fs";

const DATA_DIR = process.env.DATA_DIR || "./data";
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const ADMIN_USER = {
  id: "1aa00cc2af0225000c5c114df3eebb69",
  email: "admin@admin.com",
  password_hash: "$2a$10$9aE.ODJU.nWyAVpLuNSnS.j2Kz5X1g27dZM6ycAb0xzUyf0/fw3bO",
  display_name: "Admin",
};

// Initialize PGLite
const pglite = new PGlite(DATA_DIR);
await pglite.waitReady;

console.log("Rebuilding database:", DATA_DIR);

// Drop all tables (one at a time - PGLite doesn't support multi-statement queries)
const tablesToDrop = [
  "logs", "app_settings", "audit_log", "resource_permissions", "job_executions", "job_definitions",
  "dashboard_widgets", "dashboard_layouts", "chart_filters", "chart_definitions",
  "report_filters", "report_definitions", "filter_definitions", "saved_queries",
  "ds_entity_permissions", "data_source_entity_permissions", "ds_user_roles",
  "ds_roles", "data_sources", "user_roles", "roles", "notifications",
  "email_templates", "nl_query_history", "error_messages",
  "metadata_entity_fields", "metadata_entity_registry", "data_source_filters",
  "filters", "jobs", "reports", "charts", "dashboards", "users", "_migrations"
];

for (const table of tablesToDrop) {
  try {
    await pglite.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
  } catch (e) {
    // Ignore errors if table doesn't exist
  }
}

console.log("Creating tables...");

// Create each table separately (PGLite doesn't support multi-statement queries)
const tables = [
  `CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE user_roles (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
  )`,
  `CREATE TABLE data_sources (
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
  `CREATE TABLE saved_queries (
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
  `CREATE TABLE report_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    saved_query_id TEXT REFERENCES saved_queries(id),
    column_config TEXT,
    filter_config TEXT,
    sort_config TEXT,
    pagination_config TEXT,
    export_formats TEXT,
    color_theme TEXT,
    is_public BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TEXT,
    deleted_by TEXT REFERENCES users(id),
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE chart_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    saved_query_id TEXT REFERENCES saved_queries(id),
    chart_type TEXT NOT NULL,
    chart_config TEXT,
    data_mapping TEXT,
    refresh_interval INTEGER,
    color_theme TEXT,
    is_public BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TEXT,
    deleted_by TEXT REFERENCES users(id),
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE dashboard_layouts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    layout_config TEXT,
    theme_config TEXT,
    refresh_config TEXT,
    is_public BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TEXT,
    deleted_by TEXT REFERENCES users(id),
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE dashboard_widgets (
    id TEXT PRIMARY KEY,
    dashboard_id TEXT REFERENCES dashboard_layouts(id) ON DELETE CASCADE,
    widget_type TEXT NOT NULL,
    report_id TEXT REFERENCES report_definitions(id),
    chart_id TEXT REFERENCES chart_definitions(id),
    position_config TEXT,
    widget_config TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE filter_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    filter_query TEXT NOT NULL,
    display_field TEXT NOT NULL,
    value_field TEXT NOT NULL,
    field_type TEXT,
    operator TEXT,
    date_validation_config TEXT,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE report_filters (
    id TEXT PRIMARY KEY,
    report_id TEXT REFERENCES report_definitions(id) ON DELETE CASCADE,
    filter_id TEXT REFERENCES filter_definitions(id) ON DELETE CASCADE,
    target_column TEXT NOT NULL,
    filter_order INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE chart_filters (
    id TEXT PRIMARY KEY,
    chart_id TEXT REFERENCES chart_definitions(id) ON DELETE CASCADE,
    filter_id TEXT REFERENCES filter_definitions(id) ON DELETE CASCADE,
    target_column TEXT NOT NULL,
    filter_order INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE job_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    job_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    schedule_cron TEXT,
    parameters TEXT,
    notification_config TEXT,
    is_active BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TEXT,
    deleted_by TEXT REFERENCES users(id),
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE job_executions (
    id TEXT PRIMARY KEY,
    job_definition_id TEXT REFERENCES job_definitions(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    started_at TEXT,
    completed_at TEXT,
    result_location TEXT,
    error_message TEXT,
    execution_metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE email_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE resource_permissions (
    id TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
    permission_level TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    component TEXT NOT NULL,
    user_id TEXT REFERENCES users(id),
    session_id TEXT,
    metadata TEXT,
    error_stack TEXT,
    request_id TEXT
  )`,
  `CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE ds_roles (
    id TEXT PRIMARY KEY,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE ds_user_roles (
    data_source_id TEXT,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    ds_role_id TEXT REFERENCES ds_roles(id) ON DELETE CASCADE,
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (data_source_id, user_id, ds_role_id)
  )`,
  `CREATE TABLE ds_entity_permissions (
    id TEXT PRIMARY KEY,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    ds_role_id TEXT REFERENCES ds_roles(id) ON DELETE CASCADE,
    entity_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_schema TEXT,
    permission_level TEXT NOT NULL,
    column_restrictions TEXT,
    row_filter TEXT,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
];

for (const table of tables) {
  await pglite.query(table);
}

// Create indexes for logs table
const indexes = [
  `CREATE INDEX idx_logs_timestamp ON logs(timestamp)`,
  `CREATE INDEX idx_logs_level ON logs(level)`,
  `CREATE INDEX idx_logs_user_id ON logs(user_id)`,
  `CREATE INDEX idx_logs_component ON logs(component)`,
];

for (const index of indexes) {
  try {
    await pglite.query(index);
  } catch (e) {
    // Ignore if index already exists
  }
}

console.log("Inserting admin user...");

// Insert admin user
await pglite.query(
  `INSERT INTO users (id, email, password_hash, display_name, is_active, created_at, updated_at)
   VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
  [ADMIN_USER.id, ADMIN_USER.email, ADMIN_USER.password_hash, ADMIN_USER.display_name, true]
);

console.log("Database rebuild complete.");
console.log(`✓ Admin user: ${ADMIN_USER.email}`);
console.log(`✓ Data directory: ${DATA_DIR}`);

process.exit(0);
