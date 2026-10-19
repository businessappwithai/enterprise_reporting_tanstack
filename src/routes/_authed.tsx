import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getSessionFromHeaders } from "@/lib/auth/session";
import { SESSION_UNAVAILABLE_MESSAGE } from "@/lib/auth/session-errors";

// Resolved from the request's headers rather than by matching a cookie name:
// the name is Better Auth's business (`ers.session_token`, and `__Secure-`
// prefixed once served over HTTPS), and this guard decides whether anyone sees
// the application at all.
const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  if (!request) return null;
  return getSessionFromHeaders(request.headers);
});

export const Route = createFileRoute("/_authed")({
  // Only "no session" goes to /login. A session that could not be *checked* —
  // getSessionFromHeaders throws SessionUnavailableError — lands on the error
  // component below instead: redirecting would sign out everyone who loaded a page
  // while the database was restarting, and their cookie is still good.
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session) throw redirect({ to: "/login" });
    return { session };
  },
  component: AuthedLayout,
  errorComponent: AuthedError,
});

function AuthedLayout() {
  const { session } = Route.useRouteContext();
  return (
    <AppShell user={session.user}>
      <Outlet />
    </AppShell>
  );
}

// The error component also catches anything a child page throws without an error
// component of its own, so only an outage gets the sign-in wording. The test is on the
// message because the error crosses the server-function boundary as plain data.
function AuthedError({ error }: ErrorComponentProps) {
  const router = useRouter();
  const sessionUnavailable =
    error instanceof Error && error.message.includes(SESSION_UNAVAILABLE_MESSAGE);
  return (
    <div className="flex min-h-screen items-center justify-center bg-tremor-background-muted p-6">
      <div className="max-w-md space-y-4 rounded-lg border bg-tremor-background p-6 shadow-sm">
        <h1 className="font-semibold text-lg text-tremor-content-strong">
          {sessionUnavailable ? "We couldn't check your sign-in" : "Something went wrong"}
        </h1>
        <p className="text-tremor-default text-tremor-content">
          {sessionUnavailable
            ? "The server could not reach its database, so it could not confirm your session. " +
              "You have not been signed out — try again in a moment."
            : error instanceof Error
              ? error.message
              : "This page could not be loaded."}
        </p>
        <Button onClick={() => router.invalidate()}>Try again</Button>
      </div>
    </div>
  );
}
