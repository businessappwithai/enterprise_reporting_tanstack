/**
 * Kysely Database Configuration with PGLite
 * Type-safe SQL query builder using Kysely (https://kysely.dev/)
 * Uses PGLite for in-process PostgreSQL
 */

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { PGlite } from "@electric-sql/pglite";

// Database schema type definition
// This is the most important part - defines all tables and their columns
// Column names match the actual SQLite schema created by migrations.
export interface Database {
  users: UsersTable;
  roles: RolesTable;
  user_roles: UserRolesTable;
  data_sources: DataSourcesTable;
  saved_queries: SavedQueriesTable;
  report_definitions: ReportDefinitionsTable;
  chart_definitions: ChartDefinitionsTable;
  dashboard_layouts: DashboardLayoutsTable;
  dashboard_widgets: DashboardWidgetsTable;
  job_definitions: JobDefinitionsTable;
  job_executions: JobExecutionsTable;
  audit_log: AuditLogTable;
  email_templates: EmailTemplatesTable;
  resource_permissions: ResourcePermissionsTable;
  filter_definitions: FilterDefinitionsTable;
  report_filters: ReportFiltersTable;
  chart_filters: ChartFiltersTable;
  ds_roles: DsRolesTable;
  ds_user_roles: DsUserRolesTable;
  ds_entity_permissions: DsEntityPermissionsTable;
}

// Table type definitions — column names match actual DB schema from migrations

export interface UsersTable {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolesTable {
  id: string;
  name: string;
  description: string | null;
  permissions: string; // JSON array
  created_at: string;
}

export interface UserRolesTable {
  user_id: string;
  role_id: string;
  assigned_at: string;
}

export interface DataSourcesTable {
  id: string;
  name: string;
  description: string | null;
  client_type: string;
  connection_config: string; // Encrypted JSON
  is_active: boolean;
  is_editable: boolean | null;
  is_deleted: boolean | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedQueriesTable {
  id: string;
  name: string;
  description: string | null;
  data_source_id: string;
  sql_content: string;
  parameters_schema: string | null; // JSON Schema
  is_validated: boolean;
  validation_result: string | null; // JSON
  is_deleted: boolean | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportDefinitionsTable {
  id: string;
  name: string;
  description: string | null;
  saved_query_id: string | null;
  column_config: string; // JSON
  filter_config: string | null; // JSON
  sort_config: string | null; // JSON
  pagination_config: string | null; // JSON
  export_formats: string; // JSON array, default '["csv","xlsx","pdf"]'
  color_theme: string | null; // JSON
  is_public: boolean | null;
  is_deleted: boolean | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChartDefinitionsTable {
  id: string;
  name: string;
  description: string | null;
  saved_query_id: string | null;
  chart_type: string; // 'bar', 'line', 'area', 'pie', 'scatter', 'composed'
  chart_config: string; // JSON
  data_mapping: string; // JSON
  refresh_interval: number | null; // seconds
  color_theme: string | null; // JSON
  is_public: boolean | null;
  is_deleted: boolean | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardLayoutsTable {
  id: string;
  name: string;
  description: string | null;
  layout_config: string; // JSON
  theme_config: string | null; // JSON
  refresh_config: string | null; // JSON
  is_public: boolean;
  is_deleted: boolean | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardWidgetsTable {
  id: string;
  dashboard_id: string;
  widget_type: string; // 'report', 'chart', 'metric', 'text'
  report_id: string | null;
  chart_id: string | null;
  position_config: string; // JSON
  widget_config: string | null; // JSON
  created_at: string;
  updated_at: string;
}

export interface JobDefinitionsTable {
  id: string;
  name: string;
  job_type: string; // 'report', 'chart', 'export'
  target_id: string;
  schedule_cron: string | null;
  parameters: string | null; // JSON
  notification_config: string | null; // JSON
  is_active: boolean;
  is_deleted: boolean | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Alias used by legacy routes/code that reference 'jobs' table directly
export interface JobsTable {
  id: string;
  name: string;
  description: string | null;
  query_id: string | null;
  report_id: string | null;
  schedule: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobExecutionsTable {
  id: string;
  job_definition_id: string;
  status: string; // 'pending', 'running', 'completed', 'failed', 'cancelled'
  started_at: string | null;
  completed_at: string | null;
  result_location: string | null;
  error_message: string | null;
  execution_metadata: string | null; // JSON
  created_at: string;
}

export interface AuditLogTable {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: string | null; // JSON
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface EmailTemplatesTable {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface ResourcePermissionsTable {
  id: string;
  resource_type: string;
  resource_id: string;
  role_id: string;
  permission_level: string;
  created_at: string;
}

export interface FilterDefinitionsTable {
  id: string;
  name: string;
  description: string | null;
  data_source_id: string;
  filter_query: string;
  display_field: string;
  value_field: string;
  field_type: string | null;
  operator: string | null;
  date_validation_config: string | null; // JSON
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportFiltersTable {
  id: string;
  report_id: string;
  filter_id: string;
  target_column: string;
  filter_order: number;
  created_at: string;
}

export interface ChartFiltersTable {
  id: string;
  chart_id: string;
  filter_id: string;
  target_column: string;
  filter_order: number;
  created_at: string;
}

export interface DsRolesTable {
  id: string;
  data_source_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DsUserRolesTable {
  data_source_id: string;
  user_id: string;
  ds_role_id: string;
  assigned_at: string;
}

export interface DsEntityPermissionsTable {
  id: string;
  data_source_id: string;
  ds_role_id: string;
  entity_name: string;
  entity_type: string;
  entity_schema: string | null;
  permission_level: string;
  column_restrictions: string | null; // JSON
  row_filter: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Database instance type
export type KyselyDB = Kysely<Database>;

let db: KyselyDB | null = null;
let pglite: PGlite | null = null;

const DATABASE_URL = process.env.DATABASE_URL || "";
const DATA_DIR = process.env.DATA_DIR || "./data";

/**
 * Initialize PGLite database (async)
 */
async function initPGlite(): Promise<PGlite> {
  if (!pglite) {
    pglite = new PGlite(DATA_DIR);
    await pglite.waitReady;
  }
  return pglite;
}

/**
 * Get or create Kysely database instance
 */
export function getDb(): KyselyDB {
  if (!db) {
    if (DATABASE_URL) {
      // PostgreSQL remote
      const pool = new Pool({ connectionString: DATABASE_URL });
      db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
      });
    } else {
      // PGLite (in-process PostgreSQL)
      // Use a pool-like interface
      class PGlitePool {
        async connect() {
          const pg = await initPGlite();
          return {
            query: (sql: string, values?: unknown[]) => pg.query(sql, values),
            release: () => Promise.resolve(),
          };
        }
      }

      // biome-ignore lint/suspicious/noExplicitAny: PGlite pool adapter
      db = new Kysely<Database>({
        dialect: new PostgresDialect({
          pool: new PGlitePool() as any,
        }),
      });
    }
  }
  return db;
}

/**
 * Get config database (same as main for now)
 */
export function getConfigDB(): KyselyDB {
  return getDb();
}

/**
 * Close database connection
 */
export async function closeDb(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}

/**
 * Check if using PostgreSQL
 */
export function isPostgres(): boolean {
  return !!DATABASE_URL;
}
