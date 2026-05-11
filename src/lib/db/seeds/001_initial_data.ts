import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { encrypt } from "../../security/encryption";
import { getDb } from "../config";

export async function seed(): Promise<void> {
  const db = getDb();

  // Clear existing data
  await db.deleteFrom("audit_log").execute();
  await db.deleteFrom("resource_permissions").execute();
  await db.deleteFrom("job_definitions").execute();
  await db.deleteFrom("dashboard_widgets").execute();
  await db.deleteFrom("dashboard_layouts").execute();
  await db.deleteFrom("chart_definitions").execute();
  await db.deleteFrom("report_definitions").execute();
  await db.deleteFrom("saved_queries").execute();
  await db.deleteFrom("data_sources").execute();
  await db.deleteFrom("user_roles").execute();
  await db.deleteFrom("roles").execute();
  await db.deleteFrom("users").execute();

  const now = new Date().toISOString();

  // Create roles
  const adminRoleId = uuidv4();
  const analystRoleId = uuidv4();
  const viewerRoleId = uuidv4();

  await db.insertInto("roles").values([
    {
      id: adminRoleId,
      name: "Admin",
      description: "Full system access",
      permissions: JSON.stringify([
        "admin:*",
        "data_source:*",
        "query:*",
        "report:*",
        "chart:*",
        "dashboard:*",
        "job:*",
        "user:*",
      ]),
      created_at: now,
    },
    {
      id: analystRoleId,
      name: "Analyst",
      description: "Can create and execute reports, charts, and queries",
      permissions: JSON.stringify([
        "data_source:view",
        "query:*",
        "report:*",
        "chart:*",
        "dashboard:view",
        "dashboard:edit",
        "job:execute",
        "job:view",
      ]),
      created_at: now,
    },
    {
      id: viewerRoleId,
      name: "Viewer",
      description: "View-only access to reports and dashboards",
      permissions: JSON.stringify([
        "data_source:view",
        "query:view",
        "report:view",
        "report:export",
        "chart:view",
        "dashboard:view",
      ]),
      created_at: now,
    },
  ]).execute();

  // Create admin user
  const adminUserId = uuidv4();
  const passwordHash = await bcrypt.hash("admin", 10);

  await db.insertInto("users").values({
    id: adminUserId,
    email: "admin@admin.com",
    password_hash: passwordHash,
    display_name: "System Administrator",
    avatar_url: null,
    is_active: true,
    created_at: now,
    updated_at: now,
  }).execute();

  await db.insertInto("user_roles").values({
    user_id: adminUserId,
    role_id: adminRoleId,
    assigned_at: now,
  }).execute();

  // Create demo analyst user
  const analystUserId = uuidv4();
  const analystPasswordHash = await bcrypt.hash("analyst123", 10);

  await db.insertInto("users").values({
    id: analystUserId,
    email: "analyst@example.com",
    password_hash: analystPasswordHash,
    display_name: "Demo Analyst",
    avatar_url: null,
    is_active: true,
    created_at: now,
    updated_at: now,
  }).execute();

  await db.insertInto("user_roles").values({
    user_id: analystUserId,
    role_id: analystRoleId,
    assigned_at: now,
  }).execute();

  // Create demo data source
  const dataSourceId = uuidv4();
  await db.insertInto("data_sources").values({
    id: dataSourceId,
    name: "Sakila Demo DB",
    description: "Sample Sakila database for testing",
    client_type: "sqlite3",
    connection_config: encrypt(JSON.stringify({ filename: "./data/uploads/sakila.db" })),
    is_active: true,
    is_editable: false,
    is_deleted: false,
    deleted_at: null,
    deleted_by: null,
    created_by: adminUserId,
    created_at: now,
    updated_at: now,
  }).execute();

  // Create default saved queries
  await db.insertInto("saved_queries").values([
    {
      id: uuidv4(),
      name: "Top 10 Actors by Film Count",
      description: "Shows the top 10 actors who have appeared in the most films",
      data_source_id: dataSourceId,
      sql_content:
        "SELECT\n  a.first_name,\n  a.last_name,\n  COUNT(fa.film_id) as film_count\nFROM actor a\nJOIN film_actor fa ON a.actor_id = fa.actor_id\nGROUP BY a.actor_id, a.first_name, a.last_name\nORDER BY film_count DESC\nLIMIT 10;",
      parameters_schema: null,
      is_validated: false,
      validation_result: null,
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
      created_by: adminUserId,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: "Monthly Revenue Summary",
      description: "Total revenue grouped by month and year",
      data_source_id: dataSourceId,
      sql_content:
        "SELECT\n  strftime('%Y-%m', p.payment_date) as month,\n  SUM(p.amount) as total_revenue,\n  COUNT(p.payment_id) as payment_count\nFROM payment p\nGROUP BY month\nORDER BY month DESC\nLIMIT 24;",
      parameters_schema: null,
      is_validated: false,
      validation_result: null,
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
      created_by: adminUserId,
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      name: "Film Inventory by Category",
      description: "Number of films in each category",
      data_source_id: dataSourceId,
      sql_content:
        "SELECT\n  c.name as category,\n  COUNT(fc.film_id) as film_count\nFROM category c\nJOIN film_category fc ON c.category_id = fc.category_id\nGROUP BY c.category_id, c.name\nORDER BY film_count DESC;",
      parameters_schema: null,
      is_validated: false,
      validation_result: null,
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
      created_by: adminUserId,
      created_at: now,
      updated_at: now,
    },
  ]).execute();

  console.log("Seed data created successfully");
  console.log("=================================");
  console.log("DEFAULT ADMIN CREDENTIALS:");
  console.log("Email: admin@admin.com");
  console.log("Password: admin");
  console.log("=================================");
  console.log("Analyst user: analyst@example.com / analyst123");
}

// Run if executed directly
if (import.meta.main) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
