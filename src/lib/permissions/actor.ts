/**
 * Who a background job runs as.
 *
 * A job has no request, so no session; it has a `created_by` (or a `userId` in its payload).
 * Running the creator's SQL as "the system" would let someone schedule a query, lose access to
 * its tables, and keep receiving the data. So the job is run as that person, with the
 * permissions they hold *now*: `loadActor` rebuilds the same `SessionUser` a request would
 * carry, and `refuseJobQuery` asks the same two questions every other stored-SQL path asks.
 */

import type { SessionUser } from "@/lib/auth/session";
import { loadRolesAndPermissions } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { decideQueryRun } from "@/lib/permissions/runnable-query";

/** The user as a session would describe them, or null if they are gone or deactivated. */
export async function loadActor(userId: string | null | undefined): Promise<SessionUser | null> {
  if (!userId) return null;
  const user = await getDb()
    .selectFrom("users")
    .select(["id", "email", "display_name", "is_active"])
    .where("id", "=", userId)
    .executeTakeFirst();
  if (!user || !user.is_active) return null;

  const { roles, permissions } = await loadRolesAndPermissions(user.id);
  return { id: user.id, email: user.email, name: user.display_name, roles, permissions };
}

/**
 * Null when `userId` may run `sqlContent` against `dataSourceId`; otherwise the reason, ready to
 * put in a job result or an execution row.
 */
export async function refuseJobQuery(
  userId: string | null | undefined,
  sqlContent: string,
  dataSourceId: string
): Promise<string | null> {
  const actor = await loadActor(userId);
  if (!actor) return "The job's owner no longer exists or has been deactivated.";
  const decision = await decideQueryRun(actor, sqlContent, dataSourceId);
  return decision.ok ? null : decision.message;
}
