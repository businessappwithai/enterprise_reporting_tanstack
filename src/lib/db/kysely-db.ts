/**
 * Kysely Database Configuration
 * Replaces Knex.js with Kysely for type-safe SQL queries
 */

import {
  Kysely,
  SqliteDatabase,
  PostgresDatabase,
  MigrationProvider,
  Migrator,
  FileMigrationProvider,
  NO_MIGRATIONS,
} from 'kysely'
import { BetterSqlite3Dialect } from 'kysely'
import { Pool } from 'pg'
import path from 'path'
import { promises as fs } from 'fs'

// Database schema type definition
// This is the most important part - defines all tables and their columns
export interface Database {
  users: UsersTable
  roles: RolesTable
  user_roles: UserRolesTable
  data_sources: DataSourcesTable
  saved_queries: SavedQueriesTable
  report_definitions: ReportDefinitionsTable
  chart_definitions: ChartDefinitionsTable
  dashboard_layouts: DashboardLayoutsTable
  dashboard_widgets: DashboardWidgetsTable
  job_definitions: JobDefinitionsTable
  job_executions: JobExecutionsTable
  audit_log: AuditLogTable
  email_templates: EmailTemplatesTable
  resource_permissions: ResourcePermissionsTable
  ds_roles: DsRolesTable
  ds_user_roles: DsUserRolesTable
  ds_entity_permissions: DsEntityPermissionsTable
  metadata_entities: MetadataEntitiesTable
  metadata_fields: MetadataFieldsTable
  dataset_cache: DatasetCacheTable
  role_rag_context: RoleRagContextTable
  openkb_queries: OpenKBQueriesTable
}

// Table type definitions
export interface UsersTable {
  id: string
  email: string
  password_hash: string
  display_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RolesTable {
  id: string
  name: string
  permissions: string // JSON array
  created_at: string
  updated_at: string
}

export interface UserRolesTable {
  user_id: string
  role_id: string
  assigned_at: string
}

export interface DataSourcesTable {
  id: string
  name: string
  description: string | null
  client_type: string
  connection_string: string // Encrypted
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SavedQueriesTable {
  id: string
  name: string
  description: string | null
  sql: string
  data_source_id: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ReportDefinitionsTable {
  id: string
  name: string
  description: string | null
  query_id: string
  config: string // JSON
  created_by: string
  created_at: string
  updated_at: string
}

export interface ChartDefinitionsTable {
  id: string
  name: string
  description: string | null
  config: string // JSON
  created_by: string
  created_at: string
  updated_at: string
}

export interface DashboardLayoutsTable {
  id: string
  name: string
  layout_config: string // JSON
  created_by: string
  created_at: string
  updated_at: string
}

export interface DashboardWidgetsTable {
  id: string
  dashboard_id: string
  widget_type: string
  config: string // JSON
  position: string // JSON
  created_at: string
  updated_at: string
}

export interface JobDefinitionsTable {
  id: string
  name: string
  type: string
  config: string // JSON
  schedule: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface JobExecutionsTable {
  id: string
  job_id: string
  status: string
  result: string | null
  error: string | null
  started_at: string
  completed_at: string | null
}

export interface AuditLogTable {
  id: string
  timestamp: string
  actor_id: string
  action: string
  resource_type: string
  resource_id: string
  outcome: string
  details: string | null // JSON
  ip_address: string | null
  user_agent: string | null
}

export interface EmailTemplatesTable {
  id: string
  name: string
  subject: string
  body: string
  created_at: string
  updated_at: string
}

export interface ResourcePermissionsTable {
  id: string
  resource_type: string
  resource_id: string
  role_id: string
  permission_level: string
  created_at: string
}

export interface DsRolesTable {
  id: string
  data_source_id: string
  name: string
  description: string | null
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface DsUserRolesTable {
  data_source_id: string
  user_id: string
  ds_role_id: string
  assigned_at: string
}

export interface DsEntityPermissionsTable {
  id: string
  data_source_id: string
  ds_role_id: string
  entity_name: string
  entity_type: string
  entity_schema: string | null
  permission_level: string
  column_restrictions: string | null // JSON
  row_filter: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface MetadataEntitiesTable {
  id: string
  entity_name: string
  entity_type: string
  data_source_id: string
  business_name: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface MetadataFieldsTable {
  id: string
  entity_id: string
  field_name: string
  field_type: string
  business_name: string | null
  description: string | null
  is_nullable: boolean
  created_at: string
  updated_at: string
}

export interface DatasetCacheTable {
  id: string
  name: string
  file_path: string
  file_size: number
  row_count: number
  created_at: string
  expires_at: string
}

export interface RoleRagContextTable {
  id: string
  role_id: string
  context_type: string
  entity_name: string
  definition: string
  proposed_by: string
  approved_by: string | null
  status: string
  version: number
  created_at: string
  approved_at: string | null
}

export interface OpenKBQueriesTable {
  id: string
  role_id: string
  nl_question: string
  generated_sql: string
  execution_time_ms: number
  result_row_count: number
  embedding_status: string
  created_at: string
}

// Database instance type
export type KyselyDB = Kysely<Database>

let db: KyselyDB | null = null

const DATABASE_URL = process.env.DATABASE_URL || ''
const DATABASE_PATH = process.env.DATABASE_PATH || './data/config.sqlite'

/**
 * Get or create Kysely database instance
 */
export function getDb(): KyselyDB {
  if (!db) {
    if (DATABASE_URL) {
      // PostgreSQL
      const pool = new Pool({ connectionString: DATABASE_URL })
      db = new Kysely<Database>({
        dialect: new (require('kysely').PostgresDialect)({
          pool,
        }),
      })
    } else {
      // SQLite
      const { existsSync, mkdirSync } = require('fs')
      const dirPath = require('path').dirname(DATABASE_PATH)

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }

      db = new Kysely<Database>({
        dialect: new BetterSqlite3Dialect({
          database: DATABASE_PATH,
        }),
      })

      // Enable foreign keys for SQLite
      db.executeQuery(db.schema.raw('PRAGMA foreign_keys = ON')).catch(console.error)
    }
  }
  return db
}

/**
 * Get config database (same as main for now)
 */
export function getConfigDB(): KyselyDB {
  return getDb()
}

/**
 * Close database connection
 */
export async function closeDb(): Promise<void> {
  if (db) {
    await db.destroy()
    db = null
  }
}

/**
 * Check if using PostgreSQL
 */
export function isPostgres(): boolean {
  return !!DATABASE_URL
}

/**
 * Get Migrator instance for database migrations
 */
export async function getMigrator(): Promise<Migrator> {
  const migrationsDir = path.join(process.cwd(), 'src/lib/db/migrations')

  const provider: MigrationProvider = {
    async getMigrations() {
      const migrations: Record<string, any> = {}

      try {
        const files = await fs.readdir(migrationsDir)
        const tsFiles = files.filter(f => f.endsWith('.ts'))

        for (const file of tsFiles) {
          const filePath = path.join(migrationsDir, file)
          const migration = await import(filePath)
          migrations[file] = migration.default
        }
      } catch (error) {
        console.warn('[Migrator] No migrations found or error loading:', error)
      }

      return migrations
    },
  }

  return new Migrator({
    db: getDb(),
    provider,
  })
}
