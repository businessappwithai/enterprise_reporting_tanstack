import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AreaChart,
  BarChart3,
  Edit,
  Eye,
  LineChart,
  MoreHorizontal,
  PieChart,
  Plus,
  Trash,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCanCreate, useCanDelete, useCanEdit } from "@/lib/hooks/usePermissions";
import { formatDateTime } from "@/lib/utils";
import type { ChartDefinition, ChartType, SavedQuery } from "@/types/database";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/_authed/charts/")({
  component: ChartsPage,
});

function ChartsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newChartName, setNewChartName] = useState("");
  const [newChartType, setNewChartType] = useState<ChartType>("bar");
  const [selectedQueryId, setSelectedQueryId] = useState("");

  const canCreateChart = useCanCreate("chart");
  const canEditCharts = useCanEdit("chart");
  const canDeleteCharts = useCanDelete("chart");

  const chartTypeIcons = useMemo<Record<ChartType, React.ReactNode>>(
    () => ({
      bar: <BarChart3 className="h-4 w-4" />,
      line: <LineChart className="h-4 w-4" />,
      area: <AreaChart className="h-4 w-4" />,
      pie: <PieChart className="h-4 w-4" />,
      scatter: <BarChart3 className="h-4 w-4" />,
      composed: <BarChart3 className="h-4 w-4" />,
    }),
    []
  );

  const { data: charts, isLoading } = useQuery<ChartDefinition[]>({
    queryKey: ["charts"],
    queryFn: async () => {
      const res = await fetch("/api/charts");
      const data = await res.json();
      return data.data?.items || [];
    },
  });

  const { data: queries } = useQuery<SavedQuery[]>({
    queryKey: ["queries"],
    queryFn: async () => {
      const res = await fetch("/api/queries");
      const data = await res.json();
      return data.data?.items || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newChartName,
          chart_type: newChartType,
          saved_query_id: selectedQueryId || undefined,
          chart_config: { legend: { show: true }, tooltip: { enabled: true } },
          data_mapping: { xAxis: { field: "" }, yAxis: [] },
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Chart created successfully");
        queryClient.invalidateQueries({ queryKey: ["charts"] });
        setCreateDialogOpen(false);
        setNewChartName("");
        setNewChartType("bar");
        setSelectedQueryId("");
        navigate({ to: "/charts/editor/$id", params: { id: data.data.id } });
      } else {
        toast.error(data.error?.message || "Failed to create chart");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/charts/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Chart deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["charts"] });
      } else {
        toast.error(data.error?.message || "Failed to delete chart");
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Charts" description="Create and manage data visualizations" />

        <div className="flex gap-2">
          {canCreateChart && (
            <Link to="/charts/editor/$id" params={{ id: "new" }}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Open Chart Editor
              </Button>
            </Link>
          )}
          {canCreateChart && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Chart</DialogTitle>
                  <DialogDescription>
                    Create a new chart visualization from a saved query.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newChartName}
                      onChange={(e) => setNewChartName(e.target.value)}
                      placeholder="My Chart"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Chart Type</Label>
                    <Select
                      value={newChartType}
                      onValueChange={(v) => setNewChartType(v as ChartType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="scatter">Scatter Plot</SelectItem>
                        <SelectItem value="composed">Composed Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="query">Data Source Query</Label>
                    <Select value={selectedQueryId} onValueChange={setSelectedQueryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a query" />
                      </SelectTrigger>
                      <SelectContent>
                        {queries?.map((query) => (
                          <SelectItem key={query.id} value={query.id}>
                            {query.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={!newChartName || createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Chart"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Charts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading charts...</div>
          ) : charts?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No charts created yet. Create your first chart to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charts?.map((chart) => (
                  <TableRow key={chart.id}>
                    <TableCell className="font-medium">{chart.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {chartTypeIcons[chart.chart_type]}
                        {chart.chart_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {chart.saved_query_id ? (
                        <Badge variant="secondary">Linked</Badge>
                      ) : (
                        <Badge variant="outline">No Query</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-tremor-content">
                      {formatDateTime(chart.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/charts/viewer/$id" params={{ id: chart.id }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          {canEditCharts && (
                            <DropdownMenuItem asChild>
                              <Link to="/charts/editor/$id" params={{ id: chart.id }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {canDeleteCharts && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteMutation.mutate(chart.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
