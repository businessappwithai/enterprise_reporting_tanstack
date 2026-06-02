import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { requireAuth } from "@/lib/auth/middleware";
import { getDb } from "@/lib/db/config";
import { resolveRBACContext } from "@/lib/monitoring/rbac-workflow-context";
import { scheduleMonitoringRule } from "@/lib/monitoring/monitoring-scheduler";
import { logAudit } from "@/lib/security/audit";
import { AUDIT_ACTIONS } from "@/types/actions";
import type { AlertChannel, AlertRecipient, ThresholdOperator } from "@/types/monitoring";

// ─── JSON column helpers ──────────────────────────────────────────────────────

function parseJsonColumn<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  if (typeof raw !== "string") return raw as unknown as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function deserializeRule(row: Record<string, unknown>) {
  return {
    ...row,
    alert_channels: parseJsonColumn<AlertChannel[]>(row.alert_channels, []),
    alert_recipients: parseJsonColumn<AlertRecipient[]>(row.alert_recipients, []),
    rbac_snapshot: parseJsonColumn(row.rbac_snapshot, {}),
    notify_on_pass: Boolean(row.notify_on_pass),
    notify_on_no_data: Boolean(row.notify_on_no_data),
    is_active: Boolean(row.is_active),
    is_paused: Boolean(row.is_paused),
    threshold_value: Number(row.threshold_value),
    threshold_upper_bound: row.threshold_upper_bound != null ? Number(row.threshold_upper_bound) : undefined,
    escalation_threshold_pct: Number(row.escalation_threshold_pct ?? 20),
  };
}

// ─── Route ────────────────────────────────────────────────────────────────────

export const APIRoute = createAPIFileRoute("/api/monitoring/rules")({
  GET: async ({ request }) => {
    try {
      const session = await requireAuth();
      const url = new URL(request.url);
      const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0", 10));
      const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20", 10)));
      const statusFilter = url.searchParams.get("status") ?? "active";

      const isAdmin = session.user.roles.some((r) => r.toLowerCase() === "admin");
      const db = getDb();

      let query = (db as any).selectFrom("monitoring_rules");

      if (!isAdmin) {
        query = query.where("created_by", "=", session.user.id);
      }

      if (statusFilter === "active") {
        query = query.where("is_active", "=", true).where("is_paused", "=", false);
      } else if (statusFilter === "paused") {
        query = query.where("is_paused", "=", true);
      }
      // "all" — no additional filter

      const totalRow = await query
        .select((db as any).fn.count("id").as("count"))
        .executeTakeFirst() as { count: number } | undefined;

      const total = Number(totalRow?.count ?? 0);

      const rules = await query
        .selectAll()
        .orderBy("created_at", "desc")
        .limit(pageSize)
        .offset(page * pageSize)
        .execute() as Record<string, unknown>[];

      return json({
        rules: rules.map(deserializeRule),
        total,
        page,
        pageSize,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to list monitoring rules";
      return json({ error: msg }, { status: err instanceof Error && err.message.includes("Unauthorized") ? 401 : 500 });
    }
  },

  POST: async ({ request }) => {
    try {
      const session = await requireAuth();
      const body = await request.json() as {
        name: string;
        description?: string;
        reportDefinitionId?: string;
        dataSourceId: string;
        metricColumn: string;
        thresholdOperator: ThresholdOperator;
        thresholdValue: number;
        thresholdUpperBound?: number;
        escalationThresholdPct?: number;
        cronExpression: string;
        timezone?: string;
        alertChannels: AlertChannel[];
        alertRecipients?: AlertRecipient[];
        webhookUrl?: string;
        notifyOnPass?: boolean;
        notifyOnNoData?: boolean;
        originalNlRequest?: string;
        adkIntentId?: string;
        sql?: string;
      };

      // Validate required fields
      const required = ["name", "dataSourceId", "metricColumn", "thresholdOperator", "thresholdValue", "cronExpression", "alertChannels"] as const;
      for (const field of required) {
        if (body[field] === undefined || body[field] === null || body[field] === "") {
          return json({ error: `Missing required field: ${field}` }, { status: 400 });
        }
      }

      const db = getDb();
      const userId = session.user.id;

      // Build RBAC snapshot
      const roles = session.user.roles;
      const permissions = session.user.permissions;
      const securityContext = { userId, roles, permissions };
      const rbacSnapshot = await resolveRBACContext(userId, securityContext);

      // Create saved_query + report_definition if sql provided, or use reportDefinitionId
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      let reportDefinitionId = body.reportDefinitionId;
      if (!reportDefinitionId && body.sql) {
        const queryId = crypto.randomUUID();
        reportDefinitionId = crypto.randomUUID();
        await (db as any).insertInto("saved_queries").values({
          id: queryId,
          name: `[Monitor] ${body.name}`,
          description: "Auto-generated monitoring query",
          data_source_id: body.dataSourceId,
          sql_content: body.sql,
          is_validated: true,
          created_by: userId,
          created_at: now,
          updated_at: now,
        }).execute();

        await (db as any).insertInto("report_definitions").values({
          id: reportDefinitionId,
          name: `[Monitor] ${body.name}`,
          description: body.description ?? null,
          saved_query_id: queryId,
          column_config: JSON.stringify([]),
          pagination_config: JSON.stringify({ pageSize: 10000 }),
          export_formats: JSON.stringify(["csv"]),
          created_by: userId,
          created_at: now,
          updated_at: now,
        }).execute();
      }

      if (!reportDefinitionId) {
        return json({ error: "Either reportDefinitionId or sql must be provided" }, { status: 400 });
      }

      await (db as any).insertInto("monitoring_rules").values({
        id,
        name: body.name,
        description: body.description ?? null,
        report_definition_id: reportDefinitionId,
        data_source_id: body.dataSourceId,
        created_by: userId,
        metric_column: body.metricColumn,
        threshold_operator: body.thresholdOperator,
        threshold_value: body.thresholdValue,
        threshold_upper_bound: body.thresholdUpperBound ?? null,
        escalation_threshold_pct: body.escalationThresholdPct ?? 20,
        cron_expression: body.cronExpression,
        timezone: body.timezone ?? "UTC",
        alert_channels: JSON.stringify(body.alertChannels),
        alert_recipients: JSON.stringify(body.alertRecipients ?? [{ type: "user", id: userId }]),
        webhook_url: body.webhookUrl ?? null,
        notify_on_pass: body.notifyOnPass ? 1 : 0,
        notify_on_no_data: body.notifyOnNoData !== false ? 1 : 0,
        rbac_snapshot: JSON.stringify(rbacSnapshot),
        rbac_snapshot_version: 1,
        is_active: 1,
        is_paused: 0,
        original_nl_request: body.originalNlRequest ?? null,
        adk_intent_id: body.adkIntentId ?? null,
        consecutive_breaches: 0,
        total_executions: 0,
        total_alerts_sent: 0,
        created_at: now,
        updated_at: now,
      }).execute();

      // Load the saved rule for response
      const rule = await (db as any)
        .selectFrom("monitoring_rules")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst() as Record<string, unknown>;

      // Attempt to schedule in Trigger.dev (graceful — won't fail the request)
      try {
        const scheduleId = await scheduleMonitoringRule(deserializeRule(rule) as any);
        if (scheduleId) {
          await (db as any)
            .updateTable("monitoring_rules")
            .set({ trigger_schedule_id: scheduleId })
            .where("id", "=", id)
            .execute();
          rule.trigger_schedule_id = scheduleId;
        }
      } catch (scheduleErr) {
        console.warn("[monitoring/rules POST] Trigger.dev schedule failed (non-fatal):", scheduleErr);
      }

      await logAudit({
        userId,
        action: AUDIT_ACTIONS.MONITORING.RULE_CREATED,
        resourceType: "monitoring_rule" as any,
        resourceId: id,
        details: { name: body.name, dataSourceId: body.dataSourceId },
      });

      return json({ rule: deserializeRule(rule) }, { status: 201 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create monitoring rule";
      return json({ error: msg }, { status: err instanceof Error && err.message.includes("Unauthorized") ? 401 : 500 });
    }
  },
});
