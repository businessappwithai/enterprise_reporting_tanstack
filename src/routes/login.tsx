import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { authenticateUser, createSession } from "@/lib/auth/session";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BarChart3 } from "lucide-react";

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const user = await authenticateUser(data.email, data.password);
    if (!user) throw new Error("Invalid credentials");
    const token = await createSession(user);
    setResponseHeader(
      "Set-Cookie",
      `session_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 3600}`
    );
    throw redirect({ to: "/dashboard" });
  });

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [serverError, setServerError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError("");
      try {
        await loginFn({ data: value });
      } catch (err: unknown) {
        // redirect throws are expected — re-throw them so the router can handle them
        if (err instanceof Error && err.message.includes("REDIRECT")) {
          throw err;
        }
        // Check if it's a TanStack router redirect object
        if (err !== null && typeof err === "object" && "_isRedirect" in (err as object)) {
          throw err;
        }
        setServerError(err instanceof Error ? err.message : "An error occurred. Please try again.");
      }
    },
  });

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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    disabled={form.state.isSubmitting}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    disabled={form.state.isSubmitting}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
