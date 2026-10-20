/**
 * What `POST /api/jobs` accepts, and what a job's target is.
 *
 * One vocabulary. The schema documents `report | chart | export`; the assistant actions invented
 * `report_export`, `email_delivery`, `report:generate` and `email:batch`, none of which the route
 * accepted, so no job was ever created from the UI. Only the types that have a worker are valid:
 * `chart` is typed but nothing renders a chart job, and a definition that can never run is the
 * bug, not a feature.
 */

import { z } from "zod";
import { getDb } from "@/lib/db/config";
import { isValidCron } from "./cron";

export const JOB_TYPES = ["report", "export"] as const;
export type RunnableJobType = (typeof JOB_TYPES)[number];

export const JOB_FORMATS = ["csv", "xlsx", "pdf"] as const;

export const createJobSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(255),
  job_type: z.enum(JOB_TYPES),
  target_id: z.string().trim().min(1, "target_id is required").max(255),
  schedule_cron: z
    .string()
    .trim()
    .refine(isValidCron, "schedule_cron must be five cron fields (minute hour day month weekday), in UTC")
    .nullish(),
  parameters: z.object({ format: z.enum(JOB_FORMATS).default("csv") }).passthrough().default({}),
  notification_config: z.record(z.unknown()).nullish(),
  is_active: z.boolean().default(true),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;

export interface JobTarget {
  /** The report or saved query's name. */
  name: string;
  /** The SQL the job will run, and where. */
  sql_content: string;
  data_source_id: string;
}

/** The report or saved query a job points at, with the SQL it resolves to; null if it is gone. */
export async function resolveJobTarget(
  jobType: RunnableJobType,
  targetId: string
): Promise<JobTarget | null> {
  const db = getDb();
  if (jobType === "export") {
    const query = await db
      .selectFrom("saved_queries")
      .select(["name", "sql_content", "data_source_id"])
      .where("id", "=", targetId)
      .where((eb) => eb.or([eb("is_deleted", "is", null), eb("is_deleted", "=", false)]))
      .executeTakeFirst();
    return query ?? null;
  }

  const report = await db
    .selectFrom("report_definitions as r")
    .innerJoin("saved_queries as q", "q.id", "r.saved_query_id")
    .select(["r.name as name", "q.sql_content as sql_content", "q.data_source_id as data_source_id"])
    .where("r.id", "=", targetId)
    .executeTakeFirst();
  return report ?? null;
}
