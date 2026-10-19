import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, FileText, Home, LayoutDashboard, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ShareResolution, ShareResource } from "@/server-fns/share";

const LABEL: Record<ShareResource, string> = {
  dashboard: "Dashboard",
  chart: "Chart",
  report: "Report",
};
const ICON = { dashboard: LayoutDashboard, chart: BarChart3, report: FileText } as const;

type Shown = Exclude<ShareResolution, { kind: "member" }>;

/**
 * What a share link shows when it does not send the visitor straight to the real page
 * (that case is a redirect in the route's loader).
 */
export function SharePage({ resource, resolution }: { resource: ShareResource; resolution: Shown }) {
  const { pathname } = useLocation();
  const label = LABEL[resource];
  const Icon = ICON[resource];

  if (resolution.kind === "public") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">{resolution.name}</h1>
              {resolution.description && (
                <p className="text-tremor-default text-tremor-content">{resolution.description}</p>
              )}
            </div>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4 text-center">
              <p className="text-muted-foreground py-4">
                {label}: {resolution.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Sign in to open the full {label.toLowerCase()}.
              </p>
              <a href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                <Button variant="outline">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>{label} Not Available</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {resolution.signedIn ? (
            <p className="text-tremor-content">
              This {label.toLowerCase()} does not exist, or your account does not have access to
              it. Ask the person who shared it, or your administrator.
            </p>
          ) : (
            <p className="text-tremor-content">
              This {label.toLowerCase()} is private. If it was shared with you, sign in to open it.
            </p>
          )}
          <div className="flex justify-center gap-2">
            {!resolution.signedIn && (
              <a href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
              </a>
            )}
            <Link to="/">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
