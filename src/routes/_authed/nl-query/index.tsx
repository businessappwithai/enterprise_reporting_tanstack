import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Send, AlertCircle, CheckCircle, Copy, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authed/nl-query/")({
  component: NlQueryPage,
});

function NlQueryPage() {
  const [question, setQuestion] = useState("");
  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[] | null>(null);

  // Get data source ID
  const { data: dataSourceId, isLoading: isLoadingDs } = useQuery({
    queryKey: ["active-data-source"],
    queryFn: async () => {
      const response = await fetch("/api/data-sources");
      const data = await response.json();
      const hmsDs = data.data?.items?.find(
        (ds: any) => ds.name === "HMS" || ds.client_type === "postgres"
      );
      return hmsDs?.id;
    },
  });

  // Generate SQL from natural language
  const { mutate: generateSQL, isPending: isGenerating } = useMutation({
    mutationFn: async (nlQuestion: string) => {
      const response = await fetch("/api/copilotkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "/execute",
          input: { message: nlQuestion },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate SQL");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate SQL");
      }

      return data.result;
    },
    onSuccess: (result) => {
      setGeneratedSql(result.sql);
      setExplanation(result.explanation);
      setWarnings(result.warnings || []);
      toast.success("SQL generated successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    },
  });

  // Execute the generated SQL
  const { mutate: executeSQL, isPending: isExecuting } = useMutation({
    mutationFn: async (sql: string) => {
      const response = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataSourceId,
          sql,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute SQL");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Query executed successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    },
  });

  const handleGenerateSQL = () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    generateSQL(question);
  };

  const handleExecuteSQL = () => {
    if (!generatedSql) {
      toast.error("No SQL generated yet");
      return;
    }
    executeSQL(generatedSql);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Natural Language to SQL</h1>
        <p className="text-muted-foreground">
          Ask questions in plain English and AI will convert them to SQL using Ollama
        </p>
      </div>

      {isLoadingDs ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading data sources...
            </div>
          </CardContent>
        </Card>
      ) : !dataSourceId ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No HMS data source found. Please create a data source in Data Sources page first.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Question Input */}
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Show me the total number of patients by gender and status"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isGenerating}
                className="min-h-24"
              />
              <Button
                onClick={handleGenerateSQL}
                disabled={isGenerating || !question.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating SQL...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate SQL
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated SQL */}
          {generatedSql && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <CheckCircle className="h-5 w-5" />
                  Generated SQL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* SQL Code Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SQL Query:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedSql);
                        toast.success("SQL copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="overflow-x-auto rounded bg-slate-900 p-4 text-sm text-green-400 font-mono">
                    {generatedSql}
                  </pre>
                </div>

                {/* Explanation */}
                {explanation && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Explanation:</span>
                    <p className="text-sm text-green-800">{explanation}</p>
                  </div>
                )}

                {/* Warnings */}
                {warnings && warnings.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Warnings:</span>
                    <div className="flex flex-wrap gap-2">
                      {warnings.map((warning, i) => (
                        <Badge key={i} variant="secondary">
                          {warning}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execute Button */}
                <Button
                  onClick={handleExecuteSQL}
                  disabled={isExecuting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Execute Query
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-center text-xs">1</span>
                  Natural Language Processing
                </h3>
                <p className="text-muted-foreground ml-8">Your question is parsed to understand the intent and required data</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-center text-xs">2</span>
                  Schema Mapping
                </h3>
                <p className="text-muted-foreground ml-8">Database schema is analyzed to identify relevant tables and columns</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-center text-xs">3</span>
                  SQL Generation
                </h3>
                <p className="text-muted-foreground ml-8">Ollama (sqlcoder model) generates optimized SQL queries locally</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-center text-xs">4</span>
                  Validation & Execution
                </h3>
                <p className="text-muted-foreground ml-8">SQL is validated for safety before execution against the database</p>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This feature requires Ollama to be running with the <code>sqlcoder:7b</code> model.
                  Ensure Ollama is started on port 11434.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
