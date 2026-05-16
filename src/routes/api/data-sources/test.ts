import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { ConnectionTestService } from "@/lib/services/connection-test.service";

interface TestConnectionRequest {
  clientType: string;
  connectionConfig: {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    filename?: string;
  };
}

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/data-sources/test")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { error: { message: "Unauthorized" } },
              { status: 401 }
            );
          }

          const body = (await request.json()) as TestConnectionRequest;

          const result = await ConnectionTestService.test(
            body.clientType,
            body.connectionConfig
          );

          return json({
            data: result,
          });
        } catch (error) {
          console.error("[DataSources Test] Error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Test connection failed",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
