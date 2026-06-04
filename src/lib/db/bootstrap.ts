/**
 * Auto-bootstrap the database schema on first startup.
 * Uses CREATE TABLE IF NOT EXISTS so it is safe to run on every boot.
 * The admin user is only inserted when no users exist.
 *
 * Supports both MariaDB (primary) and PostgreSQL (via DATABASE_URL).
 */

import { sql } from "kysely";
import type { Kysely } from "kysely";
import type { Database } from "./kysely-db";

// bcrypt hash of "admin" (10 rounds) – pre-computed to avoid runtime bcrypt dependency
const ADMIN_PASSWORD_HASH =
  "$2a$10$9aE.ODJU.nWyAVpLuNSnS.j2Kz5X1g27dZM6ycAb0xzUyf0/fw3bO";
const ADMIN_ID = "1aa00cc2af0225000c5c114df3eebb69";

// bcrypt hash of "nlquery" (10 rounds)
const NLQUERY_PASSWORD_HASH =
  "$2a$10$1UDYFHzn1PDgcNfKbTpX2O7aykAUkAL.tgWGm6aGEuXG3pnMCTH3S";
const NLQUERY_USER_ID = "nlquery0user00000000000000000000";
const NLQUERY_ROLE_ID = "nlquery0role00000000000000000000";

export async function bootstrapSchema(db: Kysely<Database>): Promise<void> {
  console.log("[bootstrap] Starting database schema bootstrap...");

  // Create tables with basic column definitions (without FK constraints for compatibility)
  const tables = [
    // Users table
    sql`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(500),
      is_active TINYINT(1) DEFAULT 1,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Roles table
    sql`CREATE TABLE IF NOT EXISTS roles (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      permissions TEXT NOT NULL,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // User-Role mapping
    sql`CREATE TABLE IF NOT EXISTS user_roles (
      user_id VARCHAR(255) NOT NULL,
      role_id VARCHAR(255) NOT NULL,
      assigned_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, role_id)
    )`,

    // Data sources
    sql`CREATE TABLE IF NOT EXISTS data_sources (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Saved queries
    sql`CREATE TABLE IF NOT EXISTS saved_queries (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Report definitions
    sql`CREATE TABLE IF NOT EXISTS report_definitions (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Chart definitions
    sql`CREATE TABLE IF NOT EXISTS chart_definitions (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Dashboard layouts
    sql`CREATE TABLE IF NOT EXISTS dashboard_layouts (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Dashboard widgets
    sql`CREATE TABLE IF NOT EXISTS dashboard_widgets (
      id VARCHAR(255) PRIMARY KEY,
      dashboard_id VARCHAR(255) NOT NULL,
      widget_type VARCHAR(50) NOT NULL,
      report_id VARCHAR(255),
      chart_id VARCHAR(255),
      position_config LONGTEXT NOT NULL,
      widget_config LONGTEXT,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Job definitions
    sql`CREATE TABLE IF NOT EXISTS job_definitions (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Job executions
    sql`CREATE TABLE IF NOT EXISTS job_executions (
      id VARCHAR(255) PRIMARY KEY,
      job_definition_id VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL,
      started_at VARCHAR(255),
      completed_at VARCHAR(255),
      result_location VARCHAR(500),
      error_message TEXT,
      execution_metadata LONGTEXT,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Audit log
    sql`CREATE TABLE IF NOT EXISTS audit_log (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255),
      action VARCHAR(255) NOT NULL,
      resource_type VARCHAR(100) NOT NULL,
      resource_id VARCHAR(255),
      details LONGTEXT,
      ip_address VARCHAR(45),
      user_agent VARCHAR(500),
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Logs
    sql`CREATE TABLE IF NOT EXISTS logs (
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
      message_vector LONGTEXT
    )`,

    // Email templates
    sql`CREATE TABLE IF NOT EXISTS email_templates (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      body LONGTEXT NOT NULL,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Resource permissions
    sql`CREATE TABLE IF NOT EXISTS resource_permissions (
      id VARCHAR(255) PRIMARY KEY,
      resource_type VARCHAR(100) NOT NULL,
      resource_id VARCHAR(255) NOT NULL,
      role_id VARCHAR(255) NOT NULL,
      permission_level VARCHAR(50) NOT NULL,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Filter definitions
    sql`CREATE TABLE IF NOT EXISTS filter_definitions (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Report filters
    sql`CREATE TABLE IF NOT EXISTS report_filters (
      id VARCHAR(255) PRIMARY KEY,
      report_id VARCHAR(255) NOT NULL,
      filter_id VARCHAR(255) NOT NULL,
      target_column VARCHAR(255) NOT NULL,
      filter_order INT NOT NULL,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Chart filters
    sql`CREATE TABLE IF NOT EXISTS chart_filters (
      id VARCHAR(255) PRIMARY KEY,
      chart_id VARCHAR(255) NOT NULL,
      filter_id VARCHAR(255) NOT NULL,
      target_column VARCHAR(255) NOT NULL,
      filter_order INT NOT NULL,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Data source roles
    sql`CREATE TABLE IF NOT EXISTS ds_roles (
      id VARCHAR(255) PRIMARY KEY,
      data_source_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      is_active TINYINT(1) DEFAULT 1,
      created_by VARCHAR(255),
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Data source user roles
    sql`CREATE TABLE IF NOT EXISTS ds_user_roles (
      data_source_id VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      ds_role_id VARCHAR(255) NOT NULL,
      assigned_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (data_source_id, user_id, ds_role_id)
    )`,

    // Data source entity permissions
    sql`CREATE TABLE IF NOT EXISTS ds_entity_permissions (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Schema field instructions (for NL query)
    sql`CREATE TABLE IF NOT EXISTS schema_field_instructions (
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
      updated_by VARCHAR(255)
    )`,

    // Schema table instructions (for NL query)
    sql`CREATE TABLE IF NOT EXISTS schema_table_instructions (
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
      updated_by VARCHAR(255)
    )`,

    // NL Query context
    sql`CREATE TABLE IF NOT EXISTS nl_query_context (
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
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // NL Query role stats
    sql`CREATE TABLE IF NOT EXISTS nl_query_role_stats (
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
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // NL Query feedback
    sql`CREATE TABLE IF NOT EXISTS nl_query_feedback (
      id VARCHAR(255) PRIMARY KEY,
      nl_query_context_id VARCHAR(255) NOT NULL,
      feedback_type VARCHAR(100),
      user_feedback TEXT,
      corrected_sql LONGTEXT,
      feedback_by VARCHAR(255),
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // Metadata entity header
    sql`CREATE TABLE IF NOT EXISTS metadata_entity_header (
      id VARCHAR(255) PRIMARY KEY,
      data_source_id VARCHAR(255) NOT NULL,
      entity_name VARCHAR(255) NOT NULL,
      entity_schema VARCHAR(255),
      entity_type VARCHAR(50) NOT NULL DEFAULT 'table',
      schema_metadata LONGTEXT NOT NULL,
      last_introspected_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      description LONGTEXT,
      is_active TINYINT(1) DEFAULT 0,
      is_hidden TINYINT(1) DEFAULT 1,
      created_by VARCHAR(255),
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_entity (data_source_id, entity_name, entity_schema)
    )`,

    // Metadata entity field
    sql`CREATE TABLE IF NOT EXISTS metadata_entity_field (
      id VARCHAR(255) PRIMARY KEY,
      entity_header_id VARCHAR(255) NOT NULL,
      field_name VARCHAR(255) NOT NULL,
      data_type VARCHAR(255) NOT NULL,
      is_nullable TINYINT(1),
      is_primary_key TINYINT(1) DEFAULT 0,
      is_foreign_key TINYINT(1) DEFAULT 0,
      foreign_key_table VARCHAR(255),
      foreign_key_column VARCHAR(255),
      default_value LONGTEXT,
      description LONGTEXT,
      is_display_field TINYINT(1) DEFAULT 0,
      is_searchable TINYINT(1) DEFAULT 1,
      display_order INT,
      section_name VARCHAR(255),
      relationship_ui_type VARCHAR(50),
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_field (entity_header_id, field_name)
    )`,

    // Schema cache — stores introspected schema metadata for ADK/NL-to-SQL RAG context
    sql`CREATE TABLE IF NOT EXISTS ds_schema_cache (
      id VARCHAR(255) PRIMARY KEY,
      data_source_id VARCHAR(255) NOT NULL UNIQUE,
      schema_metadata LONGTEXT NOT NULL,
      sample_data LONGTEXT,
      embedding_data LONGTEXT,
      last_introspected_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      created_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP,
      updated_at VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
    )`,

    // ADK intents — stores NL monitoring pipeline intent results
    sql`CREATE TABLE IF NOT EXISTS adk_intents (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      session_id VARCHAR(255),
      raw_nl_request LONGTEXT NOT NULL,
      request_source VARCHAR(20) DEFAULT 'text',
      intent_type VARCHAR(50) NOT NULL,
      confidence DECIMAL(4,3),
      adk_intent_json LONGTEXT NOT NULL,
      pipeline_status VARCHAR(20) DEFAULT 'pending',
      report_definition_id VARCHAR(255),
      monitoring_rule_id VARCHAR(255),
      error_message TEXT,
      classification_ms INT,
      total_pipeline_ms INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_adk_user_id (user_id),
      INDEX idx_adk_created_at (created_at)
    )`,

    // Monitoring rules — AI-generated threshold monitoring rules
    sql`CREATE TABLE IF NOT EXISTS monitoring_rules (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      report_definition_id VARCHAR(255) NOT NULL,
      job_definition_id VARCHAR(255),
      data_source_id VARCHAR(255) NOT NULL,
      created_by VARCHAR(255) NOT NULL,
      metric_column VARCHAR(255) NOT NULL,
      threshold_operator VARCHAR(20) NOT NULL,
      threshold_value DECIMAL(20,4) NOT NULL,
      threshold_upper_bound DECIMAL(20,4),
      escalation_threshold_pct DECIMAL(5,2) DEFAULT 20.0,
      cron_expression VARCHAR(100) NOT NULL,
      timezone VARCHAR(64) DEFAULT 'UTC',
      trigger_schedule_id VARCHAR(255),
      alert_channels LONGTEXT NOT NULL,
      alert_recipients LONGTEXT NOT NULL,
      webhook_url VARCHAR(500),
      notify_on_pass TINYINT(1) DEFAULT 0,
      notify_on_no_data TINYINT(1) DEFAULT 1,
      rbac_snapshot LONGTEXT NOT NULL,
      rbac_snapshot_version INT DEFAULT 1,
      is_active TINYINT(1) DEFAULT 1,
      is_paused TINYINT(1) DEFAULT 0,
      pause_reason TEXT,
      original_nl_request LONGTEXT,
      adk_intent_id VARCHAR(255),
      last_executed_at DATETIME,
      last_execution_status VARCHAR(20),
      last_metric_value DECIMAL(20,4),
      consecutive_breaches INT DEFAULT 0,
      total_executions INT DEFAULT 0,
      total_alerts_sent INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_mr_created_by (created_by),
      INDEX idx_mr_data_source_id (data_source_id),
      INDEX idx_mr_is_active (is_active)
    )`,

    // Monitoring executions — per-run execution records
    sql`CREATE TABLE IF NOT EXISTS monitoring_executions (
      id VARCHAR(255) PRIMARY KEY,
      monitoring_rule_id VARCHAR(255) NOT NULL,
      job_execution_id VARCHAR(255),
      executed_at DATETIME NOT NULL,
      execution_ms INT,
      rows_returned INT,
      sql_executed LONGTEXT,
      metric_value DECIMAL(20,4),
      previous_metric_value DECIMAL(20,4),
      delta_pct DECIMAL(8,4),
      evaluation_status VARCHAR(20) NOT NULL,
      evaluation_detail TEXT,
      alert_dispatched TINYINT(1) DEFAULT 0,
      alert_channels_used LONGTEXT,
      alert_recipients_sent LONGTEXT,
      alert_sent_at DATETIME,
      error_message TEXT,
      error_phase VARCHAR(30),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_me_rule_id (monitoring_rule_id),
      INDEX idx_me_executed_at (executed_at),
      INDEX idx_me_status (evaluation_status)
    )`,

    // Notifications — in-app notification inbox
    sql`CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      metadata LONGTEXT NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_notif_user_read (user_id, is_read, created_at)
    )`,

    // NL Report Definitions — dynamic report generation
    sql`CREATE TABLE IF NOT EXISTS nl_report_definitions (
      id VARCHAR(255) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      created_by VARCHAR(255) NOT NULL,
      data_source_id VARCHAR(255) NOT NULL,
      nl_query TEXT NOT NULL,
      generated_sql TEXT NOT NULL,
      metric_columns LONGTEXT NOT NULL,
      dimension_columns LONGTEXT NOT NULL,
      filter_config LONGTEXT NULL,
      date_range_from DATE NULL,
      date_range_to DATE NULL,
      chart_type VARCHAR(20) NOT NULL DEFAULT 'bar',
      output_formats LONGTEXT NOT NULL,
      recipient_config LONGTEXT NOT NULL,
      schedule_cron VARCHAR(100) NULL,
      schedule_timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
      schedule_enabled TINYINT(1) NOT NULL DEFAULT 0,
      rbac_snapshot LONGTEXT NOT NULL,
      rbac_snapshot_version INT DEFAULT 1,
      last_run_at DATETIME NULL,
      last_run_status VARCHAR(20) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_nlrd_created_by (created_by),
      INDEX idx_nlrd_data_source (data_source_id),
      INDEX idx_nlrd_created_at (created_at)
    )`,

    // Generated Report Artifacts — output files from report worker
    sql`CREATE TABLE IF NOT EXISTS generated_report_artifacts (
      id VARCHAR(255) NOT NULL PRIMARY KEY,
      report_definition_id VARCHAR(255) NOT NULL,
      execution_id VARCHAR(255) NOT NULL,
      created_by VARCHAR(255) NOT NULL,
      format VARCHAR(10) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      file_size_bytes BIGINT NULL,
      row_count INT NULL,
      chart_type VARCHAR(20) NULL,
      execution_ms INT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'complete',
      error_message TEXT NULL,
      triggered_by VARCHAR(20) NOT NULL DEFAULT 'manual',
      sql_executed TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_gra_definition (report_definition_id, created_at),
      INDEX idx_gra_user (created_by, created_at),
      INDEX idx_gra_execution (execution_id)
    )`,
  ];

  console.log("[bootstrap] Creating tables...");
  for (const table of tables) {
    try {
      await table.execute(db);
    } catch (err) {
      console.warn("[bootstrap] table create warning:", (err as Error).message?.slice(0, 120));
    }
  }

  // Seed admin user and role
  console.log("[bootstrap] Seeding admin user...");
  const adminRoleId = "admin-role-id";
  const ADMIN_PERMISSIONS = JSON.stringify([
    "admin:*",
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

  const now = new Date().toISOString();

  // Only seed if no users exist
  const userCount = await db
    .selectFrom("users")
    .select(db.fn.count<number>("id").as("count"))
    .executeTakeFirst();

  if (!userCount || userCount.count === 0) {
    // Insert admin role
    await db
      .insertInto("roles")
      .values({
        id: adminRoleId,
        name: "Administrator",
        description: "Full system administrator",
        permissions: ADMIN_PERMISSIONS,
        created_at: now,
      })
      .onDuplicateKeyUpdate({ permissions: ADMIN_PERMISSIONS })
      .execute()
      .catch((err) => {
        console.warn("[bootstrap] admin role insert warning:", (err as Error).message?.slice(0, 120));
      });

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
        created_at: now,
        updated_at: now,
      })
      .execute()
      .catch((err) => {
        console.warn("[bootstrap] admin user insert warning:", (err as Error).message?.slice(0, 120));
      });

    // Assign admin role to admin user
    await db
      .insertInto("user_roles")
      .values({
        user_id: ADMIN_ID,
        role_id: adminRoleId,
        assigned_at: now,
      })
      .execute()
      .catch((err) => {
        console.warn("[bootstrap] admin user_roles insert warning:", (err as Error).message?.slice(0, 120));
      });

    console.log("[bootstrap] Admin created: admin@admin.com / admin");
  }

  // Always ensure NL Query role and user exist (upsert — safe to run every boot)
  const nlQueryPermissions = JSON.stringify(["nl_query:*"]);
  const now2 = new Date().toISOString();

  await db
    .insertInto("roles")
    .values({
      id: NLQUERY_ROLE_ID,
      name: "NLQueryUser",
      description: "Access limited to natural language query only",
      permissions: nlQueryPermissions,
      created_at: now2,
    })
    .onDuplicateKeyUpdate({ permissions: nlQueryPermissions })
    .execute()
    .catch((err) => {
      console.warn("[bootstrap] nlquery role insert warning:", (err as Error).message?.slice(0, 120));
    });

  await db
    .insertInto("users")
    .values({
      id: NLQUERY_USER_ID,
      email: "nlquery@nlquery.com",
      password_hash: NLQUERY_PASSWORD_HASH,
      display_name: "nlquery",
      avatar_url: null,
      is_active: true,
      created_at: now2,
      updated_at: now2,
    })
    .execute()
    .catch((err) => {
      console.warn("[bootstrap] nlquery user insert warning:", (err as Error).message?.slice(0, 120));
    });

  await db
    .insertInto("user_roles")
    .values({
      user_id: NLQUERY_USER_ID,
      role_id: NLQUERY_ROLE_ID,
      assigned_at: now2,
    })
    .execute()
    .catch((err) => {
      console.warn("[bootstrap] nlquery user_roles insert warning:", (err as Error).message?.slice(0, 120));
    });

  console.log("[bootstrap] NL Query user ensured: nlquery@nlquery.com / nlquery");
  console.log("[bootstrap] Database bootstrap complete!");
}
