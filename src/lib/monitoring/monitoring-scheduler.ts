/**
 * Monitoring Scheduler
 *
 * Manages Trigger.dev schedule lifecycle for monitoring rules.
 * All functions gracefully degrade when Trigger.dev is not configured (local dev).
 */

import { schedules } from "@trigger.dev/sdk/v3";
import { getDb } from "@/lib/db/config";
import type { MonitoringRule, MonitoringEvaluatePayload } from "@/types/monitoring";

// ────────────────────────────────────────────────────────────────────────────
// scheduleMonitoringRule
// ────────────────────────────────────────────────────────────────────────────

/**
 * Creates a Trigger.dev schedule for a monitoring rule.
 * Stores the returned schedule ID in monitoring_rules.trigger_schedule_id.
 * Returns null when Trigger.dev is unavailable (graceful degradation).
 */
export async function scheduleMonitoringRule(rule: MonitoringRule): Promise<string | null> {
  const payload: MonitoringEvaluatePayload = {
    ruleId: rule.id,
    userId: rule.created_by,
    triggeredBy: "schedule",
  };

  let scheduleId: string | null = null;

  try {
    const created = await schedules.create({
      task: "monitoring:evaluate",
      cron: rule.cron_expression,
      timezone: rule.timezone ?? "UTC",
      // @ts-expect-error — SDK v3 schedule payload passthrough
      payload,
      externalId: `monitoring-${rule.id}`,
    });

    scheduleId = created.id ?? null;
  } catch (err) {
    console.warn(
      `[monitoring-scheduler] schedules.create failed for rule ${rule.id} — Trigger.dev may not be configured in this environment:`,
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }

  if (scheduleId) {
    try {
      const db = getDb();
      await (db as any)
        .updateTable("monitoring_rules")
        .set({
          trigger_schedule_id: scheduleId,
          updated_at: new Date().toISOString(),
        })
        .where("id", "=", rule.id)
        .execute();
    } catch (dbErr) {
      console.error(
        `[monitoring-scheduler] Failed to persist trigger_schedule_id for rule ${rule.id}:`,
        dbErr instanceof Error ? dbErr.message : String(dbErr)
      );
      // Return the schedule ID anyway — the caller can retry persisting if needed
    }
  }

  return scheduleId;
}

// ────────────────────────────────────────────────────────────────────────────
// unscheduleMonitoringRule
// ────────────────────────────────────────────────────────────────────────────

/**
 * Deletes the Trigger.dev schedule for a rule and clears the stored schedule ID.
 * Returns false on failure (Trigger.dev unavailable or schedule already gone).
 */
export async function unscheduleMonitoringRule(
  ruleId: string,
  triggerScheduleId: string
): Promise<boolean> {
  try {
    await schedules.del(triggerScheduleId);
  } catch (err) {
    console.warn(
      `[monitoring-scheduler] schedules.del failed for schedule ${triggerScheduleId} (rule ${ruleId}):`,
      err instanceof Error ? err.message : String(err)
    );
    // Still attempt to clear the DB record so the stale reference is removed
  }

  try {
    const db = getDb();
    await (db as any)
      .updateTable("monitoring_rules")
      .set({
        trigger_schedule_id: null,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", ruleId)
      .execute();
  } catch (dbErr) {
    console.error(
      `[monitoring-scheduler] Failed to clear trigger_schedule_id for rule ${ruleId}:`,
      dbErr instanceof Error ? dbErr.message : String(dbErr)
    );
    return false;
  }

  return true;
}

// ────────────────────────────────────────────────────────────────────────────
// pauseSchedule
// ────────────────────────────────────────────────────────────────────────────

/**
 * Deactivates a Trigger.dev schedule (stops future invocations without deleting it).
 */
export async function pauseSchedule(triggerScheduleId: string): Promise<boolean> {
  try {
    await schedules.deactivate(triggerScheduleId);
    return true;
  } catch (err) {
    console.warn(
      `[monitoring-scheduler] schedules.deactivate failed for ${triggerScheduleId}:`,
      err instanceof Error ? err.message : String(err)
    );
    return false;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// resumeSchedule
// ────────────────────────────────────────────────────────────────────────────

/**
 * Reactivates a previously paused Trigger.dev schedule.
 */
export async function resumeSchedule(triggerScheduleId: string): Promise<boolean> {
  try {
    await schedules.activate(triggerScheduleId);
    return true;
  } catch (err) {
    console.warn(
      `[monitoring-scheduler] schedules.activate failed for ${triggerScheduleId}:`,
      err instanceof Error ? err.message : String(err)
    );
    return false;
  }
}
