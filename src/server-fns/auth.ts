import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader, getRequestHeader } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { verifySession } from "@/lib/auth/session";

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  setResponseHeader("Set-Cookie", "session_token=; Path=/; HttpOnly; Max-Age=0");
  throw redirect({ to: "/login" });
});

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const cookie = getRequestHeader("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
});
