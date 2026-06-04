import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { resolveRBACContext } from "@/lib/monitoring/rbac-workflow-context";
import type { SecurityContext } from "@/lib/auth/rbac";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  if (!match?.[1]) return null;
  return verifySession(match[1]);
}

function mariadbNow(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function deserializeDefinition(row: Record<string, unknown>) {
  return {
    ...row,
    metric_columns: JSON.parse((row.metric_columns as string) || "[]"),
    dimension_columns: JSON.parse((row.dimension_columns as string) || "[]"),
    filter_config: row.filter_config ? JSON.parse(row.filter_config as string) : null,
    output_formats: JSON.parse((row.output_formats as string) || '["csv"]'),
    recipient_config: JSON.parse((row.recipient_config as string) || "[]"),
    schedule_enabled: !!(row.schedule_enabled),
  };
}

export const Route = createFileRoute("/api/report-generation/definitions")({
  server: {
    handlers: {
  GET: async ({ request }: { request: Request }) => {
    const session = await getSession(request);
    if (!session?.user) return json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20", 10)));
    const history = url.searchParams.get("history") === "true";
    const since = url.searchParams.get("since"); // e.g. "7d", "30d"
    const titleLike = url.searchParams.get("titleLike");

    let query = (db as any)
      .selectFrom("nl_report_definitions as rd")
      .leftJoin("data_sources as ds", "ds.id", "rd.data_source_id");

    // Non-admin users only see their own
    const isAdmin = (session.user as any).roles?.some((r: any) => {
      const n = (r.name || "").toLowerCase();
      return n === "admin" || n === "administrator" || n.startsWith("admin");
    });
    if (!isAdmin) {
      query = query.where("rd.created_by", "=", session.user.id);
    }

    // Date filter
    if (since) {
      const days = parseInt(since.replace("d", ""), 10);
      if (!isNaN(days) && days > 0) {
        query = query.where("rd.created_at", ">=",
          new Date(Date.now() - days * 86400000).toISOString().slice(0, 19).replace("T", " ")
        );
      }
    }

    // Title search
    if (titleLike) {
      query = query.where("rd.title", "like", `%${titleLike}%`);
    }

    // Count
    const countResult = await query
      .select((eb: any) => [eb.fn.count("rd.id").as("total")])
      .executeTakeFirst();
    const total = Number(countResult?.total ?? 0);

    // Fetch definitions with data source name
    const rows = await (db as any)
      .selectFrom("nl_report_definitions as rd")
      .leftJoin("data_sources as ds", "ds.id", "rd.data_source_id")
      .select([
        "rd.id", "rd.title", "rd.created_by", "rd.data_source_id",
        "rd.nl_query", "rd.generated_sql", "rd.metric_columns", "rd.dimension_columns",
        "rd.filter_config", "rd.date_range_from", "rd.date_range_to",
        "rd.chart_type", "rd.output_formats", "rd.recipient_config",
        "rd.schedule_cron", "rd.schedule_enabled", "rd.last_run_at", "rd.last_run_status",
        "rd.created_at", "rd.updated_at",
        "ds.name as data_source_name",
      ])
      .where(isAdmin ? (eb: any) => eb : (eb: any) => eb("rd.created_by", "=", session.user.id))
      .orderBy("rd.created_at", "desc")
      .limit(pageSize)
      .offset(page * pageSize)
      .execute();

    const definitions = rows.map(deserializeDefinition);

    // If history mode, also attach artifact counts
    if (history) {
      for (const def of definitions) {
        const artifactCount = await (db as any)
          .selectFrom("generated_report_artifacts")
          .where("report_definition_id", "=", (def as any).id)
          .select((eb: any) => [eb.fn.count("id").as("cnt")])
          .executeTakeFirst();
        (def as any).artifactCount = Number(artifactCount?.cnt ?? 0);
      }
    }

    return json({ definitions, total, page, pageSize });
  },

  POST: async ({ request }: { request: Request }) => {
    const session = await getSession(request);
    if (!session?.user) return json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // Validate required fields
    const required = ["title", "dataSourceId", "nlQuery", "generatedSQL", "outputFormats"] as const;
    for (const field of required) {
      if (!body[field]) {
        return json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const db = getDb();
    const id = crypto.randomUUID();
    const now = mariadbNow();

    // Resolve and snapshot RBAC context at creation time
    const userRoles = await (db as any)
      .selectFrom("user_roles")
      .innerJoin("roles", "roles.id", "user_roles.role_id")
      .where("user_roles.user_id", "=", session.user.id)
      .select(["roles.id as id", "roles.name as name"])
      .execute();

    const securityContext: SecurityContext = {
      userId: session.user.id,
      roles: userRoles.map((r: any) => r.name as string),
      permissions: [],
    };

    const rbacSnapshot = await resolveRBACContext(session.user.id, securityContext);

    await (db as any).insertInto("nl_report_definitions").values({
      id,
      title: body.title,
      created_by: session.user.id,
      data_source_id: body.dataSourceId,
      nl_query: body.nlQuery,
      generated_sql: body.generatedSQL,
      metric_columns: JSON.stringify(body.metricColumns ?? []),
      dimension_columns: JSON.stringify(body.dimensionColumns ?? []),
      filter_config: body.filterConfig ? JSON.stringify(body.filterConfig) : null,
      date_range_from: body.dateRangeFrom ?? null,
      date_range_to: body.dateRangeTo ?? null,
      chart_type: body.chartType ?? "bar",
      output_formats: JSON.stringify(body.outputFormats),
      recipient_config: JSON.stringify(body.recipients ?? []),
      schedule_cron: body.scheduleCron ?? null,
      schedule_timezone: body.scheduleTimezone ?? "UTC",
      schedule_enabled: body.scheduleCron ? 1 : 0,
      rbac_snapshot: JSON.stringify(rbacSnapshot),
      rbac_snapshot_version: 1,
      last_run_status: null,
      last_run_at: null,
      created_at: now,
      updated_at: now,
    }).execute();

    // If immediate run requested, trigger the worker
    if (!body.scheduleCron || body.runNow) {
      const { executeReportGeneration } = await import("@/lib/report-generation/report-generation-worker");
      const result = await executeReportGeneration({
        reportDefinitionId: id,
        triggeredBy: "manual",
      });

      return json({ definition: { id }, result }, { status: 201 });
    }

    return json({ definition: { id } }, { status: 201 });
  },
},
},
});
