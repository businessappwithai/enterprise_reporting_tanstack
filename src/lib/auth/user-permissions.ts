/**
 * What the browser is told about the signed-in user's permissions.
 *
 * One builder, two callers: `/api/auth/permissions`, and the `_authed` route guard, which
 * hands the result to the page with the session so the sidebar renders its full menu on
 * the first paint. It used to fetch this after hydration and hide every gated item until
 * the answer came back, so the menu flashed to just "Dashboard" on every load.
 *
 * `resourcePermissions` is the caller's own grants only. The route used to return the
 * whole `resource_permissions` table, every role's grants on every resource, to anyone
 * signed in.
 */

import { getDb } from "@/lib/db/config";
import type { Session } from "./session";

export interface UserPermissions {
  userId: string;
  roles: Array<{ id: string; name: string; permissions: string }>;
  rolePermissions: string[];
  resourcePermissions: Array<{
    id: string;
    resource_type: string;
    resource_id: string;
    role_id: string;
    permission_level: string;
  }>;
  isAdmin: boolean;
}

export const NO_PERMISSIONS: UserPermissions = {
  userId: "",
  roles: [],
  rolePermissions: [],
  resourcePermissions: [],
  isAdmin: false,
};

export async function loadUserPermissions(session: Session): Promise<UserPermissions> {
  const db = getDb();
  const roles = await db
    .selectFrom("roles")
    .innerJoin("user_roles", "roles.id", "user_roles.role_id")
    .where("user_roles.user_id", "=", session.user.id)
    .select(["roles.id", "roles.name", "roles.permissions"])
    .execute();

  // The session already parsed these (and skipped malformed rows); reuse that reading.
  const rolePermissions = session.user.permissions;

  const isAdmin =
    rolePermissions.includes("*") ||
    rolePermissions.includes("*:*") ||
    rolePermissions.includes("admin:*") ||
    roles.some((r) => {
      const name = r.name.toLowerCase();
      return name === "admin" || name === "administrator";
    });

  const roleIds = roles.map((r) => r.id);
  const resourcePermissions =
    roleIds.length === 0
      ? []
      : await db
          .selectFrom("resource_permissions")
          .select(["id", "resource_type", "resource_id", "role_id", "permission_level"])
          .where("role_id", "in", roleIds)
          .execute();

  return {
    userId: session.user.id,
    roles: roles.map((r) => ({ id: r.id, name: r.name, permissions: r.permissions })),
    rolePermissions,
    resourcePermissions,
    isAdmin,
  };
}
