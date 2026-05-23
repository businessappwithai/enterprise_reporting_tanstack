import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChartAppearance } from "@/components/charts/editor/chart-appearance";
import { ChartAxisConfig } from "@/components/charts/editor/chart-axis-config";
import { ChartBasicInfo } from "@/components/charts/editor/chart-basic-info";
import { ChartDataSource } from "@/components/charts/editor/chart-data-source";
import { ChartPreviewPanel } from "@/components/charts/editor/chart-preview-panel";
import { ChartReusableFilters } from "@/components/charts/editor/chart-reusable-filters";
import { ChartTypeSelector } from "@/components/charts/editor/chart-type-selector";
import { Button } from "@/components/ui/button";
import type {
  ChartConfig,
  ChartDefinition,
  ChartType,
  DataMapping,
  FilterDefinition,
  SavedQuery,
} from "@/types/database";

export const Route = createFileRoute("/_authed/charts/editor/$id")({
  component: ChartEditorPage,
});

function ChartEditorPage() {
  const { id: chartId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [chartName, setChartName] = useState("");
  const [chartDescription, setChartDescription] = useState("");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [selectedQueryId, setSelectedQueryId] = useState("");
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    title: { show: true, text: "" },
    legend: { show: true, position: "bottom" },
    tooltip: { enabled: true },
    animation: true,
    stacked: false,
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  });
  const [dataMapping, setDataMapping] = useState<DataMapping>({
    xAxis: { field: "", label: "" },
    yAxis: [],
    groupBy: "",
    colorBy: "",
  });
  const [showPreview, setShowPreview] = useState(true);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [selectedFilterId, setSelectedFilterId] = useState<string>("");
  const [targetColumn, setTargetColumn] = useState<string>("");

  const { data: chart } = useQuery<ChartDefinition>({
    queryKey: ["chart", chartId],
    queryFn: async () => {
      const res = await fetch(`/api/charts/${chartId}`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!chartId && chartId !== "new",
  });

  const { data: queries } = useQuery<SavedQuery[]>({
    queryKey: ["queries"],
    queryFn: async () => {
      const res = await fetch("/api/queries");
      const data = await res.json();
      return data.data?.items || [];
    },
  });

  const { data: availableFilters } = useQuery<FilterDefinition[]>({
    queryKey: ["filters"],
    queryFn: async () => {
      const res = await fetch("/api/filters");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: chartFilters } = useQuery({
    queryKey: ["chart-filters", chartId],
    queryFn: async () => {
      if (chartId === "new") return [];
      const res = await fetch(`/api/charts/${chartId}/filters`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!chartId && chartId !== "new",
  });

  const { data: queryResults, isLoading: queryResultsLoading } = useQuery({
    queryKey: ["chart-data-preview", selectedQueryId, chartId],
    queryFn: async () => {
      if (!selectedQueryId) return { rows: [] };
      const res = await fetch(`/api/queries/${selectedQueryId}/execute`, { method: "POST" });
      if (!res.ok) return { rows: [] };
      const data = await res.json();
      return data.data;
    },
    enabled: !!selectedQueryId,
  });

  useEffect(() => {
    if (chart) {
      setChartName(chart.name || "");
      setChartDescription(chart.description || "");
      setChartType(chart.chart_type || "bar");
      setSelectedQueryId(chart.saved_query_id || "");

      if (chart.chart_config) {
        try {
          let configStr = chart.chart_config;
          if (
            typeof configStr === "string" &&
            configStr.startsWith('"') &&
            configStr.includes('\\"')
          ) {
            configStr = JSON.parse(configStr);
          }
          const parsed = typeof configStr === "string" ? JSON.parse(configStr) : configStr;
          setChartConfig({
            title: parsed.title || { show: true, text: "" },
            legend: parsed.legend || { show: true, position: "bottom" },
            tooltip: parsed.tooltip || { enabled: true },
            animation: parsed.animation !== undefined ? parsed.animation : true,
            stacked: parsed.stacked || false,
            colors: parsed.colors || ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
          });
        } catch {
          // keep defaults
        }
      }

      if (chart.data_mapping) {
        try {
          let mappingStr = chart.data_mapping;
          if (
            typeof mappingStr === "string" &&
            mappingStr.startsWith('"') &&
            mappingStr.includes('\\"')
          ) {
            mappingStr = JSON.parse(mappingStr);
          }
          const parsed = typeof mappingStr === "string" ? JSON.parse(mappingStr) : mappingStr;
          setDataMapping({
            xAxis: parsed.xAxis || { field: "", label: "" },
            yAxis: parsed.yAxis || [],
            groupBy: parsed.groupBy || "",
            colorBy: parsed.colorBy || "",
          });
        } catch {
          // keep defaults
        }
      }
    }
  }, [chart]);

  useEffect(() => {
    if (queryResults?.rows) {
      setPreviewData(queryResults.rows);
    }
  }, [queryResults]);

  useEffect(() => {
    // Only reset axes when the user picks a *different* query than the saved one.
    // Without this guard, saving the chart re-fetches `chart`, fires this effect,
    // and wipes the axis configuration the user just configured.
    if (selectedQueryId && chart && selectedQueryId !== chart.saved_query_id) {
      setDataMapping({ xAxis: { field: "", label: "" }, yAxis: [], groupBy: "", colorBy: "" });
    }
  }, [selectedQueryId, chart]);

  const availableFields = previewData.length > 0 ? Object.keys(previewData[0]) : [];

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: chartName,
        description: chartDescription,
        chart_type: chartType,
        saved_query_id: selectedQueryId || undefined,
        chart_config: JSON.stringify(chartConfig),
        data_mapping: JSON.stringify(dataMapping),
      };
      const url = chartId === "new" ? "/api/charts" : `/api/charts/${chartId}`;
      const method = chartId === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || "Failed to save chart");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Chart saved successfully");
      queryClient.invalidateQueries({ queryKey: ["charts"] });
      queryClient.invalidateQueries({ queryKey: ["chart"] });
      if (chartId === "new") {
        navigate({ to: "/charts/editor/$id", params: { id: data.data.id } });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const addFilterMutation = useMutation({
    mutationFn: async ({ filterId, targetColumn }: { filterId: string; targetColumn: string }) => {
      const res = await fetch(`/api/charts/${chartId}/filters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter_id: filterId, target_column: targetColumn }),
      });
      if (!res.ok) throw new Error("Failed to add filter");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Filter added");
      queryClient.invalidateQueries({ queryKey: ["chart-filters", chartId] });
    },
  });

  const removeFilterMutation = useMutation({
    mutationFn: async (filterLinkId: string) => {
      const res = await fetch(`/api/charts/${chartId}/filters/${filterLinkId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove filter");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Filter removed");
      queryClient.invalidateQueries({ queryKey: ["chart-filters", chartId] });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/charts/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Chart Editor</h1>
              <p className="text-sm text-gray-500">
                {chartId === "new" ? "Create a new chart" : "Edit chart configuration"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : "Save Chart"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <ChartBasicInfo
              chartName={chartName}
              chartDescription={chartDescription}
              onNameChange={setChartName}
              onDescriptionChange={setChartDescription}
            />
            <ChartDataSource
              queries={queries}
              selectedQueryId={selectedQueryId}
              availableFields={availableFields}
              onQueryChange={setSelectedQueryId}
            />
            {chartId !== "new" && (
              <ChartReusableFilters
                availableFilters={availableFilters}
                chartFilters={chartFilters}
                availableFields={availableFields}
                selectedFilterId={selectedFilterId}
                targetColumn={targetColumn}
                onSelectedFilterChange={setSelectedFilterId}
                onTargetColumnChange={setTargetColumn}
                onAddFilter={(filterId, col) => {
                  addFilterMutation.mutate({ filterId, targetColumn: col });
                  setSelectedFilterId("");
                  setTargetColumn("");
                }}
                onRemoveFilter={(id) => removeFilterMutation.mutate(id)}
                isAdding={addFilterMutation.isPending}
                isRemoving={removeFilterMutation.isPending}
              />
            )}
            <ChartTypeSelector chartType={chartType} onChartTypeChange={setChartType} />
            <ChartAxisConfig
              dataMapping={dataMapping}
              availableFields={availableFields}
              chartConfig={chartConfig}
              onDataMappingChange={setDataMapping}
            />
            <ChartAppearance
              chartConfig={chartConfig}
              chartType={chartType}
              onChartConfigChange={setChartConfig}
            />
          </div>

          {showPreview && (
            <ChartPreviewPanel
              previewData={previewData}
              availableFields={availableFields}
              chartType={chartType}
              chartConfig={chartConfig}
              dataMapping={dataMapping}
              selectedQueryId={selectedQueryId}
              isLoading={queryResultsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
