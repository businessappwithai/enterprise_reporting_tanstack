"use client";

/**
 * Public Dashboard Viewer - No authentication required
 * Displays dashboards that are marked as public (is_public = true)
 */

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lock, Home, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { PublicWidgetCard } from "../PublicWidgetCard";
import type { DashboardLayout, DashboardWidget } from "@/types/database";

interface PublicDashboardData {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  layout_config: string | null;
  theme_config: string | null;
  refresh_config: string | null;
  widgets: Array<{
    id: string;
    widget_type: string;
    report_id: string | null;
    chart_id: string | null;
    position_config: string | null;
    widget_config: string | null;
    x: number;
    y: number;
    w: number;
    h: number;
    minW: number;
    minH: number;
    title: string | null;
  }>;
}

function PublicDashboardContent() {
  const params = useParams();
  const router = useRouter();
  const dashboardId = params.id as string;

  const [dashboard, setDashboard] = useState<PublicDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    code: string;
    message: string;
  } | null>(null);

  // Fetch public dashboard
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/share/dashboard/${dashboardId}`);

        if (res.status === 404) {
          setError({ code: "NOT_FOUND", message: "Dashboard not found" });
          return;
        }

        if (res.status === 403) {
          setError({
            code: "PRIVATE",
            message: "This dashboard is private. Please log in to view it.",
          });
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data = await res.json();
        setDashboard(data.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError({ code: "ERROR", message: "Failed to load dashboard" });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, [dashboardId]);

  // Parse layout config to determine widget positions
  const widgetPositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number; w: number; h: number }>();

    // Try to get positions from layout config
    if (dashboard?.layout_config) {
      try {
        const config = JSON.parse(dashboard.layout_config);
        const layouts = config.layouts?.lg || [];
        layouts.forEach((layout: any) => {
          positions.set(layout.i, { x: layout.x, y: layout.y, w: layout.w, h: layout.h });
        });
      } catch {
        // Ignore parse errors
      }
    }

    // If no layout config, use widget's position_config
    if (positions.size === 0 && dashboard?.widgets) {
      dashboard.widgets.forEach((w: any) => {
        try {
          const pos = JSON.parse(w.position_config || "{}");
          positions.set(w.id, { x: pos.x || 0, y: pos.y || 0, w: pos.w || 4, h: pos.h || 4 });
        } catch {
          positions.set(w.id, { x: 0, y: 0, w: 4, h: 4 });
        }
      });
    }

    return positions;
  }, [dashboard]);

  // Parse widgets config
  const widgets = useMemo(() => {
    if (!dashboard?.widgets) return [];
    return dashboard.widgets;
  }, [dashboard]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {error.code === "PRIVATE" ? (
                <>
                  <div className="p-3 bg-muted rounded-full">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Private Dashboard</h2>
                    <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
                  </div>
                  <Button asChild>
                    <Link href="/login">Log In to View</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-muted rounded-full">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {error.code === "NOT_FOUND"
                        ? "Dashboard Not Found"
                        : "Error Loading Dashboard"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Home
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard not loaded (shouldn't happen)
  if (!dashboard) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">D</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold">{dashboard.name}</h1>
              {dashboard.description && (
                <p className="text-sm text-muted-foreground">{dashboard.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Public</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <Lock className="h-3 w-3 mr-2" />
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Public Dashboard Banner */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are viewing a public dashboard. Some features may be limited.
            <Button asChild variant="link" className="ml-2 h-auto p-0" size="sm">
              <Link href="/login">Log in</Link>
            </Button>{" "}
            for full access.
          </AlertDescription>
        </Alert>

        {/* Dashboard Widgets */}
        {widgets.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No widgets added to this dashboard yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(12, 1fr)",
              gridAutoRows: "minmax(100px, auto)",
            }}
          >
            {widgets.map((widget: any) => {
              const pos = widgetPositions.get(widget.id) || { x: 0, y: 0, w: 4, h: 4 };
              return (
                <div
                  key={widget.id}
                  style={{
                    gridColumn: `span ${Math.min(pos.w, 12)}`,
                    gridRow: `span ${Math.max(pos.h, 2)}`,
                  }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        {widget.title || widget.widget_type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-45px)] overflow-hidden">
                      <PublicWidgetCard widget={widget} />
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Shared via Enterprise Reporting System</p>
        </div>
      </footer>
    </div>
  );
}

export default function PublicDashboardPage() {
  return <PublicDashboardContent />;
}
