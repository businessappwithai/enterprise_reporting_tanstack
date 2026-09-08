/**
 * The session seam.
 *
 * Authentication is Better Auth now (src/lib/auth/better-auth.ts), but the
 * shapes below are unchanged: `Session`, `SessionUser`, and a `verifySession`
 * that takes a token. Roughly fifty call sites across the API routes and server
 * functions depend on them, and none of those files care which library issues
 * the cookie — so the library moved and the seam did not.
 *
 * What DID change is where roles and permissions come from. The old
 * implementation baked them into an HS256 JWT at sign-in, so a role revoked at
 * 09:00 was still granted by an unexpired token at 17:00. They are now read
 * from `roles`/`user_roles` on every request, against the session's user id.
 * That is a live check: revocation takes effect on the next request.
 */

import { getDb } from "@/lib/db/config";
import { getAuth } from "./better-auth";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface Session {
  user: SessionUser;
  expires: string;
}

/**
 * Resolve a user's roles and the permissions those roles carry.
 *
 * `roles.permissions` is a JSON array of `resource:action` strings. A row whose
 * JSON does not parse contributes nothing rather than throwing — one malformed
 * role must not lock every one of its members out of the application.
 */
export async function loadRolesAndPermissions(
  userId: string
): Promise<{ roles: string[]; permissions: string[] }> {
  const db = getDb();
  const roles = await db
    .selectFrom("roles")
    .innerJoin("user_roles", "roles.id", "user_roles.role_id")
    .where("user_roles.user_id", "=", userId)
    .selectAll("roles")
    .execute();

  const permissions = roles.flatMap((role: { permissions: string }) => {
    try {
      const parsed = JSON.parse(role.permissions);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  });

  return {
    roles: roles.map((r: { name: string }) => r.name),
    permissions: Array.from(new Set(permissions)),
  };
}

/**
 * Resolve the session for a request, from its cookies.
 *
 * This is the preferred entry point: it hands Better Auth the real headers and
 * lets it do the cookie parsing, rather than a regex over the Cookie header.
 */
export async function getSessionFromHeaders(headers: Headers): Promise<Session | null> {
  try {
    const result = await getAuth().api.getSession({ headers });
    if (!result?.user?.id) return null;

    const user = result.user as { id: string; email: string; name?: string | null };
    const { roles, permissions } = await loadRolesAndPermissions(user.id);

    const expiresAt = (result.session as { expiresAt?: Date | string } | undefined)?.expiresAt;
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? user.email,
        roles,
        permissions,
      },
      expires: expiresAt ? new Date(expiresAt).toISOString() : new Date().toISOString(),
    };
  } catch (e) {
    console.error("Failed to resolve session:", e);
    return null;
  }
}

/**
 * Resolve a session from a raw session token.
 *
 * Kept because a number of API routes hold the token rather than the request.
 * Unlike the JWT it replaces, this is a database lookup: the row has to exist
 * and be unexpired, so a signed-out session stops working immediately instead
 * of staying valid until its signature expires.
 *
 * Better Auth stores the cookie as `<token>.<signature>`; only the part before
 * the first dot is the token, so a caller passing the whole cookie value still
 * resolves.
 */
export async function verifySession(token: string): Promise<Session | null> {
  if (!token) return null;
  const bareToken = decodeURIComponent(token).split(".")[0];
  if (!bareToken) return null;

  try {
    const db = getDb();
    const row = await db
      .selectFrom("auth_sessions")
      .innerJoin("users", "users.id", "auth_sessions.user_id")
      .where("auth_sessions.token", "=", bareToken)
      .where("users.is_active", "=", true)
      .select([
        "users.id as id",
        "users.email as email",
        "users.display_name as display_name",
        "auth_sessions.expires_at as expires_at",
      ])
      .executeTakeFirst();

    if (!row) return null;
    if (new Date(row.expires_at).getTime() <= Date.now()) return null;

    const { roles, permissions } = await loadRolesAndPermissions(row.id);
    return {
      user: {
        id: row.id,
        email: row.email,
        name: row.display_name,
        roles,
        permissions,
      },
      expires: new Date(row.expires_at).toISOString(),
    };
  } catch {
    return null;
  }
}
