/**
 * What the browser may write into the `logs` table through `POST /api/logs`.
 *
 * The endpoint is open to every signed-in user — the client logger (`useLogger`) needs it
 * — which made it a way to put arbitrary text, of any size and at any rate, into the table
 * an administrator reads when something is wrong. So the entry is bounded, labelled and
 * rate-limited:
 *
 *   - shape and size are fixed by `clientLogSchema`;
 *   - every entry is stamped `metadata.source = "client"` so it cannot pass for a server
 *     log (`withClientSource`); the user id is the session's, never the body's;
 *   - `allowClientLog` caps one user at `CLIENT_LOG_LIMIT` entries a minute.
 */

import { z } from "zod";

export const CLIENT_LOG_LIMIT = 60;
const WINDOW_MS = 60_000;
const MAX_METADATA_BYTES = 8 * 1024;

export const clientLogSchema = z.object({
  level: z.enum(["debug", "info", "warn", "error"]),
  message: z.string().min(1).max(4000),
  component: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[\w.:/-]+$/, "component may contain letters, digits and . : / _ - only"),
  metadata: z
    .record(z.unknown())
    .optional()
    .refine((m) => m === undefined || JSON.stringify(m).length <= MAX_METADATA_BYTES, {
      message: `metadata must be at most ${MAX_METADATA_BYTES} bytes`,
    }),
  errorStack: z.string().max(16 * 1024).optional(),
});

export type ClientLog = z.infer<typeof clientLogSchema>;

/** The metadata to store: the caller's, plus the label that says where it came from. */
export function withClientSource(metadata: ClientLog["metadata"]): Record<string, unknown> {
  // `source` goes last so a client cannot claim another one.
  return { ...metadata, source: "client" };
}

const hits = new Map<string, number[]>();

/** True when this user is still under the per-minute cap (and counts the entry). */
export function allowClientLog(userId: string, now: number = Date.now()): boolean {
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= CLIENT_LOG_LIMIT) {
    hits.set(userId, recent);
    return false;
  }
  recent.push(now);
  hits.set(userId, recent);
  return true;
}

/** Test seam. */
export function resetClientLogLimiter(): void {
  hits.clear();
}
