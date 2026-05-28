import { Kysely, MssqlDialect, MysqlDialect, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { getDb } from "@/lib/db/config"; // biome-ignore lint/suspicious/noExplicitAny: external DB schema unknown
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
  connectionString?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

/**
 * Parse PostgreSQL connection string into individual config fields
 * Supports: postgresql://user:password@host:port/database?ssl=require
 */
function parsePostgresConnectionString(connStr: string): Partial<ConnectionConfig> {
  try {
    const url = new URL(connStr);
    const config: Partial<ConnectionConfig> = {
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : 5432,
      database: url.pathname.replace(/^\//, ""),
      user: url.username,
      password: url.password,
    };

    // Handle SSL parameter
    const sslParam = url.searchParams.get("ssl");
    if (sslParam) {
      config.ssl = sslParam === "require" || sslParam === "true";
    }

    return config;
  } catch (error) {
    throw new Error(`Invalid PostgreSQL connection string: ${(error as Error).message}`);
  }
}

async function buildKyselyConnection(
  clientType: DatabaseClientType,
  connectionConfig: ConnectionConfig
): Promise<AnyKysely> {
  switch (clientType) {
    case "sqlite3": {
      throw new Error(
        "SQLite data sources are no longer supported. Please use PostgreSQL, MySQL, or SQL Server instead."
      );
    }

    case "pg": {
      // Build pool config with battle-tested SSL/TLS settings for Neon and other external databases
      const poolConfig: any = {
        // Connection pool configuration
        max: 10,
        min: 0,
        idleTimeoutMillis: 600000,
        // Extended timeout for external databases with SSL/TLS handshake and SASL channel binding
        connectionTimeoutMillis: 120000, // 120 seconds for Neon's strict SSL/SASL
        statement_timeout: 60000,
        keepalives: 1,
        keepalives_idle: 30,
      };

      // Use connection string if provided (Neon uses this)
      if (connectionConfig.connectionString) {
        let connStr = connectionConfig.connectionString;

        // Fix common connection string errors
        // Fix: Replace first & with ? if no ? exists (query parameter separator)
        if (!connStr.includes('?') && connStr.includes('&')) {
          connStr = connStr.replace('&', '?');
          console.log('[Connection] Fixed connection string format: & → ?');
        }

        // Fix: Ensure sslmode=require for Neon connections
        if (connStr.includes('neon') && !connStr.includes('sslmode=')) {
          if (connStr.includes('?')) {
            connStr += '&sslmode=require';
          } else {
            connStr += '?sslmode=require';
          }
          console.log('[Connection] Added sslmode=require to Neon connection string');
        }

        poolConfig.connectionString = connStr;

        // Check if connection string contains Neon or explicit SSL requirements
        const isNeon = connStr.includes('neon');
        const hasSSLMode = connStr.includes('sslmode=');
        const hasChannelBinding = connStr.includes('channel_binding=');

        // For Neon and other external databases requiring SSL, use permissive SSL config
        // The connection string parameters (sslmode=require, channel_binding=require) will be honored
        poolConfig.ssl = {
          rejectUnauthorized: false, // Neon uses strict SSL, allow self-signed verification workaround
          minVersion: 'TLSv1.2', // Require modern TLS
        };

        // Log connection attempt for debugging
        console.log('[Connection] Connecting via connection string', {
          isNeon,
          hasSSLMode,
          hasChannelBinding,
          timeout: poolConfig.connectionTimeoutMillis,
        });
      } else {
        // Otherwise build from individual components
        poolConfig.host = connectionConfig.host;
        poolConfig.port = connectionConfig.port || 5432;
        poolConfig.database = connectionConfig.database;
        poolConfig.user = connectionConfig.user;
        poolConfig.password = connectionConfig.password;

        // Apply SSL for individual component connections
        if (connectionConfig.ssl !== false) {
          poolConfig.ssl = {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2',
          };
        }
      }

      const pool = new Pool(poolConfig);
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

    // Test basic connectivity
    await sql`SELECT 1`.execute(connection);

    // For PostgreSQL, also verify schema access (what inspect needs)
    if (clientType === "pg") {
      try {
        await sql`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          LIMIT 1
        `.execute(connection);
      } catch (schemaError) {
        throw new Error(
          `Schema access failed: ${schemaError instanceof Error ? schemaError.message : String(schemaError)}. ` +
          `The user may not have permissions to query information_schema.`
        );
      }
    }

    const latency = Date.now() - startTime;

    if (clientType === "sqlite3") {
      return {
        success: true,
        message: "Connection successful (SQLite)",
        latency,
      };
    }

    return {
      success: true,
      message: `Connection successful (${latency}ms)`,
      latency
    };
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "object" && error !== null) {
      message = (error as any).message || String(error);
    }

    // Provide helpful error messages
    let friendlyMessage = message;
    if (message.includes("ETIMEDOUT") || message.includes("timeout")) {
      friendlyMessage = `Connection timeout. The database server may be unreachable or the network is blocking the connection. This may indicate the server is too slow or the network is restricted.`;
    } else if (message.includes("ECONNREFUSED")) {
      friendlyMessage = `Connection refused. Check that the host and port are correct and the database server is running.`;
    } else if (message.includes("authentication failed") || message.includes("password authentication failed")) {
      friendlyMessage = `Authentication failed. Check your username and password.`;
    } else if (message.includes("Schema access failed")) {
      friendlyMessage = message; // Already formatted
    } else if (message.includes("no such host") || message.includes("getaddrinfo")) {
      friendlyMessage = `Host not found. Check that the hostname is correct and resolvable.`;
    }

    return {
      success: false,
      message: friendlyMessage,
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
