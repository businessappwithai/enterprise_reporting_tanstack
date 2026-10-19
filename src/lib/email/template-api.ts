/**
 * The checks every /api/email-templates route makes first.
 *
 * Email templates are installation-wide configuration — the batch email jobs send them to
 * whole recipient lists — so they take the settings permission: `setting:view` to read,
 * `setting:edit` to change or preview. In the seeded roles that is the Administrator.
 */

import { auth } from "@/lib/auth/config";
import type { SessionUser } from "@/lib/auth/session";
import { refuseWithoutPermission } from "@/lib/permissions/resource-guard";
import { json } from "@/lib/server/response";

export function templateFailure(code: string, message: string, status: number, details?: unknown) {
  return json({ success: false, error: { code, message, details } }, { status });
}

export async function authorizeTemplates(
  request: Request,
  action: "view" | "edit"
): Promise<{ user: SessionUser } | Response> {
  const session = await auth(request);
  if (!session?.user) return templateFailure("UNAUTHORIZED", "Not authenticated", 401);
  const denied = refuseWithoutPermission(session.user, "setting", action);
  if (denied) return denied;
  return { user: session.user };
}

export async function readJsonBody(request: Request): Promise<unknown | Response> {
  try {
    return await request.json();
  } catch {
    return templateFailure("INVALID_JSON", "Request body must be valid JSON", 400);
  }
}
