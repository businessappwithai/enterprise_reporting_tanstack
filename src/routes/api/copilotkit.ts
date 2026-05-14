import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

/**
 * CopilotKit Runtime Endpoint
 * Provides minimal runtime information for CopilotKit client
 */
export const Route = createFileRoute("/api/copilotkit")({
  server: {
    handlers: {
      GET: async () => {
        return json({
          agents: [],
          actions: [],
        });
      },

      POST: async ({ request }: { request: Request }) => {
        // Handle CopilotKit runtime info requests
        const body = await request.json().catch(() => ({}));

        return json({
          agents: [],
          actions: [],
        });
      },
    },
  },
});
