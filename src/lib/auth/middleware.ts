"use server";

import { getEventBus } from "@tanstack/react-start";
import { verifySession as _verifySession } from "./session";

const cachedSession: {
  user: { id: string; email: string; name: string; roles: string[]; permissions: string[] };
  expires: string;
} | null = null;

// Get session from current request context in TanStack Start
export async function getServerSession() {
  try {
    // Try to get cookies from the server context
    const { cookies } = await import("@tanstack/react-start");
    if (cookies) {
      const sessionToken = cookies.get?.("session_token")?.value;
      if (sessionToken) {
        const session = await _verifySession(sessionToken);
        return session;
      }
    }
  } catch (e) {
    console.error("Failed to get session:", e);
  }

  return null;
}

// Enforce authentication in server functions
export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
