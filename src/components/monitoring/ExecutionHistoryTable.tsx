import { useQuery } from "@tanstack/react-query";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

interface MonitoringExecution {
  id: string;
  monitoring_rule_id: string;
  executed_at: string;
  status: "PASS" | "BREACH" | "ESCALATE" | "NO_DATA" | "ERROR";
  metric_value?: number | null;
  threshold_operator?: string;
  threshold_value?: number;
  threshold_upper_bound?: number | null;
  delta_pct?: number | null;
  alert_sent: boolean;
  duration_ms?: number | null;
  error_message?: string | null;
}

interface ExecutionsResponse {
  executions: MonitoringExecution[];
  total: number;
  page: number;
  pageSize: number;
}

interface Props {
  ruleId: string;
}

function StatusBadge({ status }: { status: MonitoringExecution["status"] }) {
  switch (status) {
    case "PASS":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
          PASS
        </Badge>
      );
    case "BREACH":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">
          BREACH
        </Badge>
      );
    case "ESCALATE":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
          ESCALATE
        </Badge>
      );
    case "NO_DATA":
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
          NO_DATA
        </Badge>
      );
    case "ERROR":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
          ERROR
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatThresholdCompare(exec: MonitoringExecution): string {
  if (exec.metric_value == null || exec.threshold_value == null) return "—";
  const op = exec.threshold_operator ?? "";
  const val = exec.threshold_value.toLocaleString();
  const upper = exec.threshold_upper_bound;
  switch (op) {
    case "lt":
      return `< ${val}`;
    case "lte":
      return `≤ ${val}`;
    case "gt":
      return `> ${val}`;
    case "gte":
      return `≥ ${val}`;
    case "eq":
      return `= ${val}`;
    case "neq":
      return `≠ ${val}`;
    case "between":
      return `${val} – ${(upper ?? 0).toLocaleString()}`;
    default:
      return val;
  }
}

function DeltaBadge({ delta }: { delta: number | null | undefined }) {
  if (delta == null) return <span className="text-muted-foreground">—</span>;
  const sign = delta >= 0 ? "+" : "";
  const color = delta >= 0 ? "text-green-600" : "text-red-600";
  return (
    <span className={`font-medium text-sm ${color}`}>
      {sign}{delta.toFixed(1)}%
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 7 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function ExecutionHistoryTable({ ruleId }: Props) {
  const { data, isLoading } = useQuery<ExecutionsResponse>({
    queryKey: ["monitoring-executions", ruleId],
    queryFn: async () => {
      const res = await fetch(`/api/monitoring/rules/${ruleId}/executions`);
      if (!res.ok) throw new Error("Failed to fetch execution history");
      return res.json();
    },
    enabled: !!ruleId,
  });

  const executions = data?.executions ?? [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Executed At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Metric Value</TableHead>
            <TableHead>vs Threshold</TableHead>
            <TableHead>Change %</TableHead>
            <TableHead>Alert Sent</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows />
          ) : executions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No execution history yet. This rule has not run yet.
              </TableCell>
            </TableRow>
          ) : (
            executions.map((exec) => (
              <TableRow key={exec.id}>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDateTime(exec.executed_at)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={exec.status} />
                </TableCell>
                <TableCell className="text-sm">
                  {exec.metric_value != null
                    ? exec.metric_value.toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell className="text-sm">
                  {formatThresholdCompare(exec)}
                </TableCell>
                <TableCell>
                  <DeltaBadge delta={exec.delta_pct} />
                </TableCell>
                <TableCell>
                  {exec.alert_sent ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {exec.duration_ms != null ? `${exec.duration_ms}ms` : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
