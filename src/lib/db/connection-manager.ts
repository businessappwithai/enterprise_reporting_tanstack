import { join } from "node:path";
import { Kysely, MssqlDialect, MysqlDialect, PostgresDialect, SqliteDialect, sql } from "kysely";
import { Pool } from "pg";
import { getDb } from "@/lib/db/config";
import { decrypt } from "@/lib/security/encryption";
import type { DatabaseClientType, DataSource } from "@/types/database";

// biome-ignore lint/suspicious/noExplicitAny: external DB schema is unknown at compile time
type AnyKysely = Kysely<any>;

interface ConnectionPool {
  [key: string]: AnyKysely;
}

const connectionPool: ConnectionPool = {};

interface ConnectionConfig {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  filename?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

function buildKyselyConnection(
  clientType: DatabaseClientType,
  connectionConfig: ConnectionConfig
): AnyKysely {
  switch (clientType) {
    case "sqlite3": {
      // SQLite only works with Bun runtime
      throw new Error(
        "SQLite requires Bun runtime. Use 'bun run dev' instead of Node.js."
      );
      const filename = connectionConfig.filename || ":memory:";
      let fullPath: string;
      if (filename === ":memory:") {
        fullPath = filename;
      } else if (filename.startsWith("/")) {
        fullPath = filename;
      } else if (filename.startsWith("./data/") || filename.startsWith("data/")) {
        fullPath = join(process.cwd(), filename.replace(/^\.\//, ""));
      } else {
        fullPath = join(process.cwd(), "data", "uploads", filename);
      }
      return new Kysely({
        dialect: new SqliteDialect({
          // biome-ignore lint/suspicious/noExplicitAny: compat shim
          database: new BunDatabase(fullPath) as any,
        }),
      });
    }

    case "pg": {
      const pool = new Pool({
        host: connectionConfig.host,
        port: connectionConfig.port || 5432,
        database: connectionConfig.database,
        user: connectionConfig.user,
        password: connectionConfig.password,
        ssl: connectionConfig.ssl ? { rejectUnauthorized: false } : undefined,
        min: 0,
        max: 10,
        idleTimeoutMillis: 600000,
      });
      return new Kysely({ dialect: new PostgresDialect({ pool }) });
    }

    case "mysql": {
      // biome-ignore lint/suspicious/noExplicitAny: dynamic import
      const mysql2 = require("mysql2") as any;
      const pool = mysql2.createPool({
        host: connectionConfig.host,
        port: connectionConfig.port || 3306,
        database: connectionConfig.database,
        user: connectionConfig.user,
        password: connectionConfig.password,
        ssl: connectionConfig.ssl ? { rejectUnauthorized: false } : undefined,
        connectionLimit: 10,
      });
      return new Kysely({ dialect: new MysqlDialect({ pool }) });
    }

    case "mssql": {
      // biome-ignore lint/suspicious/noExplicitAny: dynamic import
      const { ConnectionPool: MssqlPool } = require("mssql") as any;
      const pool = new MssqlPool({
        server: connectionConfig.host,
        port: connectionConfig.port || 1433,
        database: connectionConfig.database,
        user: connectionConfig.user,
        password: connectionConfig.password,
        options: {
          encrypt: !!connectionConfig.ssl,
          trustServerCertificate: true,
        },
      });
      return new Kysely({
        dialect: new MssqlDialect({
          tarn: { min: 0, max: 10 },
          tedious: { connectionFactory: () => pool },
        } as any),
      });
    }

    default:
      throw new Error(`Unsupported database client type: ${clientType}`);
  }
}

export async function getConnection(dataSource: DataSource): Promise<AnyKysely> {
  const poolKey = dataSource.id;

  if (connectionPool[poolKey]) {
    try {
      await sql`SELECT 1`.execute(connectionPool[poolKey]);
      return connectionPool[poolKey];
    } catch {
      await connectionPool[poolKey].destroy();
      delete connectionPool[poolKey];
    }
  }

  let connectionConfig: ConnectionConfig;
  let needsEncryption = false;

  try {
    const isEncrypted =
      dataSource.connection_config.length > 64 &&
      /^[0-9a-fA-F]+$/.test(dataSource.connection_config);

    if (isEncrypted) {
      const decryptedConfig = decrypt(dataSource.connection_config);
      connectionConfig = JSON.parse(decryptedConfig);
    } else {
      connectionConfig = JSON.parse(dataSource.connection_config);
      needsEncryption = true;
    }
  } catch (error) {
    console.error("[CONNECTION MANAGER] Failed to parse connection config:", error);
    throw error;
  }

  if (needsEncryption) {
    try {
      const { encrypt } = await import("@/lib/security/encryption");
      const encryptedConfig = encrypt(JSON.stringify(connectionConfig));
      const db = getDb();
      db.updateTable("data_sources")
        .set({ connection_config: encryptedConfig })
        .where("id", "=", dataSource.id)
        .execute()
        .catch((err) =>
          console.error("[CONNECTION MANAGER] Failed to save re-encrypted config:", err)
        );
    } catch (error) {
      console.error("[CONNECTION MANAGER] Failed to re-encrypt config:", error);
    }
  }

  const connection = buildKyselyConnection(dataSource.client_type, connectionConfig);

  await sql`SELECT 1`.execute(connection);

  if (dataSource.client_type === "sqlite3") {
    try {
      const dbInfo = await sql`PRAGMA database_list`.execute(connection);
      console.log("[CONNECTION MANAGER] SQLite database list:", dbInfo.rows);
    } catch (e) {
      console.error("[CONNECTION MANAGER] Failed to get database list:", e);
    }
  }

  connectionPool[poolKey] = connection;
  return connection;
}

export async function testConnection(
  clientType: DatabaseClientType,
  connectionConfig: ConnectionConfig
): Promise<{ success: boolean; message: string; latency?: number }> {
  const startTime = Date.now();
  let connection: AnyKysely | null = null;

  try {
    if (clientType === "sqlite3" && connectionConfig.filename) {
      const fs = await import("node:fs");
      const filename = connectionConfig.filename;
      const dbPath =
        filename.startsWith("/") || filename === ":memory:"
          ? filename
          : join(process.cwd(), "data", "uploads", filename);

      if (!fs.existsSync(dbPath)) {
        return { success: false, message: `Database file not found: ${dbPath}` };
      }
      const stats = fs.statSync(dbPath);
      if (stats.size === 0) {
        return { success: false, message: `Database file is empty: ${dbPath}` };
      }
    }

    connection = buildKyselyConnection(clientType, connectionConfig);
    await sql`SELECT 1`.execute(connection);
    const latency = Date.now() - startTime;

    if (clientType === "sqlite3") {
      const tables = await sql`
        SELECT name FROM sqlite_master
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        LIMIT 1
      `.execute(connection);
      return {
        success: true,
        message:
          tables.rows.length > 0
            ? "Connection successful. Database contains tables."
            : "Connected, but database appears to be empty (no tables found)",
        latency,
      };
    }

    return { success: true, message: "Connection successful", latency };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    if (connection) {
      await connection.destroy();
    }
  }
}

export async function closeConnection(dataSourceId: string): Promise<void> {
  if (connectionPool[dataSourceId]) {
    await connectionPool[dataSourceId].destroy();
    delete connectionPool[dataSourceId];
  }
}

export async function closeAllConnections(): Promise<void> {
  await Promise.all(
    Object.keys(connectionPool).map(async (key) => {
      await connectionPool[key].destroy();
      delete connectionPool[key];
    })
  );
}

export function getConnectionManager() {
  return { getConnection, closeConnection, closeAllConnections };
}

export function getActiveConnections(): string[] {
  return Object.keys(connectionPool);
}
