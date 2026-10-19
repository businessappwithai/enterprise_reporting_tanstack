import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb } from "../config";
import { BCRYPT_COST } from "@/lib/auth/bcrypt-cost";

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

async function upsertRole(
  db: ReturnType<typeof getDb>,
  name: string,
  description: string,
  permissions: string,
  now: string
): Promise<string> {
  const existing = await db
    .selectFrom("roles")
    .select("id")
    .where("name", "=", name)
    .executeTakeFirst();

  if (existing) {
    await db
      .updateTable("roles")
      .set({ description, permissions, created_at: now })
      .where("id", "=", existing.id)
      .execute();
    return existing.id;
  }

  const id = randomUUID();
  await db
    .insertInto("roles")
    .values({ id, name, description, permissions, created_at: now })
    .execute();
  return id;
}

async function upsertUser(
  db: ReturnType<typeof getDb>,
  email: string,
  displayName: string,
  password: string,
  now: string
): Promise<string> {
  const existing = await db
    .selectFrom("users")
    .select("id")
    .where("email", "=", email)
    .executeTakeFirst();

  if (existing) {
    // Update display name and ensure active — never overwrite password so
    // manual changes are preserved.
    await db
      .updateTable("users")
      .set({ display_name: displayName, is_active: true, updated_at: now })
      .where("id", "=", existing.id)
      .execute();
    return existing.id;
  }

  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  await db
    .insertInto("users")
    .values({
      id,
      email,
      password_hash: passwordHash,
      display_name: displayName,
      avatar_url: null,
      is_active: true,
      created_at: now,
      updated_at: now,
    })
    .execute();
  return id;
}

async function assignRoleIfMissing(
  db: ReturnType<typeof getDb>,
  userId: string,
  roleId: string,
  now: string
): Promise<void> {
  const existing = await db
    .selectFrom("user_roles")
    .select("user_id")
    .where("user_id", "=", userId)
    .where("role_id", "=", roleId)
    .executeTakeFirst();

  if (!existing) {
    await db
      .insertInto("user_roles")
      .values({ user_id: userId, role_id: roleId, assigned_at: now })
      .execute();
  }
}

async function upsertChart(
  db: ReturnType<typeof getDb>,
  name: string,
  description: string,
  chartType: string,
  chartConfig: object,
  dataMapping: object,
  adminUserId: string,
  now: string
): Promise<string> {
  const existing = await db
    .selectFrom("chart_definitions")
    .select("id")
    .where("name", "=", name)
    .where("created_by", "=", adminUserId)
    .executeTakeFirst();

  if (existing) {
    await db
      .updateTable("chart_definitions")
      .set({
        description,
        chart_type: chartType,
        chart_config: JSON.stringify(chartConfig),
        data_mapping: JSON.stringify(dataMapping),
        updated_at: now,
      })
      .where("id", "=", existing.id)
      .execute();
    return existing.id;
  }

  const id = randomUUID();
  await db
    .insertInto("chart_definitions")
    .values({
      id,
      name,
      description,
      chart_type: chartType,
      chart_config: JSON.stringify(chartConfig),
      data_mapping: JSON.stringify(dataMapping),
      refresh_interval: null,
      is_public: false,
      created_by: adminUserId,
      created_at: now,
      updated_at: now,
    })
    .execute();
  return id;
}

async function upsertDashboard(
  db: ReturnType<typeof getDb>,
  name: string,
  description: string,
  adminUserId: string,
  now: string
): Promise<string> {
  const existing = await db
    .selectFrom("dashboard_layouts")
    .select("id")
    .where("name", "=", name)
    .where("created_by", "=", adminUserId)
    .executeTakeFirst();

  if (existing) return existing.id;

  const id = randomUUID();
  await db
    .insertInto("dashboard_layouts")
    .values({
      id,
      name,
      description,
      layout_config: JSON.stringify({
        cols: { lg: 12, md: 10, sm: 6, xs: 4 },
        rowHeight: 100,
        layouts: { lg: [] },
      }),
      is_public: false,
      created_by: adminUserId,
      created_at: now,
      updated_at: now,
    })
    .execute();
  return id;
}

export async function seed(): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();

  // ── Roles ────────────────────────────────────────────────────────────────
  const adminRoleId = await upsertRole(db, "Admin", "Full system access", ADMIN_PERMISSIONS, now);
  const analystRoleId = await upsertRole(
    db,
    "Analyst",
    "Can create and execute reports, charts, and queries",
    JSON.stringify([
      "data_source:view",
      "query:*",
      "report:*",
      "chart:*",
      "dashboard:view",
      "dashboard:edit",
      "job:execute",
      "job:view",
    ]),
    now
  );
  await upsertRole(
    db,
    "Viewer",
    "View-only access to reports and dashboards",
    JSON.stringify([
      "data_source:view",
      "query:view",
      "report:view",
      "report:export",
      "chart:view",
      "dashboard:view",
    ]),
    now
  );

  // ── Users ────────────────────────────────────────────────────────────────
  const adminUserId = await upsertUser(db, "admin@admin.com", "System Administrator", "admin", now);
  await assignRoleIfMissing(db, adminUserId, adminRoleId, now);

  const analystUserId = await upsertUser(
    db,
    "analyst@example.com",
    "Demo Analyst",
    "analyst123",
    now
  );
  await assignRoleIfMissing(db, analystUserId, analystRoleId, now);

  // ── No demo data source ──────────────────────────────────
  //
  // This used to register "Sakila Demo DB" as a sqlite3 data source with three saved queries
  // written in SQLite (strftime). SQLite data sources are not supported — connection-manager
  // refuses them — so every fresh installation got a data source that is offered in every
  // dropdown and fails whenever it is chosen, and three queries that cannot run. Register a
  // PostgreSQL, MySQL or SQL Server database under Data Sources instead.

  // ── Default charts ───────────────────────────────────────────────────────
  const chartId0 = await upsertChart(
    db,
    "Top Products Bar Chart",
    "Bar chart showing top products by sales",
    "bar",
    {
      title: { text: "Top 10 Products by Sales" },
      legend: { show: true, position: "bottom" },
      tooltip: { enabled: true },
    },
    {
      xAxis: { field: "product_name", label: "Product" },
      yAxis: [{ field: "revenue", label: "Revenue" }],
    },
    adminUserId,
    now
  );
  const chartId1 = await upsertChart(
    db,
    "Regional Comparison",
    "Comparison of sales across regions",
    "bar",
    { title: { text: "Sales by Region" }, legend: { show: true } },
    { xAxis: { field: "region", label: "Region" }, yAxis: [{ field: "sales", label: "Sales" }] },
    adminUserId,
    now
  );
  const chartId2 = await upsertChart(
    db,
    "Regional Sales Distribution",
    "Distribution of sales across regions",
    "pie",
    { title: { text: "Sales Distribution" } },
    { xAxis: { field: "region", label: "Region" }, yAxis: [{ field: "sales", label: "Sales" }] },
    adminUserId,
    now
  );
  const chartId3 = await upsertChart(
    db,
    "Sales Trend",
    "Sales trend over time",
    "line",
    { title: { text: "Sales Trend Over Time" }, animation: true },
    { xAxis: { field: "month", label: "Month" }, yAxis: [{ field: "sales", label: "Sales" }] },
    adminUserId,
    now
  );

  // ── Default dashboards ───────────────────────────────────────────────────
  const dashId0 = await upsertDashboard(
    db,
    "Executive Dashboard",
    "High-level business metrics",
    adminUserId,
    now
  );
  const dashId1 = await upsertDashboard(
    db,
    "Sales Dashboard",
    "Sales metrics and KPIs",
    adminUserId,
    now
  );
  const dashId2 = await upsertDashboard(
    db,
    "Product Performance",
    "Product-level analytics",
    adminUserId,
    now
  );

  console.log("Seed completed (non-destructive — user data preserved)");
  console.log("=================================");
  console.log("ADMIN ACCOUNT:");
  console.log("Email: admin@admin.com");
  console.log("Password: the value of ADMIN_PASSWORD (at least 8 characters). If it was not set");
  console.log("when the database was first bootstrapped, a random one was printed once at that");
  console.log("point and is not stored anywhere.");
  console.log("=================================");
  console.log("Analyst user: analyst@example.com / analyst123");
  console.log("=================================");
  console.log("Sample Charts:", [chartId0, chartId1, chartId2, chartId3].join(", "));
  console.log("Sample Dashboards:", [dashId0, dashId1, dashId2].join(", "));
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
