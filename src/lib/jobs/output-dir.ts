/**
 * Where job output files are written, and the one way to turn a stored path back into a file
 * that may be served. The three job workers each declared `JOB_OUTPUT_PATH || "./job-outputs"`
 * on their own; the download route needs the same answer, and a path read back out of a database
 * column must never be allowed to point anywhere else.
 */

import path from "node:path";

export const JOB_OUTPUT_DIR = process.env.JOB_OUTPUT_PATH || "./job-outputs";

/**
 * The absolute path of `stored` if it lies inside the output directory, otherwise null.
 * `job_executions.result_location` is an ordinary text column, so it is checked, not trusted.
 */
export function resolveOutputFile(stored: string, outputDir: string = JOB_OUTPUT_DIR): string | null {
  const root = path.resolve(outputDir);
  const file = path.resolve(stored);
  return file !== root && file.startsWith(root + path.sep) ? file : null;
}

const MIME: Record<string, string> = {
  ".csv": "text/csv; charset=utf-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pdf": "application/pdf",
};

export function contentTypeFor(file: string): string {
  return MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}
