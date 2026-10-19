/**
 * The check the resource routes (reports, charts, dashboards, and what hangs off them)
 * were missing: a signed-in session was all they asked for.
 *
 * Found by QA with the lowest-privileged account — `nl_query:*` and nothing else — which
 * permanently deleted an administrator's report, read every saved query's SQL and read
 * the audit log. `DELETE /api/reports/:id` was `deleteFrom(...)` and a 200.
 *
 * Two questions, asked in this order, and they are different questions:
 *
 *   1. Does the caller's ROLE grant this kind of access at all (`report:delete`)?
 *      An NLQueryUser holds neither, and the Analyst has `dashboard:view` and
 *      `dashboard:edit` but not `dashboard:delete` — those distinctions already exist in
 *      the seeded roles and were simply never consulted.
 *   2. For a change, is it the caller's OWN, or is the caller an administrator?
 *      Holding `report:*` lets you manage your reports, not everyone's. This is the rule
 *      `DELETE /api/queries/:id` and the data-source routes already applied.
 *
 * Like `decideQueryRun` they return a refusal rather than throwing, so each route keeps
 * its own response shape.
 */

import type { SessionUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/permissions/permissions";
import { json } from "@/lib/server/response";
import type { ResourceType } from "@/types/database";

type Actor = Pick<SessionUser, "id" | "roles" | "permissions">;

export type ResourceAction = "view" | "create" | "edit" | "delete";

const NOUN: Partial<Record<ResourceType, string>> = {
  report: "reports",
  chart: "charts",
  dashboard: "dashboards",
  query: "saved queries",
  log: "the logs",
  setting: "settings",
  filter: "filters",
  job: "jobs",
};

function forbidden(message: string): Response {
  return json({ success: false, error: { code: "FORBIDDEN", message } }, { status: 403 });
}

/** An administrator by role name or by wildcard permission. */
export function isAdminUser(user: Pick<Actor, "roles" | "permissions">): boolean {
  const perms = user.permissions ?? [];
  return (
    (user.roles ?? []).some((r) => r.toLowerCase().includes("admin")) ||
    perms.includes("*:*") ||
    perms.includes("admin:*")
  );
}

/** A 403 unless the caller's role grants `<resource>:<action>`. */
export function refuseWithoutPermission(
  user: Pick<Actor, "roles" | "permissions">,
  resource: ResourceType,
  action: ResourceAction
): Response | null {
  if (hasPermission(user.permissions ?? [], resource, action, user.roles ?? [])) return null;
  const verb = action === "view" ? "view" : action;
  return forbidden(`You do not have permission to ${verb} ${NOUN[resource] ?? resource}`);
}

/** A 403 unless the caller owns the row or is an administrator. */
export function refuseUnlessOwnerOrAdmin(
  user: Actor,
  createdBy: string | null | undefined,
  resource: ResourceType
): Response | null {
  if (isAdminUser(user) || (createdBy != null && createdBy === user.id)) return null;
  return forbidden(`Only the owner or an administrator can change this ${resource}`);
}
