import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";

interface TestConnectionRequest {
  clientType: "pg" | "mysql" | "sqlite3" | "mssql";
  connectionConfig: Record<string, unknown>;
}

interface TestConnectionResponse {
  data?: {
    connected: boolean;
    message: string;
  };
  error?: {
    message: string;
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
      POST: async ({ request }: { request: Request }): Promise<Response> => {
        try {
          // Verify authentication
          const session = await getSession(request);
          if (!session?.user) {
            return json({
              error: { message: "Unauthorized" },
            } as TestConnectionResponse);
          }

      // Parse request body
      const body = (await request.json()) as TestConnectionRequest;
      const { clientType, connectionConfig } = body;

      // Test connection based on client type
      let connected = false;
      let message = "";

      if (clientType === "sqlite3") {
        // For SQLite, verify the file can be opened
        const filename = connectionConfig.filename as string;
        if (!filename) {
          return json({
            data: {
              connected: false,
              message: "SQLite filename is required",
            },
          } as TestConnectionResponse);
        }

        try {
          // Import Bun's SQLite and attempt to open the database
          const { Database } = await import("bun:sqlite");
          const db = new Database(filename, { readonly: true });

          // Try to execute a simple query to verify connection
          try {
            db.prepare("SELECT 1").get();
          } finally {
            db.close();
          }

          connected = true;
          message = "Connected to SQLite database successfully";
        } catch (error) {
          connected = false;
          message = `Failed to connect to SQLite: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      } else if (clientType === "pg") {
        // PostgreSQL support coming soon
        return json({
          data: {
            connected: false,
            message: "PostgreSQL support is coming soon. Currently, only SQLite is supported for direct connections.",
          },
        } as TestConnectionResponse);
      } else if (clientType === "mysql") {
        // MySQL support coming soon
        return json({
          data: {
            connected: false,
            message: "MySQL support is coming soon. Currently, only SQLite is supported for direct connections.",
          },
        } as TestConnectionResponse);
      } else if (clientType === "mssql") {
        // MSSQL support coming soon
        return json({
          data: {
            connected: false,
            message: "MSSQL support is coming soon. Currently, only SQLite is supported for direct connections.",
          },
        } as TestConnectionResponse);
      } else {
        return json({
          error: { message: `Unsupported client type: ${clientType}` },
        } as TestConnectionResponse);
      }

        return json({
          data: {
            connected,
            message,
          },
        } as TestConnectionResponse);
        } catch (error) {
          return json({
            error: {
              message: error instanceof Error ? error.message : "Internal server error",
            },
          } as TestConnectionResponse);
        }
      },
    },
  },
});
