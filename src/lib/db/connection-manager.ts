import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { Kysely, MssqlDialect, MysqlDialect, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { PGlite } from "@electric-sql/pglite";
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

async function buildKyselyConnection(
  clientType: DatabaseClientType,
  connectionConfig: ConnectionConfig
): Promise<AnyKysely> {
  switch (clientType) {
    case "sqlite3": {
      // Use PGLite for SQLite-compatible in-process database
      const filename = connectionConfig.filename || ":memory:";
      let dataDir: string;
      if (filename === ":memory:") {
        dataDir = "./data/in-memory";
      } else if (filename.startsWith("/")) {
        dataDir = join(filename, "..");
      } else if (filename.startsWith("./data/") || filename.startsWith("data/")) {
        dataDir = join(process.cwd(), filename.replace(/^\.\//, ""));
      } else {
        dataDir = join(process.cwd(), "data", "uploads");
      }

      mkdirSync(dataDir, { recursive: true });
      const pglite = new PGlite(dataDir);
      await pglite.waitReady;

      class PGlitePool {
        async connect() {
          return {
            query: (sql: string, values?: unknown[]) => pglite.query(sql, values),
            release: () => Promise.resolve(),
          };
        }
      }

      return new Kysely({
        dialect: new PostgresDialect({
          pool: new PGlitePool() as any,
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

  const connection = await buildKyselyConnection(dataSource.client_type, connectionConfig);

  await sql`SELECT 1`.execute(connection);

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
    connection = await buildKyselyConnection(clientType, connectionConfig);
    await sql`SELECT 1`.execute(connection);
    const latency = Date.now() - startTime;

    if (clientType === "sqlite3") {
      const tables = await sql`
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
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
