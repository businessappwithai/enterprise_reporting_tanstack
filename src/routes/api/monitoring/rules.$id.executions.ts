import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { requireAuth } from "@/lib/auth/middleware";
import { getDb } from "@/lib/db/config";

function parseJsonColumn<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  if (typeof raw !== "string") return raw as unknown as T;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export const APIRoute = createAPIFileRoute("/api/monitoring/rules/$id/executions")({
  GET: async ({ request, params }) => {
    try {
      const session = await requireAuth();
      const { id } = params as { id: string };
      const url = new URL(request.url);
      const page = Math.max(0, parseInt(url.searchParams.get("page") ?? "0", 10));
      const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20", 10)));

      const db = getDb();
      const isAdmin = session.user.roles.some((r) => r.toLowerCase() === "admin");

      // Verify rule ownership
      const rule = await (db as any)
        .selectFrom("monitoring_rules")
        .where("id", "=", id)
        .select(["id", "created_by"])
        .executeTakeFirst() as { id: string; created_by: string } | undefined;

      if (!rule) return json({ error: "Not found" }, { status: 404 });
      if (!isAdmin && rule.created_by !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });

      const totalRow = await (db as any)
        .selectFrom("monitoring_executions")
        .where("monitoring_rule_id", "=", id)
        .select((db as any).fn.count("id").as("count"))
        .executeTakeFirst() as { count: number } | undefined;

      const total = Number(totalRow?.count ?? 0);

      const executions = await (db as any)
        .selectFrom("monitoring_executions")
        .where("monitoring_rule_id", "=", id)
        .selectAll()
        .orderBy("executed_at", "desc")
        .limit(pageSize)
        .offset(page * pageSize)
        .execute() as Record<string, unknown>[];

      const deserialized = executions.map((e) => ({
        ...e,
        alert_channels_used: parseJsonColumn<string[]>(e.alert_channels_used, []),
        alert_recipients_sent: parseJsonColumn<string[]>(e.alert_recipients_sent, []),
        alert_dispatched: Boolean(e.alert_dispatched),
        metric_value: e.metric_value != null ? Number(e.metric_value) : null,
        previous_metric_value: e.previous_metric_value != null ? Number(e.previous_metric_value) : null,
        delta_pct: e.delta_pct != null ? Number(e.delta_pct) : null,
      }));

      return json({ executions: deserialized, total, page, pageSize });
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
    }
  },
});
