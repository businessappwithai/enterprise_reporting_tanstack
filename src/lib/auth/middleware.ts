"use server";

import { getRequest } from "@tanstack/react-start/server";
import { getSessionFromHeaders, SessionUnavailableError } from "./session";

/**
 * The caller's session inside a server function, or null when signed out.
 *
 * An outage is rethrown rather than folded into null: `requireAuth` would otherwise
 * report UNAUTHORIZED for a database that is restarting.
 */
export async function getServerSession() {
  try {
    const request = getRequest();
    if (!request) return null;
    return await getSessionFromHeaders(request.headers);
  } catch (e) {
    if (e instanceof SessionUnavailableError) throw e;
    console.error("Failed to get session:", e);
    return null;
  }
}

/** Enforce authentication in server functions. */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
