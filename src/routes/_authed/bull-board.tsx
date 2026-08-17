import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/_authed/bull-board")({
  component: QueueManagementPage,
});

const TRIGGER_TASKS = [
  {
    id: "report:generate",
    label: "Report Generation",
    description: "Generates CSV, XLSX, and PDF reports",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: "data:export",
    label: "Data Export",
    description: "Exports query results to files",
    icon: Activity,
    color: "text-emerald-500",
  },
  {
    id: "email:batch",
    label: "Email Batch",
    description: "Sends batch emails with attachments",
    icon: Mail,
    color: "text-violet-500",
  },
  {
    id: "scheduled:refresh",
    label: "Scheduled Refresh",
    description: "Refreshes reports, charts, and dashboards on schedule",
    icon: Clock,
    color: "text-orange-500",
  },
];

function QueueManagementPage() {
  const triggerApiUrl = typeof window !== "undefined" ? undefined : process.env.TRIGGER_API_URL;

  const {
    data: jobs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["job-definitions"],
    queryFn: async () => {
      const res = await fetch("/api/jobs?pageSize=50");
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load jobs`);
      const data = await res.json();
      return data.data?.items || [];
    },
    refetchInterval: 30000,
  });

  const activeJobs = jobs.filter((j: any) => j.is_active && !j.is_deleted);
  const scheduledJobs = activeJobs.filter((j: any) => j.schedule_cron);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Queue Management" description="Background jobs powered by Trigger.dev" />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {process.env.TRIGGER_API_URL && (
            <Button variant="outline" size="sm" asChild>
              <a href={process.env.TRIGGER_API_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Trigger.dev Dashboard
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Registered Tasks */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Registered Tasks
        </h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {TRIGGER_TASKS.map((task) => {
            const Icon = task.icon;
            return (
              <Card key={task.id}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className={`rounded-md p-2 bg-muted`}>
                    <Icon className={`h-4 w-4 ${task.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium leading-tight">
                      {task.label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-tremor-label text-tremor-content">{task.description}</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {task.id}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Job Definitions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Scheduled Jobs
              </CardTitle>
              <CardDescription>
                Job definitions with recurring schedules ({scheduledJobs.length} active)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading jobs...</div>
          ) : scheduledJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No scheduled jobs configured. Create one from the Jobs page.
            </div>
          ) : (
            <div className="space-y-2">
              {scheduledJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{job.name}</p>
                      <p className="text-tremor-label text-tremor-content">
                        {job.job_type} · cron:{" "}
                        <span className="font-mono">{job.schedule_cron}</span>
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    active
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Job Definitions */}
      {activeJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Job Definitions</CardTitle>
            <CardDescription>
              {activeJobs.length} active job definition{activeJobs.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{job.name}</p>
                    <p className="text-tremor-label text-tremor-content">
                      Type: {job.job_type}
                      {job.schedule_cron ? ` · ${job.schedule_cron}` : " · on-demand"}
                    </p>
                  </div>
                  <Badge variant={job.schedule_cron ? "default" : "secondary"} className="text-xs">
                    {job.schedule_cron ? "scheduled" : "on-demand"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground text-center">
            Live run status and logs are available in the{" "}
            <a
              href="https://dashboard.trigger.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Trigger.dev dashboard
            </a>
            . For local development, set <span className="font-mono">TRIGGER_API_URL</span> to your
            Mastra.ai server.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
