import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { createFileRoute } from "@tanstack/react-router";
import { ReportBuilderPanel } from "@/components/report-generation/ReportBuilderPanel";
import "@copilotkit/react-ui/styles.css";

export const Route = createFileRoute("/_authed/reports/generate/")({
  component: ReportGeneratePage,
});

function ReportGeneratePage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        instructions={`You are a report generation assistant for an enterprise reporting platform.
You help users create dynamic reports by understanding their natural language requests.

When a user asks for a report:
1. Use buildReport to analyze their request and show a data preview
2. Once they confirm, use confirmReport to generate the full report
3. If they ask about past reports, use listReports to show history
4. If they want to download, use downloadReport

Always explain what data source you're using and what SQL you generated.
Respect RBAC — if access is denied, explain clearly.`}
        labels={{
          title: "Report Generator",
          initial: "What report would you like to generate? Describe the data you need, the format (Excel, PDF, CSV), and who should receive it.",
        }}
        className="h-full"
      >
        <ReportBuilderPanel />
      </CopilotSidebar>
    </CopilotKit>
  );
}
