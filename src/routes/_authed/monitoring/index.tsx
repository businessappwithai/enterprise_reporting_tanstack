import { createFileRoute, Link } from "@tanstack/react-router";
import { MonitoringRuleList } from "@/components/monitoring/MonitoringRuleList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const Route = createFileRoute("/_authed/monitoring/")({
  component: MonitoringPage,
});

function MonitoringPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Monitoring Rules
          </h1>
          <p className="text-muted-foreground">
            Automated threshold monitoring with intelligent alerts
          </p>
        </div>
        <Link to="/monitoring/create">
          <Button>+ New Monitor</Button>
        </Link>
      </div>

      <Card>
        <CardHeader />
        <CardContent className="pt-0">
          <MonitoringRuleList />
        </CardContent>
      </Card>
    </div>
  );
}
