import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Edit3,
  LineChart,
  Loader2,
  Mic,
  MicOff,
  PieChart,
  Play,
  RotateCcw,
  Save,
  ScatterChart,
  Send,
  Table2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EChartsRenderer } from "@/components/echarts/EChartsRenderer";
import { QueryResults } from "@/components/sql-editor/query-results";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AgentStepsDisplay } from "@/components/nl-query/AgentStepsDisplay";
import { RecordViewDialog } from "@/components/nl-query/RecordViewDialog";
import { useAgentStreaming } from "@/hooks/useAgentStreaming";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useDatasourceEntities } from "@/hooks/metadata/use-metadata-queries";
import { drillableColumnSet, parseColumnTableMap } from "@/lib/utils/sql-column-map";
import type { SQLExecutionResponse } from "@/types/api";
import type { ChartType, DataMapping, EChartsConfig } from "@/types/charts";
import type { MetadataEntityWithFields } from "@/types/database";

export const Route = createFileRoute("/_authed/nl-query/")({
  component: NlQueryPage,
});

const CHART_TYPES: { value: ChartType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "bar", label: "Bar", icon: BarChart3 },
  { value: "line", label: "Line", icon: LineChart },
  { value: "area", label: "Area", icon: BarChart3 },
  { value: "pie", label: "Pie", icon: PieChart },
  { value: "scatter", label: "Scatter", icon: ScatterChart },
];

const NUMERIC_TYPES = new Set([
  "integer", "int", "int2", "int4", "int8", "bigint", "smallint",
  "numeric", "decimal", "real", "float", "float4", "float8",
  "double precision", "money", "number",
]);

function isNumeric(typeName: string): boolean {
  return NUMERIC_TYPES.has(typeName.toLowerCase().trim());
}

function autoDetectMapping(result: SQLExecutionResponse): DataMapping {
  const cols = result.columns ?? [];
  if (cols.length === 0) return {};
  const numericCols = cols.filter((c) => isNumeric(c.type)).map((c) => c.name);
  const categoryCols = cols.filter((c) => !isNumeric(c.type)).map((c) => c.name);
  const x = categoryCols[0] ?? cols[0].name;
  const yRaw = numericCols.length > 0 ? numericCols : cols.filter((c) => c.name !== x).map((c) => c.name);
  const y = yRaw.length === 1 ? yRaw[0] : yRaw.length > 1 ? yRaw : cols[cols.length - 1].name;
  return { x, y };
}

interface HistoryEntry {
  id: string;
  nl_question: string;
  generated_sql: string;
  data_source_id: string;
  data_source_name?: string | null;
  role_name: string;
  was_successful: boolean;
  row_count: number | null;
  created_at: string;
}

function SectionHeader({
  title,
  isOpen,
  onToggle,
  badge,
  children,
}: {
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="w-full flex items-center justify-between px-4 py-3 sm:px-6 hover:bg-muted/30 transition-colors rounded-t-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset cursor-pointer"
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-2 min-w-0">
        {title}
        {badge}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {children}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

function NlQueryPage() {
  const [question, setQuestion] = useState("");
  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [editedSql, setEditedSql] = useState<string | null>(null);
  const [isEditingSQL, setIsEditingSQL] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[] | null>(null);
  const [queryResult, setQueryResult] = useState<SQLExecutionResponse | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [useStreaming] = useState(true);

  // Collapsible section state
  const [queryBuilderOpen, setQueryBuilderOpen] = useState(true);
  const [resultsOpen, setResultsOpen] = useState(true);

  // Result view state
  const [resultView, setResultView] = useState<"table" | "chart">("table");
  const [sqlOffset, setSqlOffset] = useState(0);

  // Drill-down state
  const [drillRow, setDrillRow] = useState<Record<string, unknown> | null>(null);
  const [drillEntity, setDrillEntity] = useState<MetadataEntityWithFields | null>(null);

  // Chart config state
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [xCol, setXCol] = useState<string>("");
  const [yCol, setYCol] = useState<string>("");

  // Streaming state
  const {
    steps,
    isStreaming,
    streamGenerateSQL,
    clearSteps,
  } = useAgentStreaming();

  // Voice input
  const { mode: voiceMode, isRecording, isTranscribing, interimText, error: voiceError, startRecording, stopAndTranscribe, cancelRecording } =
    useVoiceRecording({
      onTranscription: (text) => {
        setQuestion((prev) => (prev ? `${prev} ${text}` : text));
        toast.success("Voice captured — review and click Generate SQL");
      },
      onError: (msg) => toast.error(msg),
    });

  const { data: dataSources = [], isLoading: isLoadingDs } = useQuery({
    queryKey: ["nl-query-data-sources"],
    queryFn: async () => {
      const res = await fetch("/api/data-sources?inspected=true");
      if (!res.ok) return [];
      const json = await res.json();
      const items = json.data?.items || json.items || [];
      return items as { id: string; name: string; client_type: string; last_inspected_at?: string | null }[];
    },
  });

  const [selectedDsId, setSelectedDsId] = useState<string>("");
  const dataSourceId = selectedDsId || dataSources[0]?.id || null;

  // Load entities for the active data source so we can match query tables to metadata
  const { data: dsEntitiesData } = useDatasourceEntities(dataSourceId ?? "", {
    includeFields: true,
    activeOnly: true,
  });
  const dsEntities = (dsEntitiesData?.data?.entities ?? []) as MetadataEntityWithFields[];

  // Parse SQL to get column→table map for per-cell drill-down
  const colTableMap = useMemo(
    () => parseColumnTableMap(editedSql ?? generatedSql ?? ""),
    [editedSql, generatedSql],
  );

  // Set of entity table names known for this data source
  const entityTableNames = useMemo(
    () => new Set(dsEntities.map((e) => e.entity_name?.toLowerCase() ?? "")),
    [dsEntities],
  );

  // Which result columns support drill-down (excludes aggregates and unknown tables)
  const drillableCols = useMemo(
    () =>
      queryResult
        ? drillableColumnSet(
            colTableMap,
            queryResult.columns.map((c) => c.name),
            entityTableNames,
          )
        : new Set<string>(),
    [queryResult, colTableMap, entityTableNames],
  );

  // Map each drillable column name to its resolved entity
  const columnEntityMap = useMemo(() => {
    const map: Record<string, MetadataEntityWithFields> = {};
    const wildcard = colTableMap["*"];
    for (const colName of drillableCols) {
      const meta = colTableMap[colName.toLowerCase()] ?? wildcard;
      if (!meta?.tableName) continue;
      const entity = dsEntities.find(
        (e) => e.entity_name?.toLowerCase() === meta.tableName,
      );
      if (entity) map[colName] = entity;
    }
    return map;
  }, [drillableCols, colTableMap, dsEntities]);

  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ["nl-query-history", dataSourceId],
    queryFn: async () => {
      const params = new URLSearchParams({ scope: "role", limit: "20" });
      if (dataSourceId) params.set("data_source_id", dataSourceId);
      const res = await fetch(`/api/nl-query/history?${params}`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data ?? []) as HistoryEntry[];
    },
    enabled: showHistory,
  });

  const { mutate: saveToHistory, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const sql = editedSql ?? generatedSql;
      if (!sql || !question) throw new Error("No SQL to save");
      const res = await fetch("/api/nl-query/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nl_question: question,
          generated_sql: sql,
          data_source_id: dataSourceId,
          row_count: queryResult?.rowCount ?? 0,
          was_successful: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Saved to role history");
      refetchHistory();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Save failed"),
  });

  const { mutate: generateSQL, isPending: isGenerating } = useMutation({
    mutationFn: async (nlQuestion: string) => {
      if (useStreaming && dataSourceId) {
        const result = await streamGenerateSQL(nlQuestion, dataSourceId);
        if (!result) throw new Error("Failed to generate SQL via streaming");
        return result;
      } else {
        const res = await fetch("/api/copilotkit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/execute", input: { message: nlQuestion, dataSourceId } }),
        });
        if (!res.ok) throw new Error("Failed to generate SQL");
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to generate SQL");
        return data.result;
      }
    },
    onSuccess: (result) => {
      setGeneratedSql(result.sql);
      setEditedSql(null);
      setIsEditingSQL(false);
      setExplanation(result.explanation);
      setWarnings(result.warnings || []);
      setQueryResult(null);
      setQueryBuilderOpen(true);
      toast.success("SQL generated");
    },
    onError: (err) => {
      // Stop immediately — no auto-retry. User can click Retry manually.
      const msg = err instanceof Error ? err.message : "Failed to generate SQL";
      toast.error(msg);
      if (!generatedSql) {
        setGeneratedSql("-- Could not generate SQL automatically.\n-- Please write your query here:\nSELECT ");
        setIsEditingSQL(true);
      }
      console.error("[NL Query] Generation stopped:", err);
    },
  });

  const { mutate: executeSQL, isPending: isExecuting } = useMutation({
    mutationFn: async ({ sql, offset = 0 }: { sql: string; offset?: number }) => {
      const res = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataSourceId, sql, limit: 100, offset }),
      });
      if (!res.ok) throw new Error("Failed to execute SQL");
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Execution failed");
      return json.data as SQLExecutionResponse;
    },
    onSuccess: (data) => {
      setQueryResult(data);
      const mapping = autoDetectMapping(data);
      setXCol(mapping.x as string ?? "");
      setYCol(typeof mapping.y === "string" ? mapping.y : Array.isArray(mapping.y) ? mapping.y[0] : "");
      setResultView("table");
      // Collapse query builder, expand results
      setQueryBuilderOpen(false);
      setResultsOpen(true);
      toast.success(`${data.rowCount} row${data.rowCount !== 1 ? "s" : ""} returned`);
    },
    onError: (err) => {
      // Clear any previous result so save is disabled until a new execution succeeds
      setQueryResult(null);
      toast.error(err instanceof Error ? err.message : "SQL execution failed");
      setIsEditingSQL(true);
    },
  });

  const activeSql = editedSql ?? generatedSql;

  const handlePageChange = (offset: number) => {
    setSqlOffset(offset);
    if (activeSql) executeSQL({ sql: activeSql, offset });
  };

  const chartConfig: EChartsConfig = {
    type: chartType,
    title: question || "Query Result",
    dataMapping: { x: xCol || undefined, y: yCol || undefined } satisfies DataMapping,
    legend: true,
    tooltip: true,
  };

  const allColumns = queryResult?.columns ?? [];

  return (
    <div className="space-y-4 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Natural Language Query</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ask questions in plain English and AI converts them to SQL
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1.5 self-start"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden xs:inline">Role </span>History
          {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {/* Role History panel */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Saved SQL History (your role)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!historyData || historyData.length === 0 ? (
              <p className="px-6 pb-4 text-sm text-muted-foreground">
                No history yet. Run and save a query to see it here.
              </p>
            ) : (
              <div className="divide-y max-h-64 overflow-y-auto">
                {historyData.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="w-full text-left px-4 sm:px-6 py-3 hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setQuestion(entry.nl_question);
                      setGeneratedSql(entry.generated_sql);
                      setEditedSql(null);
                      setIsEditingSQL(false);
                      setQueryResult(null);
                      setQueryBuilderOpen(true);
                      toast.success("Query loaded from history");
                    }}
                  >
                    <p className="text-sm font-medium truncate">{entry.nl_question}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                      {entry.generated_sql.slice(0, 60)}…
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">{entry.role_name}</Badge>
                      {entry.data_source_name && (
                        <Badge variant="secondary" className="text-xs">{entry.data_source_name}</Badge>
                      )}
                      {entry.row_count != null && (
                        <span className="text-xs text-muted-foreground">{entry.row_count} rows</span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isLoadingDs ? (
        <Card>
          <CardContent className="pt-6 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading data sources...
          </CardContent>
        </Card>
      ) : dataSources.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                A data source must be configured and inspected before using NL Query. Go to{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => (window.location.href = "/data-sources")}>
                  Data Sources
                </Button>
                {" "}to add a data source and run Inspect Schema on it.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ── Query Builder (collapsible) ── */}
          <Card className="overflow-hidden">
            <SectionHeader
              title={
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Query Builder
                </CardTitle>
              }
              isOpen={queryBuilderOpen}
              onToggle={() => setQueryBuilderOpen((o) => !o)}
              badge={
                generatedSql && !queryBuilderOpen ? (
                  <Badge variant="secondary" className="text-xs font-normal truncate max-w-[160px] sm:max-w-xs">
                    {question.slice(0, 40)}{question.length > 40 ? "…" : ""}
                  </Badge>
                ) : null
              }
            />

            {queryBuilderOpen && (
              <CardContent className="space-y-4 pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                <Select value={selectedDsId || dataSources[0]?.id || ""} onValueChange={setSelectedDsId}>
                  <SelectTrigger className="w-full sm:w-80">
                    <SelectValue placeholder="Select inspected data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((ds) => (
                      <SelectItem key={ds.id} value={ds.id}>
                        <span className="flex flex-col">
                          <span>{ds.name}</span>
                          {ds.last_inspected_at && (
                            <span className="text-xs text-muted-foreground">
                              Inspected {new Date(ds.last_inspected_at).toLocaleString()}
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Question input with inline mic button */}
                <div className="relative">
                  <Textarea
                    placeholder={
                      isRecording && voiceMode === "web-speech"
                        ? interimText || "Listening… speak your question"
                        : isRecording
                          ? "Recording… tap mic again to stop"
                          : isTranscribing
                            ? "Transcribing with Whisper…"
                            : "e.g. Show me the top 10 patients by number of admissions"
                    }
                    value={isRecording && voiceMode === "web-speech" && interimText ? interimText : question}
                    onChange={(e) => {
                      if (!isRecording) setQuestion(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        if (question.trim() && !isGenerating) generateSQL(question);
                      }
                    }}
                    disabled={isGenerating || isTranscribing || voiceMode === "unavailable"}
                    readOnly={isRecording && voiceMode === "web-speech"}
                    className={`min-h-20 resize-none text-base pr-12 transition-colors${
                      isRecording ? " border-red-400 bg-red-50/40 dark:border-red-700 dark:bg-red-950/20" : ""
                    }`}
                  />
                  {/* Mic button — hidden if voice is unavailable */}
                  {voiceMode !== "unavailable" && (
                    <button
                      type="button"
                      aria-label={isRecording ? "Stop recording" : "Start voice input"}
                      title={
                        isRecording
                          ? "Tap to stop and confirm"
                          : voiceMode === "web-speech"
                            ? "Voice input (browser speech recognition)"
                            : "Voice input (Ollama Whisper)"
                      }
                      disabled={isGenerating || isTranscribing}
                      onClick={isRecording ? stopAndTranscribe : startRecording}
                      onContextMenu={(e) => { e.preventDefault(); if (isRecording) cancelRecording(); }}
                      className={`absolute right-2 bottom-2.5 rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                        isRecording
                          ? "bg-red-500 text-white shadow-lg animate-pulse"
                          : isTranscribing
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {isTranscribing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isRecording ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Recording / transcribing / error status strip */}
                {(isRecording || isTranscribing || voiceError) && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${
                    voiceError
                      ? "bg-destructive/10 text-destructive"
                      : isRecording
                        ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isRecording && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />}
                    {isTranscribing && <Loader2 className="h-3 w-3 animate-spin shrink-0" />}
                    <span>
                      {voiceError
                        ? voiceError
                        : isRecording && voiceMode === "web-speech"
                          ? "Listening — tap mic to confirm, right-tap to cancel"
                          : isRecording
                            ? "Recording — tap mic to stop, right-tap to cancel"
                            : "Transcribing audio via Ollama Whisper…"}
                    </span>
                  </div>
                )}
                <Button
                  onClick={() => question.trim() && generateSQL(question)}
                  disabled={isGenerating || !question.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating SQL…
                    </>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" />Generate SQL</>
                  )}
                </Button>

                {/* Agent Execution Steps */}
                {(steps.length > 0 || isStreaming) && (
                  <AgentStepsDisplay
                    steps={steps}
                    isActive={useStreaming && (isStreaming || steps.length > 0)}
                    onClear={clearSteps}
                  />
                )}

                {/* Generated / Editable SQL */}
                {generatedSql && (
                  <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-1.5 text-green-900 dark:text-green-400 font-medium text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Generated SQL
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setIsEditingSQL(!isEditingSQL)}
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1" />
                          {isEditingSQL ? "Preview" : "Edit"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(activeSql ?? "");
                            toast.success("Copied");
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="p-3">
                      {isEditingSQL ? (
                        <Textarea
                          value={editedSql ?? generatedSql}
                          onChange={(e) => setEditedSql(e.target.value)}
                          className="font-mono text-xs sm:text-sm min-h-28 bg-slate-900 text-green-400 border-slate-700"
                          spellCheck={false}
                        />
                      ) : (
                        <pre className="overflow-x-auto rounded bg-slate-900 px-3 py-2 text-xs sm:text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
                          {activeSql}
                        </pre>
                      )}

                      {explanation && !isEditingSQL && (
                        <p className="text-xs text-green-800 dark:text-green-300 mt-2">{explanation}</p>
                      )}

                      {warnings && warnings.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {warnings.map((w, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{w}</Badge>
                          ))}
                        </div>
                      )}

                      {/* Action buttons — stacked on mobile, row on sm+ */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Button
                          onClick={() => { if (activeSql) { setSqlOffset(0); executeSQL({ sql: activeSql, offset: 0 }); } }}
                          disabled={isExecuting || !dataSourceId || !activeSql}
                          className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                          size="lg"
                        >
                          {isExecuting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Executing...</>
                          ) : (
                            <><Play className="mr-2 h-4 w-4" />Execute Query</>
                          )}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={() => question.trim() && generateSQL(question)}
                            disabled={isGenerating || !question.trim()}
                            title="Retry generation"
                          >
                            <RotateCcw className="h-4 w-4 mr-1.5 sm:mr-0" />
                            <span className="sm:hidden">Retry</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={() => saveToHistory()}
                            disabled={isSaving || !activeSql || !queryResult}
                            title={!queryResult ? "Execute the query successfully first" : "Save to role history"}
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 mr-1.5 sm:mr-0 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 mr-1.5 sm:mr-0" />
                            )}
                            <span className="sm:hidden">Save</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* ── Results (collapsible) ── */}
          {queryResult && (
            <Card className="overflow-hidden">
              <SectionHeader
                title={
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Table2 className="h-4 w-4" />
                    Results
                  </CardTitle>
                }
                isOpen={resultsOpen}
                onToggle={() => setResultsOpen((o) => !o)}
                badge={
                  <Badge variant="outline" className="text-xs">
                    {(queryResult.pagination?.totalRows ?? queryResult.rowCount).toLocaleString()} row{(queryResult.pagination?.totalRows ?? queryResult.rowCount) !== 1 ? "s" : ""}
                  </Badge>
                }
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={(e) => { e.stopPropagation(); saveToHistory(); }}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline ml-1">Save</span>
                </Button>
              </SectionHeader>

              {resultsOpen && (
                <>
                  {/* View selector — mobile-friendly */}
                  <div className="px-4 sm:px-6 py-3 border-b bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      View as
                    </p>

                    {/* Mobile: dropdown selector */}
                    <div className="sm:hidden">
                      <Select
                        value={resultView === "table" ? "table" : chartType}
                        onValueChange={(v) => {
                          if (v === "table") {
                            setResultView("table");
                          } else {
                            setChartType(v as ChartType);
                            setResultView("chart");
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="table">
                            <div className="flex items-center gap-2">
                              <Table2 className="h-4 w-4" />
                              Table
                            </div>
                          </SelectItem>
                          {CHART_TYPES.map(({ value, label, icon: Icon }) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {label} Chart
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Desktop: button group */}
                    <div className="hidden sm:flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        variant={resultView === "table" ? "default" : "outline"}
                        onClick={() => setResultView("table")}
                        className="h-8"
                      >
                        <Table2 className="h-3.5 w-3.5 mr-1.5" />
                        Table
                      </Button>
                      {CHART_TYPES.map(({ value, label, icon: Icon }) => (
                        <Button
                          key={value}
                          size="sm"
                          variant={resultView === "chart" && chartType === value ? "default" : "outline"}
                          onClick={() => { setChartType(value); setResultView("chart"); }}
                          className="h-8"
                        >
                          <Icon className="h-3.5 w-3.5 mr-1.5" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <CardContent className="p-0">
                    {resultView === "table" ? (
                      <div style={{ height: "min(480px, 60vh)" }} className="min-h-[200px]">
                        <QueryResults
                          result={queryResult}
                          onPageChange={handlePageChange}
                          drillableColumns={drillableCols.size > 0 ? drillableCols : undefined}
                          onCellClick={drillableCols.size > 0 ? (row, colName) => {
                            const entity = columnEntityMap[colName];
                            if (entity) {
                              setDrillRow(row);
                              setDrillEntity(entity);
                            }
                          } : undefined}
                        />
                        {drillableCols.size > 0 && (
                          <p className="text-xs text-muted-foreground px-3 pb-2 pt-1">
                            Tap a highlighted cell to view its record details
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        {/* Axis selectors — stacked on mobile */}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                          {chartType !== "pie" && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground w-12 shrink-0">X axis</span>
                              <Select value={xCol} onValueChange={setXCol}>
                                <SelectTrigger className="flex-1 sm:w-44">
                                  <SelectValue placeholder="Column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {allColumns.map((c) => (
                                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-12 shrink-0">
                              {chartType === "pie" ? "Value" : "Y axis"}
                            </span>
                            <Select value={yCol} onValueChange={setYCol}>
                              <SelectTrigger className="flex-1 sm:w-44">
                                <SelectValue placeholder="Column" />
                              </SelectTrigger>
                              <SelectContent>
                                {allColumns.map((c) => (
                                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {xCol && yCol ? (
                          <EChartsRenderer
                            config={chartConfig}
                            data={queryResult.rows}
                            height={Math.min(320, Math.max(220, window.innerHeight * 0.4))}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-36 text-muted-foreground text-sm text-center px-4">
                            Select columns above to render the chart
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </>
              )}
            </Card>
          )}

          {/* How it works */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm text-muted-foreground pb-4">
              {[
                ["1", "Ask a question in plain English"],
                ["2", "AI generates SQL using the database schema — use Retry if it fails"],
                ["3", "Edit the SQL manually if needed, then Execute"],
                ["4", "View results as a table or chart, save to role history"],
              ].map(([n, text]) => (
                <div key={n} className="flex items-start gap-2.5">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {n}
                  </span>
                  <span className="leading-snug">{text}</span>
                </div>
              ))}
              <Alert className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Requires Ollama running with <code className="bg-muted px-1 py-0.5 rounded">sqlcoder:7b</code> on port 11434.
                  Press <kbd className="bg-muted border rounded px-1">⌘ Enter</kbd> to generate.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
      {/* Record drill-down dialog */}
      {drillRow && drillEntity && dataSourceId && (
        <RecordViewDialog
          open={!!drillRow}
          onClose={() => { setDrillRow(null); setDrillEntity(null); }}
          dataSourceId={dataSourceId}
          entityId={drillEntity.id}
          record={drillRow}
          entityMeta={drillEntity}
        />
      )}
    </div>
  );
}
