import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader, getRequestHeader } from "@tanstack/react-start/server";
import { BarChart3, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticateUser, createSession } from "@/lib/auth/session";
import { createLogger } from "@/lib/logging/logger";

if (import.meta.hot) {
  import.meta.hot.decline();
}

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data, request }) => {
    const logger = createLogger({ component: "Authentication" });
    const timestamp = new Date().toISOString();
    const userAgent = getRequestHeader("user-agent") || "unknown";

    try {
      logger.info("Login attempt", {
        email: data.email,
        timestamp,
        userAgent,
      });

      const user = await authenticateUser(data.email, data.password);

      if (!user) {
        logger.warn("Failed login attempt - invalid credentials", {
          email: data.email,
          timestamp,
          reason: "Invalid email or password",
          userAgent,
        });
        throw new Error("Invalid credentials");
      }

      const token = await createSession(user);

      setResponseHeader(
        "Set-Cookie",
        `session_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 3600}`
      );

      logger.info("Login successful", {
        userId: user.id,
        email: user.email,
        userName: user.name,
        roles: user.roles,
        timestamp,
        userAgent,
      });

      return { ok: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Login error", error instanceof Error ? error : new Error(errorMessage), {
        email: data.email,
        timestamp,
        errorMessage,
        userAgent,
      });
      throw error;
    }
  });

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    if (!email || !password) return;

    setServerError("");
    setIsSubmitting(true);
    try {
      await loginFn({ data: { email, password } });
      await navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your Enterprise Reporting account</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                ref={emailRef}
                type="email"
                placeholder="name@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                ref={passwordRef}
                type="password"
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
