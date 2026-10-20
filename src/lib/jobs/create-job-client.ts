/**
 * The "create a job" assistant action, defined once.
 *
 * It lived twice - on the Jobs page and on the Trigger Board - and both copies posted a body
 * `POST /api/jobs` has always rejected (camelCase fields, no `target_id`) under job types the
 * route does not know, then reported "HTTP 400". So no job was ever created from the UI. The
 * assistant cannot know a target's id, so the action takes its *name*, resolves it through
 * `GET /api/jobs/targets`, and relays the server's own error text when something is refused.
 */

import { JOB_FORMATS, JOB_TYPES } from "./job-vocabulary";

export interface CreateJobInput {
  name: string;
  jobType: string;
  targetName: string;
  cron?: string | null;
  format?: string | null;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface ApiBody {
  success?: boolean;
  data?: { items?: Array<{ id: string; name: string }>; id?: string };
  error?: { message?: string };
}

async function readBody(res: Response): Promise<ApiBody> {
  try {
    return (await res.json()) as ApiBody;
  } catch {
    return {};
  }
}

/** Creates the job, or explains - in words the assistant can relay - why it could not. */
export async function createJobByName(
  input: CreateJobInput,
  fetchImpl: FetchLike = (url, init) => fetch(url, init)
): Promise<{ ok: boolean; message: string }> {
  const fail = (message: string) => ({ ok: false, message });

  const jobType = input.jobType.trim().toLowerCase();
  if (!(JOB_TYPES as readonly string[]).includes(jobType)) {
    return fail(
      `Job type must be "report" (run a report) or "export" (run a saved query), not "${input.jobType}".`
    );
  }

  try {
    const lookup = await fetchImpl(
      `/api/jobs/targets?type=${jobType}&search=${encodeURIComponent(input.targetName.trim())}`
    );
    const found = await readBody(lookup);
    if (!lookup.ok || !found.data?.items) {
      return fail(`Could not look up the ${jobType}: ${found.error?.message ?? `HTTP ${lookup.status}`}`);
    }

    const wanted = input.targetName.trim().toLowerCase();
    const items = found.data.items;
    const exact = items.filter((item) => item.name.trim().toLowerCase() === wanted);
    const matches = exact.length === 1 ? exact : items;
    if (matches.length === 0) {
      return fail(`There is no ${jobType === "report" ? "report" : "saved query"} matching "${input.targetName}".`);
    }
    if (matches.length > 1) {
      return fail(
        `"${input.targetName}" matches more than one ${jobType === "report" ? "report" : "saved query"}: ` +
          `${matches.map((m) => `"${m.name}"`).join(", ")}. Ask the user which one they mean.`
      );
    }
    const target = matches[0];

    const format = (input.format ?? "csv").trim().toLowerCase() || "csv";
    if (!(JOB_FORMATS as readonly string[]).includes(format)) {
      return fail(`Format must be one of: ${JOB_FORMATS.join(", ")}.`);
    }
    const cron = input.cron?.trim() || null;

    const created = await fetchImpl("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        job_type: jobType,
        target_id: target.id,
        schedule_cron: cron,
        parameters: { format },
      }),
    });
    const body = await readBody(created);
    if (!created.ok || !body.success) {
      return fail(`The job was not created: ${body.error?.message ?? `HTTP ${created.status}`}`);
    }

    return {
      ok: true,
      message:
        `Job "${input.name}" created: it will run ${jobType === "report" ? "the report" : "the query"} ` +
        `"${target.name}" as ${format.toUpperCase()}` +
        (cron ? ` on the schedule "${cron}" (UTC), as you.` : ", with no schedule, so it will not run by itself."),
    };
  } catch (error) {
    return fail(`The job was not created: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** The action's definition, shared so the two pages cannot drift apart again. */
export const CREATE_JOB_ACTION = {
  name: "createJob",
  description:
    "Create a background job that runs a report or a saved query on a schedule and saves the result " +
    "as a file. The job runs as the current user, with the access they hold when it runs. " +
    "Ask the user which report or saved query, how often, and which format if not given.",
  parameters: [
    { name: "name", type: "string" as const, description: "Job name", required: true },
    {
      name: "jobType",
      type: "string" as const,
      description: '"report" to run a report, or "export" to run a saved query',
      required: true,
    },
    {
      name: "targetName",
      type: "string" as const,
      description: "The name of the report or saved query to run",
      required: true,
    },
    {
      name: "cron",
      type: "string" as const,
      description:
        "Five-field cron schedule in UTC, e.g. '0 8 * * 1' for Mondays at 08:00 UTC. Omit for none.",
      required: false,
    },
    {
      name: "format",
      type: "string" as const,
      description: "csv (default), xlsx or pdf",
      required: false,
    },
  ],
};
