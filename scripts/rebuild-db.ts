/**
 * Rebuilds the database with the correct schema matching Kysely types.
 * Run: bun scripts/rebuild-db.ts
 */
import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";

const DATABASE_PATH = process.env.DATABASE_PATH || "./data/config.sqlite";
const dataDir = DATABASE_PATH.split("/").slice(0, -1).join("/");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const ADMIN_USER = {
  id: "1aa00cc2af0225000c5c114df3eebb69",
  email: "admin@admin.com",
  password_hash: "$2a$10$9aE.ODJU.nWyAVpLuNSnS.j2Kz5X1g27dZM6ycAb0xzUyf0/fw3bO",
  display_name: "Admin",
};

const db = new Database(DATABASE_PATH);
db.exec("PRAGMA foreign_keys = OFF");
db.exec("PRAGMA journal_mode = WAL");

console.log("Rebuilding database:", DATABASE_PATH);

db.exec(`
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS resource_permissions;
DROP TABLE IF EXISTS job_executions;
DROP TABLE IF EXISTS job_definitions;
DROP TABLE IF EXISTS dashboard_widgets;
DROP TABLE IF EXISTS dashboard_layouts;
DROP TABLE IF EXISTS chart_filters;
DROP TABLE IF EXISTS chart_definitions;
DROP TABLE IF EXISTS report_filters;
DROP TABLE IF EXISTS report_definitions;
DROP TABLE IF EXISTS filter_definitions;
DROP TABLE IF EXISTS saved_queries;
DROP TABLE IF EXISTS ds_entity_permissions;
DROP TABLE IF EXISTS data_source_entity_permissions;
DROP TABLE IF EXISTS ds_user_roles;
DROP TABLE IF EXISTS ds_roles;
DROP TABLE IF EXISTS data_sources;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS email_templates;
DROP TABLE IF EXISTS nl_query_history;
DROP TABLE IF EXISTS error_messages;
DROP TABLE IF EXISTS metadata_entity_fields;
DROP TABLE IF EXISTS metadata_entity_registry;
DROP TABLE IF EXISTS data_source_filters;
DROP TABLE IF EXISTS filters;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS charts;
DROP TABLE IF EXISTS dashboards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS _migrations;
`);

db.exec(`
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE roles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_roles (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);
CREATE TABLE data_sources (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  client_type TEXT NOT NULL,
  connection_config TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  is_editable BOOLEAN DEFAULT 0,
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE saved_queries (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
  sql_content TEXT NOT NULL,
  parameters_schema TEXT,
  is_validated BOOLEAN DEFAULT 0,
  validation_result TEXT,
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE report_definitions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  saved_query_id TEXT REFERENCES saved_queries(id) ON DELETE SET NULL,
  column_config TEXT NOT NULL DEFAULT '[]',
  filter_config TEXT,
  sort_config TEXT,
  pagination_config TEXT,
  export_formats TEXT DEFAULT '["csv","xlsx","pdf"]',
  color_theme TEXT,
  is_public BOOLEAN DEFAULT 0,
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE chart_definitions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  saved_query_id TEXT REFERENCES saved_queries(id) ON DELETE SET NULL,
  chart_type TEXT NOT NULL DEFAULT 'bar',
  chart_config TEXT NOT NULL DEFAULT '{}',
  data_mapping TEXT NOT NULL DEFAULT '{}',
  refresh_interval INTEGER,
  color_theme TEXT,
  is_public BOOLEAN DEFAULT 0,
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE dashboard_layouts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  layout_config TEXT NOT NULL DEFAULT '[]',
  theme_config TEXT,
  refresh_config TEXT,
  is_public BOOLEAN DEFAULT 0,
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE dashboard_widgets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  dashboard_id TEXT NOT NULL REFERENCES dashboard_layouts(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  report_id TEXT REFERENCES report_definitions(id) ON DELETE SET NULL,
  chart_id TEXT REFERENCES chart_definitions(id) ON DELETE SET NULL,
  position_config TEXT NOT NULL DEFAULT '{}',
  widget_config TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE job_definitions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  job_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  schedule_cron TEXT,
  parameters TEXT,
  notification_config TEXT,
  is_active BOOLEAN DEFAULT 1,
  is_deleted BOOLEAN DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE job_executions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  job_definition_id TEXT REFERENCES job_definitions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TEXT,
  completed_at TEXT,
  result_location TEXT,
  error_message TEXT,
  execution_metadata TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE resource_permissions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(resource_type, resource_id, role_id)
);
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE filter_definitions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
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
);
CREATE TABLE report_filters (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  report_id TEXT NOT NULL REFERENCES report_definitions(id) ON DELETE CASCADE,
  filter_id TEXT NOT NULL REFERENCES filter_definitions(id) ON DELETE CASCADE,
  target_column TEXT NOT NULL,
  filter_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE chart_filters (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  chart_id TEXT NOT NULL REFERENCES chart_definitions(id) ON DELETE CASCADE,
  filter_id TEXT NOT NULL REFERENCES filter_definitions(id) ON DELETE CASCADE,
  target_column TEXT NOT NULL,
  filter_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE email_templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ds_roles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  data_source_id TEXT NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ds_user_roles (
  data_source_id TEXT NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ds_role_id TEXT NOT NULL REFERENCES ds_roles(id) ON DELETE CASCADE,
  assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (data_source_id, user_id, ds_role_id)
);
CREATE TABLE ds_entity_permissions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  data_source_id TEXT NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  ds_role_id TEXT NOT NULL REFERENCES ds_roles(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'table',
  entity_schema TEXT,
  permission_level TEXT NOT NULL DEFAULT 'read',
  column_restrictions TEXT,
  row_filter TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_data_sources_active ON data_sources(is_deleted);
CREATE INDEX idx_saved_queries_data_source ON saved_queries(data_source_id);
CREATE INDEX idx_report_definitions_query ON report_definitions(saved_query_id);
CREATE INDEX idx_chart_definitions_query ON chart_definitions(saved_query_id);
CREATE INDEX idx_dashboard_widgets_dashboard ON dashboard_widgets(dashboard_id);
CREATE INDEX idx_job_executions_definition ON job_executions(job_definition_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
`);

console.log("Created new tables.");

db.prepare(
  "INSERT INTO users (id, email, password_hash, display_name, is_active) VALUES (?, ?, ?, ?, 1)"
).run(ADMIN_USER.id, ADMIN_USER.email, ADMIN_USER.password_hash, ADMIN_USER.display_name);

const roleId = "admin-role-id-fixed";
db.prepare(
  "INSERT INTO roles (id, name, description, permissions) VALUES (?, 'admin', 'System administrator', '[\"*\"]')"
).run(roleId);

db.prepare("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)").run(ADMIN_USER.id, roleId);

console.log("Seeded admin user:", ADMIN_USER.email);

db.exec("PRAGMA foreign_keys = ON");
db.close();

console.log("Database rebuild complete.");
