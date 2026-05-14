import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonacoSQLEditorWrapper } from "@/components/sql-editor/monaco-editor-wrapper";
import { QueryResults } from "@/components/sql-editor/query-results";
import { SchemaBrowser } from "@/components/sql-editor/schema-browser";
import { sqlEditorConfig } from "@/lib/config/pagination";
import type { SQLExecutionResponse } from "@/types/api";
import type { DataSource } from "@/types/database";

export const Route = createFileRoute("/_authed/sql-editor")({
  component: SQLEditorPage,
});

function SQLEditorPage() {
  const search = Route.useSearch() as { queryId?: string };
  const queryClient = useQueryClient();
  const [sqlContent, setSqlContent] = useState("SELECT * FROM actor LIMIT 10;");
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");
  const [queryResult, setQueryResult] = useState<SQLExecutionResponse | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: Array<{ message: string; line?: number; column?: number }>;
    warnings: Array<{ message: string; type: string }>;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [dataSourceCollapsed, setDataSourceCollapsed] = useState(false);
  const [schemaBrowserCollapsed, setSchemaBrowserCollapsed] = useState(false);

  const [accumulatedRows, setAccumulatedRows] = useState<Record<string, unknown>[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [_totalRows, setTotalRows] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, _setIsLoadingMore] = useState(false);
  const [warning, setWarning] = useState<{ message: string; suggestion: string } | null>(null);

  const [saveQueryModal, setSaveQueryModal] = useState(false);
  const [queryName, setQueryName] = useState("");
  const [queryDescription, setQueryDescription] = useState("");
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);

  // Load query from URL parameter
  useEffect(() => {
    const queryId = search.queryId;
    if (queryId) {
      setEditingQueryId(queryId);
      fetch(`/api/queries/${queryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const query = data.data;
            setSqlContent(query.sql_content);
            setSelectedDataSource(query.data_source_id);
            setQueryName(query.name);
            setQueryDescription(query.description || "");
          }
        })
        .catch((error) => {
          console.error("Failed to load query:", error);
        });
    } else {
      setEditingQueryId(null);
    }
  }, [search.queryId]);

  const [activeTab, setActiveTab] = useState<"results" | "errors" | "logs">("results");
  const [queryLogs, setQueryLogs] = useState<string[]>([]);

  const saveQueryMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const url = editingQueryId ? `/api/queries/${editingQueryId}` : "/api/queries";
      const method = editingQueryId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          dataSourceId: selectedDataSource,
          sqlContent: sqlContent,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setSaveQueryModal(false);
        setQueryName("");
        setQueryDescription("");
        if (!editingQueryId && data.data?.id) {
          setEditingQueryId(data.data.id);
        }
      }
    },
  });

  const { data: dataSources, isLoading: isLoadingDataSources } = useQuery<DataSource[]>({
    queryKey: ["data-sources", "active"],
    queryFn: async () => {
      const res = await fetch("/api/data-sources");
      const data = await res.json();
      const sources = data.items || data.data?.items || [];
      return sources.filter((ds: DataSource) => ds.is_active);
    },
    staleTime: 60000,
    gcTime: 300000,
  });

  const { data: schema, isLoading: isLoadingSchema } = useQuery<{
    tables: Record<string, unknown>[];
    views: Record<string, unknown>[];
    logs?: string[];
    warning?: string;
  }>({
    queryKey: ["schema", selectedDataSource],
    queryFn: async () => {
      const res = await fetch(`/api/sql/schema/${selectedDataSource}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to load schema");
      if (!data.success) throw new Error(data.error?.message || "Failed to load schema");
      return data.data;
    },
    enabled: !!selectedDataSource,
    retry: false,
    staleTime: 300000,
    gcTime: 600000,
  });

  const executeMutation = useMutation({
    mutationFn: async ({ sql }: { sql: string }) => {
      const res = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql,
          dataSourceId: selectedDataSource,
          limit: sqlEditorConfig.serverPageSize,
          offset: 0,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      const timestamp = new Date().toISOString();
      setQueryLogs((prev) => [`[${timestamp}] Executing query...`, ...prev]);
      if (data.success) {
        const result = data.data;
        if (result.warning) {
          setWarning(result.warning);
          setQueryResult(null);
          setExecutionError(null);
          setAccumulatedRows([]);
          setCurrentOffset(0);
          setTotalRows(null);
          setHasMore(false);
          setQueryLogs((prev) => [`[${timestamp}] Warning: ${result.warning.message}`, ...prev]);
          setActiveTab("logs");
        } else {
          setAccumulatedRows(result.rows || []);
          setCurrentOffset(0);
          setTotalRows(result.totalRows || null);
          setHasMore(result.pagination?.hasMore || false);
          setWarning(null);
          setExecutionError(null);
          setQueryResult({ ...result, rows: result.rows || [] });
          setQueryLogs((prev) => [
            `[${timestamp}] Query executed successfully`,
            `[${timestamp}] Returned ${result.rowCount} rows${result.totalRows ? ` of ${result.totalRows} total` : ""} in ${result.executionTime}ms`,
            ...prev,
          ]);
          setActiveTab("results");
        }
      } else {
        setExecutionError(data.error?.message || "Query execution failed");
        setQueryResult(null);
        setWarning(null);
        setQueryLogs((prev) => [
          `[${timestamp}] Error: ${data.error?.message || "Query execution failed"}`,
          ...prev,
        ]);
        setActiveTab("errors");
      }
    },
    onError: (error) => {
      const timestamp = new Date().toISOString();
      setExecutionError(error instanceof Error ? error.message : "Unknown error");
      setQueryResult(null);
      setWarning(null);
      setQueryLogs((prev) => [
        `[${timestamp}] Exception: ${error instanceof Error ? error.message : "Unknown error"}`,
        ...prev,
      ]);
      setActiveTab("errors");
    },
  });

  const loadMoreMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDataSource || !sqlContent) throw new Error("No data source or query");
      const nextOffset = currentOffset + (accumulatedRows.length || 0);
      const res = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: sqlContent,
          dataSourceId: selectedDataSource,
          limit: sqlEditorConfig.serverPageSize,
          offset: nextOffset,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && !data.data.warning) {
        const newRows = data.data.rows || [];
        const nextOffset = currentOffset + accumulatedRows.length;
        setAccumulatedRows((prev) => [...prev, ...newRows]);
        setCurrentOffset(nextOffset);
        setHasMore(data.data.pagination?.hasMore || false);
        setTotalRows(data.data.pagination?.totalRows || null);
        setQueryResult((prev) =>
          prev
            ? {
                ...prev,
                rows: [...accumulatedRows, ...newRows],
                rowCount: [...accumulatedRows, ...newRows].length,
              }
            : null
        );
      }
    },
  });

  const _handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && accumulatedRows.length < sqlEditorConfig.maxClientRows) {
      loadMoreMutation.mutate();
    }
  }, [hasMore, isLoadingMore, accumulatedRows.length, loadMoreMutation.mutate]);

  const handleExecute = useCallback(() => {
    if (!selectedDataSource) {
      setExecutionError("Please select a data source");
      return;
    }
    executeMutation.mutate({ sql: sqlContent });
  }, [sqlContent, selectedDataSource, executeMutation]);

  const handleRefreshSchema = useCallback(() => {
    if (selectedDataSource) {
      queryClient.invalidateQueries({ queryKey: ["schema", selectedDataSource] });
    }
  }, [selectedDataSource, queryClient]);

  const handlePageChange = useCallback(
    async (offset: number) => {
      if (!selectedDataSource || !sqlContent) return;
      const res = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: sqlContent,
          dataSourceId: selectedDataSource,
          limit: sqlEditorConfig.serverPageSize,
          offset,
        }),
      });
      const data = await res.json();
      if (data.success && !data.data.warning) {
        setQueryResult({ ...data.data, rows: data.data.rows || [] });
        setCurrentOffset(offset);
        setHasMore(data.data.pagination?.hasMore || false);
      }
    },
    [sqlContent, selectedDataSource]
  );

  const handleValidate = useCallback(async () => {
    if (!sqlContent.trim()) {
      setValidationResult({
        isValid: false,
        errors: [{ message: "SQL query cannot be empty" }],
        warnings: [],
      });
      return;
    }
    setIsValidating(true);
    try {
      const res = await fetch("/api/sql/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: sqlContent, dataSourceId: selectedDataSource }),
      });
      const data = await res.json();
      if (data.success) {
        setValidationResult(data.data);
      } else {
        setValidationResult({
          isValid: false,
          errors: [{ message: data.error?.message || "Validation failed" }],
          warnings: [],
        });
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [{ message: error instanceof Error ? error.message : "Unknown error" }],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  }, [sqlContent, selectedDataSource]);

  const handleTableClick = (tableName: string) => {
    setSqlContent(`SELECT * FROM ${tableName} LIMIT 100;`);
  };

  const handleColumnClick = (tableName: string, columnName: string) => {
    setSqlContent((prev) => {
      const insertion = `${tableName}.${columnName}`;
      return prev + (prev.endsWith(" ") || prev.endsWith("\n") ? "" : " ") + insertion;
    });
  };

  const handleSaveQuery = () => {
    if (!queryName.trim()) return;
    saveQueryMutation.mutate({ name: queryName, description: queryDescription });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">SQL Editor</h1>
          <p className="text-muted-foreground">Write and execute SQL queries</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleValidate}
            disabled={isValidating}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? "Validating..." : "Validate"}
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={executeMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {executeMutation.isPending ? "Running..." : "Run Query"}
          </button>
          <button
            type="button"
            onClick={() => setSaveQueryModal(true)}
            disabled={!selectedDataSource || !sqlContent.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Query
          </button>
        </div>
      </div>

      {validationResult && (
        <div
          className={`mb-4 border rounded p-3 ${
            validationResult.isValid && validationResult.errors.length === 0
              ? "border-green-300 bg-green-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          {validationResult.isValid && validationResult.errors.length === 0 ? (
            <div className="text-sm text-green-700">
              <p className="font-medium">SQL is valid</p>
              {validationResult.warnings.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Warnings:</p>
                  <ul className="list-disc list-inside ml-2">
                    {validationResult.warnings.map((warning) => (
                      <li key={warning.message + (warning.type ?? "")} className="text-xs">
                        {warning.message} ({warning.type})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-red-700">
              <p className="font-medium">SQL has errors:</p>
              <ul className="list-disc list-inside ml-2">
                {validationResult.errors.map((error) => (
                  <li key={error.message + (error.line ?? "")}>
                    {error.message}
                    {error.line !== undefined && ` (line ${error.line})`}
                  </li>
                ))}
              </ul>
              {validationResult.warnings.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Warnings:</p>
                  <ul className="list-disc list-inside ml-2">
                    {validationResult.warnings.map((warning) => (
                      <li key={warning.message + (warning.type ?? "")} className="text-xs">
                        {warning.message} ({warning.type})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setValidationResult(null)}
            className="mt-2 text-xs underline text-gray-600 hover:text-gray-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {!dataSourceCollapsed ? (
        <div className="border rounded p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Data Source:</p>
            <button
              type="button"
              onClick={() => setDataSourceCollapsed(true)}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              ▲
            </button>
          </div>
          <div className="flex gap-2 items-center">
            {isLoadingDataSources && <p className="text-xs text-muted-foreground">Loading datasources...</p>}
            {!isLoadingDataSources && dataSources && dataSources.length > 0 && (
              <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a data source..." />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isLoadingDataSources && (!dataSources || dataSources.length === 0) && (
              <p className="text-xs text-red-600 dark:text-red-400">
                No data sources configured. <a href="/data-sources" className="underline hover:no-underline">Create one</a>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="border rounded p-2 mb-4">
          <button
            type="button"
            onClick={() => setDataSourceCollapsed(false)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 w-full"
          >
            <ChevronDown className="h-4 w-4" />
            <span className="font-medium">
              {selectedDataSource
                ? dataSources?.find((ds) => ds.id === selectedDataSource)?.name ||
                  "Select Data Source"
                : "Select Data Source"}
            </span>
          </button>
        </div>
      )}

      <MonacoSQLEditorWrapper
        value={sqlContent}
        onChange={setSqlContent}
        onExecute={handleExecute}
        height="400px"
        className="border"
        schema={null}
      />

      {!schemaBrowserCollapsed ? (
        <div className="mt-4 border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              Schema Browser (
              {isLoadingSchema
                ? "Loading..."
                : selectedDataSource
                  ? `${schema?.tables.length || 0} tables, ${schema?.views.length || 0} views`
                  : "Select a data source"}
              )
            </p>
            <div className="flex items-center gap-2">
              {selectedDataSource && (
                <button
                  type="button"
                  onClick={handleRefreshSchema}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </button>
              )}
              <button
                type="button"
                onClick={() => setSchemaBrowserCollapsed(true)}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                ▼
              </button>
            </div>
          </div>
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            {selectedDataSource ? (
              <SchemaBrowser
                schema={schema || null}
                isLoading={isLoadingSchema}
                onTableClick={handleTableClick}
                onColumnClick={handleColumnClick}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Select a data source to view schema</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 border rounded p-2">
          <button
            type="button"
            onClick={() => setSchemaBrowserCollapsed(false)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            <span>▲</span>
            <span className="font-medium">
              Schema Browser (
              {isLoadingSchema
                ? "Loading..."
                : selectedDataSource
                  ? `${schema?.tables.length || 0} tables, ${schema?.views.length || 0} views`
                  : "Select a data source"}
              )
            </span>
          </button>
        </div>
      )}

      <div className="mt-4 border rounded">
        <div className="flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "results"
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            Results
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("errors")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "errors"
                ? "bg-red-50 text-red-700 border-b-2 border-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            Errors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "logs"
                ? "bg-gray-50 text-gray-700 border-b-2 border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            Logs
          </button>
        </div>

        <div className="p-4">
          {activeTab === "results" && (
            <div>
              {queryResult && (
                <div className="space-y-2">
                  <div className="overflow-auto max-h-96">
                    <QueryResults
                      result={queryResult}
                      isLoading={false}
                      error={null}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              )}
              {!queryResult && !executeMutation.isPending && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No results yet. Run a query to see results here.</p>
                </div>
              )}
              {executeMutation.isPending && (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Executing query...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "errors" && (
            <div>
              {executionError && (
                <div className="border border-red-300 bg-red-50 dark:bg-red-900/20 rounded p-4">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Query Error</h3>
                  <pre className="text-sm text-red-600 dark:text-red-300 whitespace-pre-wrap">
                    {executionError}
                  </pre>
                </div>
              )}
              {warning && (
                <div className="border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded p-4">
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                    Warning
                  </h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-2">
                    {warning.message}
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Suggestion: {warning.suggestion}
                  </p>
                </div>
              )}
              {!executionError && !warning && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No errors recorded.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "logs" && (
            <div>
              {queryLogs.length > 0 ? (
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 max-h-96 overflow-auto">
                  <pre className="text-xs font-mono space-y-1">
                    {queryLogs.map((log) => (
                      <div key={log} className="whitespace-pre-wrap">
                        {log}
                      </div>
                    ))}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No logs yet. Run a query to see execution logs here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {saveQueryModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingQueryId ? "Update Query" : "Save Query"}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="queryName" className="block text-sm font-medium mb-1">
                  Query Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="queryName"
                  type="text"
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter query name"
                />
                {queryName.trim().length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Query name is required</p>
                )}
              </div>
              <div>
                <label htmlFor="queryDescription" className="block text-sm font-medium mb-1">
                  Description <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="queryDescription"
                  value={queryDescription}
                  onChange={(e) => setQueryDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a description for this query"
                  rows={3}
                />
              </div>
              <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <p>
                  Data Source:{" "}
                  <strong>
                    {dataSources?.find((ds) => ds.id === selectedDataSource)?.name || "None"}
                  </strong>
                </p>
                <p>
                  Query Length: <strong>{sqlContent.length}</strong> characters
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setSaveQueryModal(false);
                  setQueryName("");
                  setQueryDescription("");
                }}
                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuery}
                disabled={saveQueryMutation.isPending || !queryName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {saveQueryMutation.isPending ? "Saving..." : editingQueryId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
