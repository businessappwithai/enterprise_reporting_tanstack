import { createFileRoute } from "@tanstack/react-router";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { IntelligentUiContent } from "@/components/intelligent-ui/intelligent-ui-content";

export const Route = createFileRoute("/_authed/intelligent-ui/")({
  component: IntelligentUiPage,
});

function IntelligentUiPage() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      textToSpeechUrl="/api/copilotkit/tts"
      showDevConsole={false}
    >
      <CopilotSidebar
        instructions={`You build views over ONE SQL result. You never see its rows and you never write code or markup.

WORKFLOW: Call fetchSimilarQueries ONCE with the user's question, then runQuestion with the SQL you generate (SELECT only, exact table and column names from the schema context, GROUP BY with aggregates, ORDER BY with LIMIT). Then call renderView one or more times to present the result.

RULES: renderView only accepts columns that runQuestion reported. If renderView returns errors, fix the spec using the column list in the error. Every number on screen is computed by the application from the returned rows — never state, estimate or invent a figure yourself. If the result cannot answer the question, say so instead of guessing. If runQuestion reports access denied, explain which entities the user lacks permission for and do not try to work around it with a different query on the same entities.`}
        labels={{
          title: "Intelligent UI",
          initial:
            'Ask a question about your data and I\'ll build a view of the answer. Try: "Show total sales by region as a bar chart".',
          placeholder: "Ask about your data...",
        }}
        defaultOpen={true}
      >
        <IntelligentUiContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}
