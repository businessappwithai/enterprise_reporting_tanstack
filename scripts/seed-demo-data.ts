/**
 * Seed Demo Data for Reporting Application
 * Creates sample datasource, reports, charts, and dashboards
 */

import { PGlite } from "@electric-sql/pglite";
import { Kysely, PostgresDialect } from "kysely";
import { v4 as uuidv4 } from "uuid";

interface Database {
  data_sources: any;
  saved_queries: any;
  report_definitions: any;
  chart_definitions: any;
  dashboard_layouts: any;
  dashboard_widgets: any;
  users: any;
}

// Initialize PGLite
const pglite = new PGlite("./data");
await pglite.waitReady;

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: {
      connect: async () => ({
        query: (sql: string, values?: unknown[]) => pglite.query(sql, values),
        release: () => Promise.resolve(),
      }),
    } as any,
  }),
});

async function seedDemoData() {
  try {
    console.log("🌱 Starting demo data seed...");

    // Get or create admin user
    let adminUser = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", "admin@example.com")
      .executeTakeFirst();

    if (!adminUser) {
      console.log("Creating admin user...");
      const userId = uuidv4();
      await db
        .insertInto("users")
        .values({
          id: userId,
          email: "admin@example.com",
          password_hash: "$2b$10$dummyhash", // placeholder
          display_name: "Admin User",
          avatar_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .execute();

      adminUser = await db
        .selectFrom("users")
        .selectAll()
        .where("email", "=", "admin@example.com")
        .executeTakeFirst();
    }

    const adminId = adminUser.id;
    console.log("✓ Admin user:", adminId);

    // 1. Create Sample Data Source (PGLite-based)
    console.log("\n📦 Creating sample datasource...");
    const dataSourceId = uuidv4();

    const dsConfig = {
      host: "localhost",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: "postgres",
      ssl: false,
    };

    await db
      .insertInto("data_sources")
      .values({
        id: dataSourceId,
        name: "Enterprise Database",
        description: "Sample enterprise database with sales and operational data",
        client_type: "pg",
        connection_config: JSON.stringify(dsConfig),
        is_active: true,
        is_editable: true,
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
        created_by: adminId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .execute();

    console.log("✓ Data source created:", dataSourceId);

    // 2. Create Sample Queries
    console.log("\n🔍 Creating sample queries...");

    const queries = [
      {
        id: uuidv4(),
        name: "Sales by Region",
        sql: "SELECT region, SUM(amount) as total_sales, COUNT(*) as order_count FROM orders GROUP BY region ORDER BY total_sales DESC",
      },
      {
        id: uuidv4(),
        name: "Monthly Revenue",
        sql: "SELECT DATE_TRUNC('month', order_date) as month, SUM(amount) as revenue FROM orders GROUP BY DATE_TRUNC('month', order_date) ORDER BY month",
      },
      {
        id: uuidv4(),
        name: "Top Products",
        sql: "SELECT product_name, SUM(quantity) as total_qty, SUM(amount) as total_amount FROM orders GROUP BY product_name ORDER BY total_amount DESC LIMIT 10",
      },
      {
        id: uuidv4(),
        name: "Customer Orders",
        sql: "SELECT customer_name, COUNT(*) as order_count, SUM(amount) as total_spent FROM orders GROUP BY customer_name ORDER BY order_count DESC",
      },
    ];

    for (const query of queries) {
      await db
        .insertInto("saved_queries")
        .values({
          id: query.id,
          name: query.name,
          description: `Query: ${query.name}`,
          data_source_id: dataSourceId,
          sql_content: query.sql,
          parameters_schema: null,
          is_validated: true,
          validation_result: null,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
          created_by: adminId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .execute();
    }

    console.log(`✓ Created ${queries.length} sample queries`);

    // 3. Create Sample Reports
    console.log("\n📊 Creating sample reports...");

    const reports = [
      {
        id: uuidv4(),
        name: "Sales by Region Report",
        queryId: queries[0].id,
        columns: ["region", "total_sales", "order_count"],
      },
      {
        id: uuidv4(),
        name: "Monthly Revenue Report",
        queryId: queries[1].id,
        columns: ["month", "revenue"],
      },
      {
        id: uuidv4(),
        name: "Top 10 Products",
        queryId: queries[2].id,
        columns: ["product_name", "total_qty", "total_amount"],
      },
    ];

    for (const report of reports) {
      await db
        .insertInto("report_definitions")
        .values({
          id: report.id,
          name: report.name,
          description: `Report: ${report.name}`,
          saved_query_id: report.queryId,
          column_config: JSON.stringify(
            report.columns.map((col) => ({
              key: col,
              label: col.replace(/_/g, " ").toUpperCase(),
              visible: true,
            }))
          ),
          filter_config: null,
          sort_config: null,
          pagination_config: JSON.stringify({ pageSize: 50 }),
          export_formats: JSON.stringify(["csv", "xlsx", "pdf"]),
          color_theme: JSON.stringify({ primary: "#3b82f6", secondary: "#10b981" }),
          is_public: false,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
          created_by: adminId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .execute();
    }

    console.log(`✓ Created ${reports.length} sample reports`);

    // 4. Create Sample Charts
    console.log("\n📈 Creating sample charts...");

    const charts = [
      {
        id: uuidv4(),
        name: "Sales Trend",
        queryId: queries[1].id,
        type: "line",
        config: {
          xAxis: "month",
          yAxis: "revenue",
        },
      },
      {
        id: uuidv4(),
        name: "Regional Sales Distribution",
        queryId: queries[0].id,
        type: "pie",
        config: {
          dataKey: "region",
          valueKey: "total_sales",
        },
      },
      {
        id: uuidv4(),
        name: "Top Products Bar Chart",
        queryId: queries[2].id,
        type: "bar",
        config: {
          xAxis: "product_name",
          yAxis: "total_amount",
        },
      },
      {
        id: uuidv4(),
        name: "Regional Comparison",
        queryId: queries[0].id,
        type: "bar",
        config: {
          xAxis: "region",
          yAxis: "total_sales",
        },
      },
    ];

    for (const chart of charts) {
      await db
        .insertInto("chart_definitions")
        .values({
          id: chart.id,
          name: chart.name,
          description: `Chart: ${chart.name}`,
          saved_query_id: chart.queryId,
          chart_type: chart.type,
          chart_config: JSON.stringify(chart.config),
          data_mapping: JSON.stringify({}),
          refresh_interval: null,
          color_theme: JSON.stringify({ colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"] }),
          is_public: false,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
          created_by: adminId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .execute();
    }

    console.log(`✓ Created ${charts.length} sample charts`);

    // 5. Create Sample Dashboards
    console.log("\n🎯 Creating sample dashboards...");

    const dashboards = [
      {
        id: uuidv4(),
        name: "Executive Dashboard",
        description: "High-level view of business metrics",
        layout: {
          cols: 12,
          rowHeight: 30,
          widgets: [
            { x: 0, y: 0, w: 6, h: 4, type: "chart", id: charts[1].id }, // Regional Sales
            { x: 6, y: 0, w: 6, h: 4, type: "chart", id: charts[0].id }, // Sales Trend
            { x: 0, y: 4, w: 12, h: 4, type: "chart", id: charts[3].id }, // Regional Comparison
          ],
        },
      },
      {
        id: uuidv4(),
        name: "Sales Dashboard",
        description: "Sales team metrics and KPIs",
        layout: {
          cols: 12,
          rowHeight: 30,
          widgets: [
            { x: 0, y: 0, w: 6, h: 4, type: "report", id: reports[0].id }, // Sales by Region
            { x: 6, y: 0, w: 6, h: 4, type: "chart", id: charts[2].id }, // Top Products
            { x: 0, y: 4, w: 12, h: 4, type: "chart", id: charts[0].id }, // Sales Trend
          ],
        },
      },
      {
        id: uuidv4(),
        name: "Product Performance",
        description: "Product-focused analytics",
        layout: {
          cols: 12,
          rowHeight: 30,
          widgets: [
            { x: 0, y: 0, w: 12, h: 5, type: "report", id: reports[2].id }, // Top 10 Products
            { x: 0, y: 5, w: 12, h: 4, type: "chart", id: charts[2].id }, // Top Products Bar Chart
          ],
        },
      },
    ];

    for (const dashboard of dashboards) {
      const dashboardId = dashboard.id;

      // Create dashboard layout
      await db
        .insertInto("dashboard_layouts")
        .values({
          id: dashboardId,
          name: dashboard.name,
          description: dashboard.description,
          layout_config: JSON.stringify(dashboard.layout),
          theme_config: JSON.stringify({ mode: "light", accent: "#3b82f6" }),
          refresh_config: JSON.stringify({ interval: 300 }),
          is_public: false,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
          created_by: adminId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .execute();

      // Create widgets for this dashboard
      for (const widget of dashboard.layout.widgets) {
        const widgetId = uuidv4();

        if (widget.type === "chart") {
          const chart = charts.find((c) => c.id === widget.id);
          if (chart) {
            await db
              .insertInto("dashboard_widgets")
              .values({
                id: widgetId,
                dashboard_id: dashboardId,
                widget_type: "chart",
                chart_id: chart.id,
                report_id: null,
                position_config: JSON.stringify({
                  x: widget.x,
                  y: widget.y,
                  w: widget.w,
                  h: widget.h,
                }),
                widget_config: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .execute();
          }
        } else if (widget.type === "report") {
          const report = reports.find((r) => r.id === widget.id);
          if (report) {
            await db
              .insertInto("dashboard_widgets")
              .values({
                id: widgetId,
                dashboard_id: dashboardId,
                widget_type: "report",
                report_id: report.id,
                chart_id: null,
                position_config: JSON.stringify({
                  x: widget.x,
                  y: widget.y,
                  w: widget.w,
                  h: widget.h,
                }),
                widget_config: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .execute();
          }
        }
      }
    }

    console.log(`✓ Created ${dashboards.length} sample dashboards`);

    console.log("\n✅ Demo data seed complete!");
    console.log("\n📋 Summary:");
    console.log(`  • Data Source: 1 (Enterprise Database)`);
    console.log(`  • Queries: ${queries.length}`);
    console.log(`  • Reports: ${reports.length}`);
    console.log(`  • Charts: ${charts.length}`);
    console.log(`  • Dashboards: ${dashboards.length}`);
    console.log("\n🎯 You can now:");
    console.log("  1. Log in with admin@example.com");
    console.log("  2. Navigate to Reports, Charts, or Dashboards");
    console.log("  3. View the sample data and demo configurations");

  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
    process.exit(1);
  } finally {
    try {
      await db.destroy();
    } catch {
      // Ignore cleanup errors
    }
    process.exit(0);
  }
}

seedDemoData();
