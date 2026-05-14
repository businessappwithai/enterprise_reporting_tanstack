import { createFileRoute } from "@tanstack/react-router";
import { LogsViewer } from "@/components/logs/logs-viewer";

export const Route = createFileRoute("/_authed/logs")({
  component: LogsPage,
});

function LogsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <p className="text-muted-foreground">View system logs and debugging information</p>
      </div>
      <LogsViewer />
    </div>
  );
}
