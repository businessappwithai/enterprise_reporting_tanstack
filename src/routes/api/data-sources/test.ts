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
        // PostgreSQL connection test
        try {
          // Try to import pg library
          const pg = await import("pg").catch(() => null);

          if (!pg) {
            // If pg library is not available, provide helpful error
            return json({
              data: {
                connected: false,
                message: "PostgreSQL driver not installed. Install with: npm install pg",
              },
            } as TestConnectionResponse);
          }

          const { Pool } = pg;
          const poolConfig = {
            host: (connectionConfig.host as string) || "localhost",
            port: ((connectionConfig.port as number) || 5432) as number,
            database: connectionConfig.database as string,
            user: connectionConfig.user as string,
            password: connectionConfig.password as string,
            connectionTimeoutMillis: 5000,
          };

          const pool = new Pool(poolConfig);

          // Test the connection
          const result = await Promise.race([
            pool.query("SELECT 1 as test"),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Connection timeout after 5 seconds")), 5000)
            ),
          ]);

          await pool.end();

          connected = true;
          message = "Connected to PostgreSQL database successfully";
        } catch (error) {
          connected = false;
          message = `Failed to connect to PostgreSQL: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      } else if (clientType === "mysql") {
        // MySQL connection test
        try {
          const mysql = await import("mysql2/promise").catch(() => null);

          if (!mysql) {
            return json({
              data: {
                connected: false,
                message: "MySQL driver not installed. Install with: npm install mysql2",
              },
            } as TestConnectionResponse);
          }

          const connection = await Promise.race([
            mysql.createConnection({
              host: (connectionConfig.host as string) || "localhost",
              port: ((connectionConfig.port as number) || 3306) as number,
              database: connectionConfig.database as string,
              user: connectionConfig.user as string,
              password: connectionConfig.password as string,
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Connection timeout after 5 seconds")), 5000)
            ),
          ]);

          if (connection) {
            await (connection as any).end();
            connected = true;
            message = "Connected to MySQL database successfully";
          }
        } catch (error) {
          connected = false;
          message = `Failed to connect to MySQL: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      } else if (clientType === "mssql") {
        // MSSQL connection test
        try {
          const sql = await import("mssql").catch(() => null);

          if (!sql) {
            return json({
              data: {
                connected: false,
                message: "MSSQL driver not installed. Install with: npm install mssql",
              },
            } as TestConnectionResponse);
          }

          const pool = new (sql as any).ConnectionPool({
            server: (connectionConfig.host as string) || "localhost",
            port: ((connectionConfig.port as number) || 1433) as number,
            database: connectionConfig.database as string,
            authentication: {
              type: "default",
              options: {
                userName: connectionConfig.user as string,
                password: connectionConfig.password as string,
              },
            },
            options: {
              encrypt: true,
              trustServerCertificate: true,
              connectionTimeout: 5000,
            },
          });

          await Promise.race([
            pool.connect(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Connection timeout after 5 seconds")), 5000)
            ),
          ]);

          await pool.close();
          connected = true;
          message = "Connected to MSSQL database successfully";
        } catch (error) {
          connected = false;
          message = `Failed to connect to MSSQL: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
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
