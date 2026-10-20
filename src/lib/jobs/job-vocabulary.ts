/**
 * The words a job is described in. No imports, so the browser (the assistant action) and the
 * server (the route's schema) can both read them without the client bundle pulling in the database.
 */

/** The job types that have a worker. `chart` is typed elsewhere but nothing renders a chart job. */
export const JOB_TYPES = ["report", "export"] as const;
export type RunnableJobType = (typeof JOB_TYPES)[number];

export const JOB_FORMATS = ["csv", "xlsx", "pdf"] as const;
