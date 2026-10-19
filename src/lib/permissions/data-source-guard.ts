/**
 * The two questions every route that registers or re-points a data source must ask.
 *
 * `POST /api/data-sources/test` asked both, and said why in a comment: managing data
 * sources takes a permission, and the host and port come straight from the request body.
 * The routes that actually create, update and upload a data source asked neither, so the
 * lowest-privileged account in the system (`nlquery`, which holds `nl_query:*` and
 * nothing else) could register a connection to `169.254.169.254` and then query through
 * it. Both checks now live here so a route cannot ask one and forget the other.
 *
 * They return a refusal rather than throwing, as `decideQueryRun` does, so each route
 * keeps its own response shape.
 */

import type { SessionUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/permissions/permissions";
import { json } from "@/lib/server/response";
import { checkDataSourceHost } from "@/lib/security/network-target";

export type DataSourceAction = "create" | "edit" | "delete";

/** A 403 unless the caller holds `data_source:<action>` (or a wildcard that covers it). */
export function refuseWithoutDataSourcePermission(
  user: Pick<SessionUser, "permissions" | "roles">,
  action: DataSourceAction
): Response | null {
  if (hasPermission(user.permissions ?? [], "data_source", action, user.roles ?? [])) return null;
  return json({ error: { message: "You do not have permission to manage data sources" } }, {
    status: 403,
  });
}

/**
 * A 403 when the connection would point at an address this server must not dial
 * (loopback, link-local, private ranges). A config with no host — a file or a
 * connection string — is not this check's to judge.
 */
export async function refuseForbiddenTarget(
  connectionConfig: { host?: string } | null | undefined
): Promise<Response | null> {
  const target = await checkDataSourceHost(connectionConfig?.host);
  if (target.allowed) return null;
  return json({ error: { message: target.reason } }, { status: 403 });
}
