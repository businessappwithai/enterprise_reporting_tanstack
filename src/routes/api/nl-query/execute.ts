import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { executeNLQuery, executeNLQueryWithOverride } from "@/server-fns/nl-query";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth();
}

export const Route = createFileRoute("/api/nl-query/execute")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const body = await request.json();

          // Validate input
          if (!body.nlQuestion || typeof body.nlQuestion !== 'string') {
            return json(
              { success: false, error: { code: 'INVALID_INPUT', message: 'Natural language question is required' } },
              { status: 400 }
            );
          }

          if (!body.dataSourceId || typeof body.dataSourceId !== 'string') {
            return json(
              { success: false, error: { code: 'INVALID_INPUT', message: 'Data source ID is required' } },
              { status: 400 }
            );
          }

          const timeout = body.timeout || 30000;

          // Check if this is an override request
          if (body.approvedSQL) {
            const result = await executeNLQueryWithOverride({
              nlQuestion: body.nlQuestion,
              dataSourceId: body.dataSourceId,
              approvedSQL: body.approvedSQL,
              timeout,
            });

            return json({
              success: result.success,
              data: result,
              error: result.error ? { code: 'EXECUTION_ERROR', message: result.error } : undefined,
            });
          }

          // Standard execution
          const result = await executeNLQuery({
            nlQuestion: body.nlQuestion,
            dataSourceId: body.dataSourceId,
            timeout,
          });

          return json({
            success: result.success,
            data: result,
            error: result.error ? { code: 'EXECUTION_ERROR', message: result.error } : undefined,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: errorMessage } },
            { status: 500 }
          );
        }
      },
    },
  },
});
