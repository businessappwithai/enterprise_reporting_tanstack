/**
 * Database configuration with support for both PGLite (development) and PostgreSQL (production)
 * Switch between databases using DATABASE_TYPE environment variable
 *
 * Development (default): PGLite (in-process PostgreSQL)
 *   - No external server needed
 *   - Data stored in ./data directory
 *   - Perfect for local development
 *
 * Production: PostgreSQL
 *   - Connect to external PostgreSQL server
 *   - Use DATABASE_URL for connection string
 *   - Format: postgresql://user:password@host:port/database
 */

export interface DatabaseConfig {
  type: "pglite" | "postgres";
  isProduction: boolean;
  connectionUrl?: string;
  dataPath?: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  const databaseType = process.env.DATABASE_TYPE || "pglite";
  const isProduction = databaseType === "postgres";

  return {
    type: databaseType as "pglite" | "postgres",
    isProduction,
    connectionUrl: process.env.DATABASE_URL,
    dataPath: process.env.DATA_DIR || "./data",
  };
}

export function getConnectionString(): string {
  const config = getDatabaseConfig();

  if (config.type === "postgres") {
    if (!config.connectionUrl) {
      throw new Error(
        "DATABASE_URL environment variable is required for PostgreSQL database"
      );
    }
    return config.connectionUrl;
  }

  // For PGLite, return connection to local data directory
  return `postgresql://localhost/${config.dataPath}`;
}

export function isDatabaseProduction(): boolean {
  return getDatabaseConfig().isProduction;
}

export function logDatabaseConfig(): void {
  const config = getDatabaseConfig();
  console.log("\n=== Database Configuration ===");
  console.log(`Type: ${config.type.toUpperCase()}`);
  console.log(`Production: ${config.isProduction ? "Yes" : "No"}`);

  if (config.type === "postgres") {
    console.log(`Connection: ${config.connectionUrl?.replace(/:[^@]*@/, ":***@")}`);
  } else {
    console.log(`Data Path: ${config.dataPath}`);
  }
  console.log("==============================\n");
}
