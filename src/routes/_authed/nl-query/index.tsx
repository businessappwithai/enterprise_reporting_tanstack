import { CopilotKit } from "@copilotkit/react-core";
import { createFileRoute } from "@tanstack/react-router";
import "@copilotkit/react-ui/styles.css";
import { NlQueryWorkspace } from "@/components/nl-query/nl-query-workspace";

export const Route = createFileRoute("/_authed/nl-query/")({
  component: NlQueryPage,
});

function NlQueryPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agents={[]}>
      <NlQueryWorkspace />
    </CopilotKit>
  );
}
