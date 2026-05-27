/**
 * Rebuilds the MariaDB database with the correct schema.
 * Drops all existing tables and recreates them fresh.
 * Run: bun scripts/rebuild-db.ts
 */

import { createPool } from "mysql2";
import { Kysely, MysqlDialect, sql } from "kysely";
import type { Database } from "@/lib/db/kysely-db";

// MariaDB connection config from environment
const MARIADB_HOST = process.env.MARIADB_HOST || "localhost";
const MARIADB_PORT = Number(process.env.MARIADB_PORT) || 3306;
const MARIADB_DATABASE = process.env.MARIADB_DATABASE || "enterprise_config";
const MARIADB_USER = process.env.MARIADB_USER || "enterprise";
const MARIADB_PASSWORD = process.env.MARIADB_PASSWORD || "";

console.log(`Connecting to MariaDB: ${MARIADB_HOST}:${MARIADB_PORT}/${MARIADB_DATABASE}`);

// Create connection pool
const pool = createPool({
  host: MARIADB_HOST,
  port: MARIADB_PORT,
  database: MARIADB_DATABASE,
  user: MARIADB_USER,
  password: MARIADB_PASSWORD,
  connectionLimit: 5,
  waitForConnections: true,
});

const db = new Kysely<Database>({
  dialect: new MysqlDialect({ pool }),
});

// bcrypt hash of "admin" (10 rounds) – pre-computed
const ADMIN_PASSWORD_HASH =
  "$2a$10$9aE.ODJU.nWyAVpLuNSnS.j2Kz5X1g27dZM6ycAb0xzUyf0/fw3bO";
const ADMIN_ID = "1aa00cc2af0225000c5c114df3eebb69";

// Tables to drop (in reverse dependency order)
const tablesToDrop = [
  "nl_query_feedback",
  "nl_query_role_stats",
  "nl_query_context",
  "schema_table_instructions",
  "schema_field_instructions",
  "chart_filters",
  "report_filters",
  "resource_permissions",
  "ds_entity_permissions",
  "ds_user_roles",
  "ds_roles",
  "dashboard_widgets",
  "dashboard_layouts",
  "chart_definitions",
  "report_definitions",
  "filter_definitions",
  "job_executions",
  "job_definitions",
  "saved_queries",
  "data_sources",
  "user_roles",
  "audit_log",
  "logs",
  "email_templates",
  "roles",
  "users",
];

async function rebuildDatabase() {
  try {
    console.log("Dropping existing tables...");

    for (const table of tablesToDrop) {
      try {
        await sql`DROP TABLE IF EXISTS ${sql.raw(table)}`.execute(db);
        console.log(`  ✓ Dropped ${table}`);
      } catch (e) {
        // Ignore errors if table doesn't exist
      }
    }

    console.log("\nCreating tables...");

    // Use raw SQL for table creation (CREATE TABLE IF NOT EXISTS)
    const createUserTable = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        is_active TINYINT(1) DEFAULT 1,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
      )
    `.execute(db);
    console.log("  ✓ Created users table");

    const createRolesTable = await sql`
      CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        permissions TEXT NOT NULL,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
      )
    `.execute(db);
    console.log("  ✓ Created roles table");

    const createUserRolesTable = await sql`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id VARCHAR(255) NOT NULL,
        role_id VARCHAR(255) NOT NULL,
        assigned_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      )
    `.execute(db);
    console.log("  ✓ Created user_roles table");

    const createDataSourcesTable = await sql`
      CREATE TABLE IF NOT EXISTS data_sources (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        client_type VARCHAR(50) NOT NULL,
        connection_config LONGTEXT NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        is_editable TINYINT(1) DEFAULT 0,
        is_inspected TINYINT(1) DEFAULT 0,
        last_inspected_at VARCHAR(255),
        is_deleted TINYINT(1) DEFAULT 0,
        deleted_at VARCHAR(255),
        deleted_by VARCHAR(255),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created data_sources table");

    const createSavedQueriesTable = await sql`
      CREATE TABLE IF NOT EXISTS saved_queries (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        data_source_id VARCHAR(255) NOT NULL,
        sql_content LONGTEXT NOT NULL,
        parameters_schema LONGTEXT,
        is_validated TINYINT(1) DEFAULT 0,
        validation_result LONGTEXT,
        is_deleted TINYINT(1) DEFAULT 0,
        deleted_at VARCHAR(255),
        deleted_by VARCHAR(255),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id) ON DELETE CASCADE,
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created saved_queries table");

    const createReportDefinitionsTable = await sql`
      CREATE TABLE IF NOT EXISTS report_definitions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        saved_query_id VARCHAR(255),
        column_config LONGTEXT NOT NULL,
        filter_config LONGTEXT,
        sort_config LONGTEXT,
        pagination_config LONGTEXT,
        export_formats LONGTEXT DEFAULT '["csv","xlsx","pdf"]',
        filename_template LONGTEXT,
        color_theme LONGTEXT,
        is_public TINYINT(1) DEFAULT 0,
        is_deleted TINYINT(1) DEFAULT 0,
        deleted_at VARCHAR(255),
        deleted_by VARCHAR(255),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (saved_query_id) REFERENCES saved_queries(id),
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created report_definitions table");

    const createChartDefinitionsTable = await sql`
      CREATE TABLE IF NOT EXISTS chart_definitions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        saved_query_id VARCHAR(255),
        chart_type VARCHAR(50) NOT NULL,
        chart_config LONGTEXT NOT NULL,
        data_mapping LONGTEXT NOT NULL,
        refresh_interval INT,
        color_theme LONGTEXT,
        is_public TINYINT(1) DEFAULT 0,
        is_deleted TINYINT(1) DEFAULT 0,
        deleted_at VARCHAR(255),
        deleted_by VARCHAR(255),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (saved_query_id) REFERENCES saved_queries(id),
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created chart_definitions table");

    const createDashboardLayoutsTable = await sql`
      CREATE TABLE IF NOT EXISTS dashboard_layouts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        layout_config LONGTEXT NOT NULL,
        theme_config LONGTEXT,
        refresh_config LONGTEXT,
        is_public TINYINT(1) DEFAULT 0,
        is_deleted TINYINT(1) DEFAULT 0,
        deleted_at VARCHAR(255),
        deleted_by VARCHAR(255),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created dashboard_layouts table");

    const createDashboardWidgetsTable = await sql`
      CREATE TABLE IF NOT EXISTS dashboard_widgets (
        id VARCHAR(255) PRIMARY KEY,
        dashboard_id VARCHAR(255) NOT NULL,
        widget_type VARCHAR(50) NOT NULL,
        report_id VARCHAR(255),
        chart_id VARCHAR(255),
        position_config LONGTEXT NOT NULL,
        widget_config LONGTEXT,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dashboard_id) REFERENCES dashboard_layouts(id) ON DELETE CASCADE
      )
    `.execute(db);
    console.log("  ✓ Created dashboard_widgets table");

    const createJobDefinitionsTable = await sql`
      CREATE TABLE IF NOT EXISTS job_definitions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        job_type VARCHAR(50) NOT NULL,
        target_id VARCHAR(255) NOT NULL,
        schedule_cron VARCHAR(255),
        parameters LONGTEXT,
        notification_config LONGTEXT,
        is_active TINYINT(1) DEFAULT 1,
        is_deleted TINYINT(1) DEFAULT 0,
        deleted_at VARCHAR(255),
        deleted_by VARCHAR(255),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (deleted_by) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created job_definitions table");

    const createJobExecutionsTable = await sql`
      CREATE TABLE IF NOT EXISTS job_executions (
        id VARCHAR(255) PRIMARY KEY,
        job_definition_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        started_at VARCHAR(255),
        completed_at VARCHAR(255),
        result_location VARCHAR(500),
        error_message TEXT,
        execution_metadata LONGTEXT,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_definition_id) REFERENCES job_definitions(id) ON DELETE CASCADE
      )
    `.execute(db);
    console.log("  ✓ Created job_executions table");

    const createAuditLogTable = await sql`
      CREATE TABLE IF NOT EXISTS audit_log (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        resource_type VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255),
        details LONGTEXT,
        ip_address VARCHAR(45),
        user_agent VARCHAR(500),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created audit_log table");

    const createLogsTable = await sql`
      CREATE TABLE IF NOT EXISTS logs (
        id VARCHAR(255) PRIMARY KEY,
        timestamp VARCHAR(255) NOT NULL,
        level VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        component VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        metadata LONGTEXT,
        error_stack LONGTEXT,
        request_id VARCHAR(255),
        message_vector LONGTEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created logs table");

    const createEmailTemplatesTable = await sql`
      CREATE TABLE IF NOT EXISTS email_templates (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        body LONGTEXT NOT NULL,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
      )
    `.execute(db);
    console.log("  ✓ Created email_templates table");

    const createResourcePermissionsTable = await sql`
      CREATE TABLE IF NOT EXISTS resource_permissions (
        id VARCHAR(255) PRIMARY KEY,
        resource_type VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255) NOT NULL,
        role_id VARCHAR(255) NOT NULL,
        permission_level VARCHAR(50) NOT NULL,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `.execute(db);
    console.log("  ✓ Created resource_permissions table");

    const createFilterDefinitionsTable = await sql`
      CREATE TABLE IF NOT EXISTS filter_definitions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        data_source_id VARCHAR(255) NOT NULL,
        filter_query TEXT NOT NULL,
        display_field VARCHAR(255) NOT NULL,
        value_field VARCHAR(255) NOT NULL,
        field_type VARCHAR(50),
        operator VARCHAR(50),
        date_validation_config LONGTEXT,
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created filter_definitions table");

    const createReportFiltersTable = await sql`
      CREATE TABLE IF NOT EXISTS report_filters (
        id VARCHAR(255) PRIMARY KEY,
        report_id VARCHAR(255) NOT NULL,
        filter_id VARCHAR(255) NOT NULL,
        target_column VARCHAR(255) NOT NULL,
        filter_order INT NOT NULL,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (report_id) REFERENCES report_definitions(id) ON DELETE CASCADE,
        FOREIGN KEY (filter_id) REFERENCES filter_definitions(id)
      )
    `.execute(db);
    console.log("  ✓ Created report_filters table");

    const createChartFiltersTable = await sql`
      CREATE TABLE IF NOT EXISTS chart_filters (
        id VARCHAR(255) PRIMARY KEY,
        chart_id VARCHAR(255) NOT NULL,
        filter_id VARCHAR(255) NOT NULL,
        target_column VARCHAR(255) NOT NULL,
        filter_order INT NOT NULL,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chart_id) REFERENCES chart_definitions(id) ON DELETE CASCADE,
        FOREIGN KEY (filter_id) REFERENCES filter_definitions(id)
      )
    `.execute(db);
    console.log("  ✓ Created chart_filters table");

    const createDsRolesTable = await sql`
      CREATE TABLE IF NOT EXISTS ds_roles (
        id VARCHAR(255) PRIMARY KEY,
        data_source_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created ds_roles table");

    const createDsUserRolesTable = await sql`
      CREATE TABLE IF NOT EXISTS ds_user_roles (
        data_source_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        ds_role_id VARCHAR(255) NOT NULL,
        assigned_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (data_source_id, user_id, ds_role_id),
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (ds_role_id) REFERENCES ds_roles(id)
      )
    `.execute(db);
    console.log("  ✓ Created ds_user_roles table");

    const createDsEntityPermissionsTable = await sql`
      CREATE TABLE IF NOT EXISTS ds_entity_permissions (
        id VARCHAR(255) PRIMARY KEY,
        data_source_id VARCHAR(255) NOT NULL,
        ds_role_id VARCHAR(255) NOT NULL,
        entity_name VARCHAR(255) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_schema VARCHAR(255),
        permission_level VARCHAR(50) NOT NULL,
        column_restrictions LONGTEXT,
        row_filter VARCHAR(500),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
        FOREIGN KEY (ds_role_id) REFERENCES ds_roles(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created ds_entity_permissions table");

    const createSchemaFieldInstructionsTable = await sql`
      CREATE TABLE IF NOT EXISTS schema_field_instructions (
        id VARCHAR(255) PRIMARY KEY,
        data_source_id VARCHAR(255) NOT NULL,
        table_name VARCHAR(255) NOT NULL,
        field_name VARCHAR(255) NOT NULL,
        field_type VARCHAR(100) NOT NULL,
        is_nullable TINYINT(1) DEFAULT 0,
        is_primary_key TINYINT(1) DEFAULT 0,
        is_foreign_key TINYINT(1) DEFAULT 0,
        foreign_key_table VARCHAR(255),
        foreign_key_field VARCHAR(255),
        description TEXT,
        llm_instructions TEXT,
        example_values LONGTEXT,
        constraints TEXT,
        business_meaning TEXT,
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        updated_by VARCHAR(255),
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (updated_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created schema_field_instructions table");

    const createSchemaTableInstructionsTable = await sql`
      CREATE TABLE IF NOT EXISTS schema_table_instructions (
        id VARCHAR(255) PRIMARY KEY,
        data_source_id VARCHAR(255) NOT NULL,
        table_name VARCHAR(255) NOT NULL,
        description TEXT,
        llm_instructions TEXT,
        example_queries LONGTEXT,
        business_domain VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        updated_by VARCHAR(255),
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (updated_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created schema_table_instructions table");

    const createNlQueryContextTable = await sql`
      CREATE TABLE IF NOT EXISTS nl_query_context (
        id VARCHAR(255) PRIMARY KEY,
        data_source_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        role_name VARCHAR(255) NOT NULL,
        nl_question TEXT NOT NULL,
        generated_sql LONGTEXT NOT NULL,
        nl_question_embedding LONGTEXT,
        schema_context LONGTEXT NOT NULL,
        rbac_context LONGTEXT NOT NULL,
        field_instructions LONGTEXT,
        execution_time_ms INT,
        row_count INT,
        was_successful TINYINT(1) NOT NULL,
        error_message TEXT,
        translation_confidence DECIMAL(5,4),
        llm_confidence DECIMAL(5,4),
        query_type VARCHAR(100),
        table_count INT,
        join_count INT,
        has_aggregation TINYINT(1),
        has_window_function TINYINT(1),
        created_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created nl_query_context table");

    const createNlQueryRoleStatsTable = await sql`
      CREATE TABLE IF NOT EXISTS nl_query_role_stats (
        id VARCHAR(255) PRIMARY KEY,
        role_name VARCHAR(255) NOT NULL,
        data_source_id VARCHAR(255) NOT NULL,
        total_queries INT,
        successful_queries INT,
        failed_queries INT,
        success_rate DECIMAL(5,4),
        avg_execution_time_ms DECIMAL(10,2),
        avg_rows_returned DECIMAL(10,2),
        avg_confidence DECIMAL(5,4),
        common_query_types LONGTEXT,
        common_tables LONGTEXT,
        common_joins LONGTEXT,
        updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_source_id) REFERENCES data_sources(id)
      )
    `.execute(db);
    console.log("  ✓ Created nl_query_role_stats table");

    const createNlQueryFeedbackTable = await sql`
      CREATE TABLE IF NOT EXISTS nl_query_feedback (
        id VARCHAR(255) PRIMARY KEY,
        nl_query_context_id VARCHAR(255) NOT NULL,
        feedback_type VARCHAR(100),
        user_feedback TEXT,
        corrected_sql LONGTEXT,
        feedback_by VARCHAR(255),
        created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (nl_query_context_id) REFERENCES nl_query_context(id),
        FOREIGN KEY (feedback_by) REFERENCES users(id)
      )
    `.execute(db);
    console.log("  ✓ Created nl_query_feedback table");

    console.log("\nSeeding initial data...");

    // Insert admin role
    const adminRoleId = "admin-role-id";
    const adminPermissions = JSON.stringify([
      "user:*",
      "role:*",
      "data_source:*",
      "report:*",
      "dashboard:*",
      "chart:*",
      "query:*",
      "job:*",
      "audit:*",
      "nl_query:*",
    ]);

    await db
      .insertInto("roles")
      .values({
        id: adminRoleId,
        name: "Administrator",
        description: "Full system administrator",
        permissions: adminPermissions,
        created_at: new Date().toISOString(),
      })
      .ignoreDuplicates()
      .execute();

    // Insert admin user
    await db
      .insertInto("users")
      .values({
        id: ADMIN_ID,
        email: "admin@admin.com",
        password_hash: ADMIN_PASSWORD_HASH,
        display_name: "System Administrator",
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .ignoreDuplicates()
      .execute();

    // Assign admin role
    await db
      .insertInto("user_roles")
      .values({
        user_id: ADMIN_ID,
        role_id: adminRoleId,
        assigned_at: new Date().toISOString(),
      })
      .ignoreDuplicates()
      .execute();

    console.log("  ✓ Admin user created: admin@admin.com / admin");

    console.log("\n✅ Database rebuild complete!");
  } catch (error) {
    console.error("❌ Database rebuild failed:", error);
    process.exit(1);
  } finally {
    // Cleanup
    await db.destroy();
    pool.end();
  }
}

rebuildDatabase();
