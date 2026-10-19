"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Download, Loader2, ShieldAlert } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IntelligentView } from "@/components/intelligent-ui/intelligent-view";
import { inferColumnKinds, validateSpec, type ColumnKind, type ViewSpec } from "@/lib/intelligent-ui/spec";

interface ExecutedResult {
  question: string;
  sql: string;
  columns: string[];
  rows: Record<string, unknown>[];
  kinds: Record<string, ColumnKind>;
  executionTimeMs: number;
}

interface Denial {
  question: string;
  sql: string;
  message: string;
}

/** Split a comma-separated parameter into trimmed, non-empty names. */
function splitList(value: unknown): string[] | undefined {
  if (typeof value !== "string") return undefined;
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

export function IntelligentUiContent() {
  const [selectedDsId, setSelectedDsId] = useState<string>("");
  const [result, setResult] = useState<ExecutedResult | null>(null);
  const [denial, setDenial] = useState<Denial | null>(null);
  const [views, setViews] = useState<ViewSpec[]>([]);

  // Copilot handlers close over the render they were created in, so a renderView
  // called in the same turn as runQuestion would otherwise see the previous result.
  const resultRef = useRef<ExecutedResult | null>(null);

  const { data: dataSources = [], isLoading: isLoadingDs } = useQuery({
    queryKey: ["intelligent-ui-data-sources"],
    queryFn: async () => {
      const res = await fetch("/api/data-sources?inspected=true");
      if (!res.ok) return [];
      const json = await res.json();
      let items = json.data?.items || json.items || [];
      if (items.length === 0) {
        const allRes = await fetch("/api/data-sources");
        if (allRes.ok) {
          const allJson = await allRes.json();
          items = allJson.data?.items || allJson.items || [];
        }
      }
      return items as { id: string; name: string; client_type: string }[];
    },
  });

  const dataSourceId = selectedDsId || dataSources[0]?.id || null;
  const selectedDs = dataSources.find((ds) => ds.id === dataSourceId);

  const { data: schemaContext } = useQuery({
    queryKey: ["nl-query-schema", dataSourceId],
    queryFn: async () => {
      if (!dataSourceId) return null;
      const res = await fetch(`/api/nl-query/schema?data_source_id=${dataSourceId}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data as { schemaText: string } | null;
    },
    enabled: !!dataSourceId,
    staleTime: 5 * 60 * 1000,
  });

  const clearResult = useCallback(() => {
    resultRef.current = null;
    setResult(null);
    setDenial(null);
    setViews([]);
  }, []);

  useCopilotReadable({
    description: "Data source and schema context",
    value: {
      dataSourceId,
      dsName: selectedDs?.name ?? "none",
      dsType: selectedDs?.client_type ?? "pg",
      schema: schemaContext?.schemaText ?? "Loading...",
    },
  });

  useCopilotAction({
    name: "fetchSimilarQueries",
    description:
      "Fetch RAG context: similar past queries and relevant table schemas. Call this ONCE as the first step, then call runQuestion.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The natural language question to find similar context for",
        required: true,
      },
    ],
    handler: async ({ query }) => {
      if (!dataSourceId) return { context: "" };
      try {
        const res = await fetch("/api/nl-query/rag-context", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            data_source_id: dataSourceId,
            context_budget: 4000,
            top_k_queries: 3,
          }),
        });
        const json = await res.json();
        if (json.success && json.data) return { context: json.data.contextText || "" };
        return { context: "No similar queries found. Use the table names from schema." };
      } catch {
        return { context: "RAG unavailable. Use table names from schema." };
      }
    },
  });

  useCopilotAction({
    name: "runQuestion",
    description:
      "Run the SQL you generated for the user's question. The same entity-level permission checks as the NL Query page apply, and a denial is final. On success you receive the column names and types and the row count — never the rows. Then call renderView to present the result.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The user's natural language question",
        required: true,
      },
      {
        name: "generatedSql",
        type: "string",
        description:
          "A single read-only SELECT using only tables and columns from the schema context, exactly as spelled there",
        required: true,
      },
    ],
    render: ({ status, args, result }) => {
      if (status !== "complete") {
        return (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Running: &quot;{args.query}&quot;...</span>
          </div>
        );
      }
      const outcome = result as { error?: string; rowCount?: number } | undefined;
      if (outcome?.error) {
        return (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="text-sm">{outcome.error}</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span className="text-sm">Query returned {outcome?.rowCount ?? 0} rows.</span>
        </div>
      );
    },
    handler: async ({ query, generatedSql }) => {
      if (!dataSourceId) return { error: "No data source is available." };

      clearResult();
      try {
        const res = await fetch("/api/nl-query/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            data_source_id: dataSourceId,
            generated_sql: generatedSql,
          }),
        });
        const json = await res.json();
        if (!json.success) return { error: json.error?.message || "Query execution failed" };

        const pipeline = json.data;
        if (!pipeline?.accessGranted || !pipeline.queryResults) {
          const message = pipeline?.error || "The query was not run.";
          setDenial({ question: query, sql: generatedSql, message });
          return { accessDenied: !pipeline?.accessGranted, error: message };
        }

        const columns: string[] = pipeline.queryResults.columns ?? [];
        const rows: Record<string, unknown>[] = pipeline.queryResults.rows ?? [];
        const kinds = inferColumnKinds(columns, rows);
        const executed: ExecutedResult = {
          question: query,
          sql: pipeline.generatedSql ?? generatedSql,
          columns,
          rows,
          kinds,
          executionTimeMs: pipeline.queryResults.executionTimeMs ?? 0,
        };
        resultRef.current = executed;
        setResult(executed);

        // Architecture B: the model learns the shape of the result, never its contents.
        return {
          columns: columns.map((name) => ({ name, kind: kinds[name] })),
          rowCount: rows.length,
        };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Query execution failed" };
      }
    },
  });

  useCopilotAction({
    name: "renderView",
    description:
      "Present the current result as a view. Only columns returned by runQuestion may be used. The application computes every figure itself. You may call this several times for different views of the same result.",
    parameters: [
      {
        name: "view",
        type: "string",
        description: "One of: table, bar, line, area, pie, kpi",
        required: true,
      },
      { name: "title", type: "string", description: "Short view title", required: false },
      {
        name: "x",
        type: "string",
        description: "Category column (bar, line, area, pie)",
        required: false,
      },
      {
        name: "y",
        type: "string",
        description: "Comma-separated value columns (one for pie and kpi)",
        required: false,
      },
      {
        name: "aggregation",
        type: "string",
        description: "One of: sum, avg, count, min, max. Groups by x (kpi: over all rows)",
        required: false,
      },
      {
        name: "sortField",
        type: "string",
        description: "Column to sort by",
        required: false,
      },
      { name: "sortDirection", type: "string", description: "asc or desc", required: false },
      {
        name: "limit",
        type: "number",
        description: "Maximum rows to show (at most 500)",
        required: false,
      },
      {
        name: "filters",
        type: "string",
        description:
          'JSON array like [{"field":"region","op":"eq","value":"South"}]. ops: eq, neq, gt, gte, lt, lte, contains',
        required: false,
      },
    ],
    render: ({ status, args, result }) => {
      if (status !== "complete") {
        return (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Building view...</span>
          </div>
        );
      }
      // The handler refuses a view that does not fit the result; saying "added" over a
      // refusal would tell the reader something is on the page that is not.
      const outcome = result as { errors?: string[] } | undefined;
      if (outcome?.errors?.length) {
        return (
          <div className="p-3 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200 rounded-lg text-sm">
            <div className="font-medium">
              {args.title ? `"${args.title}" was not added` : "The view was not added"}
            </div>
            <ul className="mt-1 list-disc pl-5">
              {outcome.errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span className="text-sm">
            {args.title ? `Added "${args.title}" to the page.` : "View added to the page."}
          </span>
        </div>
      );
    },
    handler: async (args) => {
      const current = resultRef.current;
      if (!current) return { errors: ["No result yet. Call runQuestion first."] };

      let filters: unknown;
      if (args.filters) {
        try {
          filters = JSON.parse(args.filters);
        } catch {
          return { errors: ["filters must be a JSON array"] };
        }
      }

      const validation = validateSpec(
        {
          view: args.view,
          title: args.title || undefined,
          x: args.x || undefined,
          y: splitList(args.y),
          aggregation: args.aggregation || undefined,
          sort: args.sortField
            ? { field: args.sortField, direction: args.sortDirection || "desc" }
            : undefined,
          limit: args.limit || undefined,
          filters,
        },
        current.columns,
        current.kinds
      );

      if (!validation.ok) return { errors: validation.errors };

      setViews((prev) => [...prev, validation.spec]);
      return { success: true };
    },
  });

  const [isExporting, setIsExporting] = useState(false);

  // The server re-runs the query under this user's permissions and rebuilds every view
  // itself; only the question, SQL and view specs are sent, never rows.
  const exportExcel = useCallback(async () => {
    if (!result || !dataSourceId) return;
    setIsExporting(true);
    try {
      const res = await fetch("/api/intelligent-ui/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: result.question,
          data_source_id: dataSourceId,
          generated_sql: result.sql,
          views,
        }),
      });

      if (!res.ok) {
        let message = `Export failed (${res.status})`;
        try {
          const body = await res.json();
          const details = body.error?.details?.errors as string[] | undefined;
          message = [body.error?.message, ...(details ?? [])].filter(Boolean).join(" — ") || message;
        } catch {
          // Non-JSON error body: the status line above is all there is to report.
        }
        toast.error(message);
        return;
      }

      const blob = await res.blob();
      const filename =
        /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ??
        "intelligent-ui.xlsx";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  }, [result, dataSourceId, views]);

  const onDataSourceChange = (id: string) => {
    setSelectedDsId(id);
    clearResult();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Intelligent UI</h1>
          <p className="text-sm text-muted-foreground">
            Views are built only from the result of a query you are permitted to run.
          </p>
        </div>
        <Select value={dataSourceId ?? ""} onValueChange={onDataSourceChange}>
          <SelectTrigger className="w-64" disabled={isLoadingDs}>
            <SelectValue placeholder={isLoadingDs ? "Loading..." : "Select a data source"} />
          </SelectTrigger>
          <SelectContent>
            {dataSources.map((ds) => (
              <SelectItem key={ds.id} value={ds.id}>
                {ds.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {denial && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            <div>{denial.message}</div>
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer">SQL that was refused</summary>
              <pre className="mt-1 whitespace-pre-wrap">{denial.sql}</pre>
            </details>
          </AlertDescription>
        </Alert>
      )}

      {!result && !denial && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ask a question in the assistant. The page fills in once a query has run.
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">
              {result.question} · {result.rows.length} rows · {result.executionTimeMs}ms
            </span>
            <Button variant="outline" size="sm" onClick={exportExcel} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Excel
            </Button>
          </div>
          <details className="rounded-md border p-2 text-xs">
            <summary className="cursor-pointer">Generated SQL</summary>
            <pre className="mt-1 whitespace-pre-wrap">{result.sql}</pre>
          </details>

          {views.length === 0 && (
            <p className="text-sm text-muted-foreground">
              The query returned. Ask the assistant to show it as a table or chart.
            </p>
          )}

          {views.map((spec, index) => (
            <IntelligentView
              key={`${index}-${spec.view}-${spec.title ?? ""}`}
              spec={spec}
              columns={result.columns}
              rows={result.rows}
              onRemove={() => {
                setViews((prev) => prev.filter((_, i) => i !== index));
                toast.success("View removed");
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
