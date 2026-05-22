/**
 * Auto-bootstrap the PGlite schema on first startup.
 * Uses CREATE TABLE IF NOT EXISTS so it is safe to run on every boot.
 * The admin user is only inserted when no users exist.
 */
import type { PGlite } from "@electric-sql/pglite";

// bcrypt hash of "admin" (10 rounds) – pre-computed to avoid runtime bcrypt dependency
const ADMIN_PASSWORD_HASH =
  "$2a$10$9aE.ODJU.nWyAVpLuNSnS.j2Kz5X1g27dZM6ycAb0xzUyf0/fw3bO";
const ADMIN_ID = "1aa00cc2af0225000c5c114df3eebb69";

// bcrypt hash of "nlquery" (10 rounds)
const NLQUERY_PASSWORD_HASH =
  "$2a$10$1UDYFHzn1PDgcNfKbTpX2O7aykAUkAL.tgWGm6aGEuXG3pnMCTH3S";
const NLQUERY_USER_ID = "nlquery0user00000000000000000000";
const NLQUERY_ROLE_ID = "nlquery0role00000000000000000000";

const SCHEMA_SQL = [
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
    is_inspected BOOLEAN DEFAULT false,
    last_inspected_at TEXT,
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
    color_theme TEXT,
    is_public BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TEXT,
    deleted_by TEXT REFERENCES users(id),
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS chart_definitions (
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
  `CREATE TABLE IF NOT EXISTS dashboard_layouts (
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
  `CREATE TABLE IF NOT EXISTS dashboard_widgets (
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
  `CREATE TABLE IF NOT EXISTS filter_definitions (
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
  `CREATE TABLE IF NOT EXISTS report_filters (
    id TEXT PRIMARY KEY,
    report_id TEXT REFERENCES report_definitions(id) ON DELETE CASCADE,
    filter_id TEXT REFERENCES filter_definitions(id) ON DELETE CASCADE,
    target_column TEXT NOT NULL,
    filter_order INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS chart_filters (
    id TEXT PRIMARY KEY,
    chart_id TEXT REFERENCES chart_definitions(id) ON DELETE CASCADE,
    filter_id TEXT REFERENCES filter_definitions(id) ON DELETE CASCADE,
    target_column TEXT NOT NULL,
    filter_order INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS job_definitions (
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
  `CREATE TABLE IF NOT EXISTS job_executions (
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
  `CREATE TABLE IF NOT EXISTS audit_log (
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
  `CREATE TABLE IF NOT EXISTS email_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS resource_permissions (
    id TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
    permission_level TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    component TEXT NOT NULL,
    user_id TEXT REFERENCES users(id),
    session_id TEXT,
    metadata TEXT,
    error_stack TEXT,
    request_id TEXT,
    message_vector TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS ds_roles (
    id TEXT PRIMARY KEY,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS ds_user_roles (
    data_source_id TEXT,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    ds_role_id TEXT REFERENCES ds_roles(id) ON DELETE CASCADE,
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (data_source_id, user_id, ds_role_id)
  )`,
  `CREATE TABLE IF NOT EXISTS ds_entity_permissions (
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
  `CREATE TABLE IF NOT EXISTS schema_field_instructions (
    id TEXT PRIMARY KEY,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE NOT NULL,
    table_name TEXT NOT NULL,
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL,
    is_nullable BOOLEAN DEFAULT true,
    is_primary_key BOOLEAN DEFAULT false,
    is_foreign_key BOOLEAN DEFAULT false,
    foreign_key_table TEXT,
    foreign_key_field TEXT,
    description TEXT,
    llm_instructions TEXT,
    example_values TEXT,
    constraints TEXT,
    business_meaning TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(data_source_id, table_name, field_name)
  )`,
  `CREATE TABLE IF NOT EXISTS schema_table_instructions (
    id TEXT PRIMARY KEY,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE NOT NULL,
    table_name TEXT NOT NULL,
    description TEXT,
    llm_instructions TEXT,
    example_queries TEXT,
    business_domain TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(data_source_id, table_name)
  )`,
  `CREATE TABLE IF NOT EXISTS nl_query_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    natural_language_query TEXT NOT NULL,
    generated_sql TEXT,
    parsed_entities TEXT,
    access_check_result TEXT NOT NULL DEFAULT 'pending',
    access_check_details TEXT,
    execution_result TEXT,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS nl_query_context (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id),
    role_name TEXT,
    nl_question TEXT,
    generated_sql TEXT,
    nl_question_embedding TEXT,
    schema_context TEXT,
    rbac_context TEXT,
    field_instructions TEXT,
    execution_time_ms INTEGER,
    row_count INTEGER,
    was_successful BOOLEAN,
    error_message TEXT,
    translation_confidence NUMERIC,
    llm_confidence NUMERIC,
    query_type TEXT,
    table_count INTEGER,
    join_count INTEGER,
    has_aggregation BOOLEAN,
    has_window_function BOOLEAN,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS nl_query_role_stats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    total_queries INTEGER,
    successful_queries INTEGER,
    failed_queries INTEGER,
    success_rate NUMERIC,
    avg_execution_time_ms NUMERIC,
    avg_rows_returned NUMERIC,
    avg_confidence NUMERIC,
    common_query_types TEXT,
    common_tables TEXT,
    common_joins TEXT,
    updated_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS nl_query_feedback (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    nl_query_context_id TEXT REFERENCES nl_query_context(id),
    feedback_type TEXT,
    user_feedback TEXT,
    corrected_sql TEXT,
    feedback_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS ds_schema_cache (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE,
    schema_metadata TEXT,
    sample_data TEXT,
    embedding_data TEXT,
    last_introspected_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(data_source_id)
  )`,
  `CREATE TABLE IF NOT EXISTS metadata_entity_header (
    id TEXT PRIMARY KEY,
    data_source_id TEXT REFERENCES data_sources(id) ON DELETE CASCADE NOT NULL,
    entity_name TEXT NOT NULL,
    entity_schema TEXT,
    entity_type TEXT NOT NULL DEFAULT 'table',
    schema_metadata TEXT NOT NULL,
    last_introspected_at TEXT DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT true,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(data_source_id, entity_name, entity_schema)
  )`,
  `CREATE TABLE IF NOT EXISTS metadata_entity_field (
    id TEXT PRIMARY KEY,
    entity_header_id TEXT REFERENCES metadata_entity_header(id) ON DELETE CASCADE NOT NULL,
    field_name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    is_nullable BOOLEAN,
    is_primary_key BOOLEAN DEFAULT false,
    is_foreign_key BOOLEAN DEFAULT false,
    foreign_key_table TEXT,
    foreign_key_column TEXT,
    default_value TEXT,
    description TEXT,
    is_display_field BOOLEAN DEFAULT false,
    is_searchable BOOLEAN DEFAULT true,
    display_order INTEGER,
    section_name TEXT,
    relationship_ui_type TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_header_id, field_name)
  )`,
];

const ADMIN_PERMISSIONS = JSON.stringify([
  "*:*", "admin:*",
  "data_source:read", "data_source:write", "data_source:edit", "data_source:delete",
  "data_source:view", "data_source:execute", "data_source:*",
  "query:read", "query:write", "query:edit", "query:delete", "query:view", "query:execute", "query:*",
  "report:read", "report:write", "report:edit", "report:delete", "report:view", "report:export", "report:*",
  "chart:read", "chart:write", "chart:edit", "chart:delete", "chart:view", "chart:*",
  "dashboard:read", "dashboard:write", "dashboard:edit", "dashboard:delete", "dashboard:view", "dashboard:*",
  "job:read", "job:write", "job:edit", "job:delete", "job:view", "job:execute", "job:*",
  "user:read", "user:write", "user:edit", "user:delete", "user:view", "user:*",
  "role:read", "role:write", "role:edit", "role:delete", "role:view", "role:*",
  "queue:*", "filter:*",
  "metadata:read", "metadata:write", "metadata:edit", "metadata:delete", "metadata:view", "metadata:*",
  "log:read", "log:view", "log:*",
  "notification:read", "notification:write", "notification:view", "notification:*",
  "setting:read", "setting:write", "setting:edit", "setting:view", "setting:*",
  "email_template:read", "email_template:write", "email_template:edit",
  "email_template:delete", "email_template:view", "email_template:*",
  "dataset:read", "dataset:write", "dataset:edit", "dataset:delete", "dataset:view", "dataset:*",
]);

export async function bootstrapSchema(pglite: PGlite): Promise<void> {
  // Run all CREATE TABLE IF NOT EXISTS statements
  for (const sql of SCHEMA_SQL) {
    try {
      await pglite.query(sql);
    } catch (err) {
      // Log but don't crash on individual table errors (e.g. already exists with different schema)
      console.warn("[bootstrap] table create warning:", (err as Error).message?.slice(0, 120));
    }
  }

  // Column migrations — idempotent ADD COLUMN IF NOT EXISTS for existing databases
  const columnMigrations = [
    "ALTER TABLE data_sources ADD COLUMN IF NOT EXISTS last_inspected_at TEXT",
  ];
  for (const sql of columnMigrations) {
    try {
      await pglite.query(sql);
    } catch (err) {
      console.warn("[bootstrap] column migration warning:", (err as Error).message?.slice(0, 120));
    }
  }

  // Seed admin user only if the users table is empty
  const { rows } = await pglite.query<{ count: string }>("SELECT COUNT(*) as count FROM users");
  const count = Number(rows[0]?.count ?? 0);
  if (count === 0) {
    console.log("[bootstrap] Seeding admin user...");
    const adminRoleId = "admin-role-id-000000000000000000000000";
    const now = new Date().toISOString();

    await pglite.query(
      `INSERT INTO roles (id, name, description, permissions, created_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (name) DO NOTHING`,
      [adminRoleId, "Admin", "Full system administrator", ADMIN_PERMISSIONS, now]
    );

    await pglite.query(
      `INSERT INTO users (id, email, password_hash, display_name, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [ADMIN_ID, "admin@admin.com", ADMIN_PASSWORD_HASH, "System Administrator", true, now, now]
    );

    await pglite.query(
      `INSERT INTO user_roles (user_id, role_id, assigned_at)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [ADMIN_ID, adminRoleId, now]
    );

    console.log("[bootstrap] Admin created: admin@admin.com / admin");
  }

  // Always ensure NL Query role and user exist (upsert — safe to run every boot)
  const nlQueryPermissions = JSON.stringify([
    "nl_query:*",
  ]);
  const now2 = new Date().toISOString();

  await pglite.query(
    `INSERT INTO roles (id, name, description, permissions, created_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (name) DO UPDATE SET permissions = EXCLUDED.permissions`,
    [NLQUERY_ROLE_ID, "NLQueryUser", "Access limited to natural language query only", nlQueryPermissions, now2]
  );

  await pglite.query(
    `INSERT INTO users (id, email, password_hash, display_name, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (email) DO NOTHING`,
    [NLQUERY_USER_ID, "nlquery@nlquery.com", NLQUERY_PASSWORD_HASH, "nlquery", true, now2, now2]
  );

  await pglite.query(
    `INSERT INTO user_roles (user_id, role_id, assigned_at)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [NLQUERY_USER_ID, NLQUERY_ROLE_ID, now2]
  );

  console.log("[bootstrap] NL Query user ensured: nlquery@nlquery.com / nlquery");
}
