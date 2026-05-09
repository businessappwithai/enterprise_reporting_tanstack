import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Play,
  Pause,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/bull-board")({
  component: BullBoardPage,
});

function BullBoardPage() {
  const queryClient = useQueryClient();
  const [activeQueue, setActiveQueue] = useState("default");

  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bull-stats", activeQueue],
    queryFn: async () => {
      const res = await fetch(`/api/admin/queues/stats?queue=${activeQueue}`);
      const data = await res.json();
      return data.data || {};
    },
    refetchInterval: 10000,
  });

  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ["bull-jobs", activeQueue],
    queryFn: async () => {
      const res = await fetch(`/api/admin/queues?queue=${activeQueue}`);
      const data = await res.json();
      return data.data || [];
    },
    refetchInterval: 10000,
  });

  const cleanMutation = useMutation({
    mutationFn: async (status: string) => {
      await fetch(`/api/admin/queues`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queue: activeQueue, status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bull-stats"] });
      queryClient.invalidateQueries({ queryKey: ["bull-jobs"] });
      toast.success("Queue cleaned successfully");
    },
  });

  const statCards = [
    { label: "Waiting", value: stats?.waiting ?? 0, icon: Clock, color: "text-yellow-500" },
    { label: "Active", value: stats?.active ?? 0, icon: Activity, color: "text-blue-500" },
    {
      label: "Completed",
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    { label: "Failed", value: stats?.failed ?? 0, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Queue Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage background job queues</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "—" : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>Recent job executions in the queue</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => cleanMutation.mutate("completed")}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clean Completed
              </Button>
              <Button variant="outline" size="sm" onClick={() => cleanMutation.mutate("failed")}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clean Failed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingJobs ? (
            <div className="text-center py-8 text-muted-foreground">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No jobs in queue</div>
          ) : (
            <div className="space-y-2">
              {jobs.map(
                (job: {
                  id: string;
                  name: string;
                  status: string;
                  progress?: number;
                  failedReason?: string;
                  timestamp?: number;
                }) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {job.status === "completed" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {job.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                      {job.status === "active" && <Activity className="h-4 w-4 text-blue-500" />}
                      {job.status === "waiting" && <Clock className="h-4 w-4 text-yellow-500" />}
                      <div>
                        <p className="text-sm font-medium">{job.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {job.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === "active" && job.progress !== undefined && (
                        <span className="text-xs text-muted-foreground">{job.progress}%</span>
                      )}
                      <Badge
                        variant={
                          job.status === "completed"
                            ? "default"
                            : job.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
