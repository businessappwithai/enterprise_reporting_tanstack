import { testConnection as testDatabaseConnection } from "@/lib/db/connection-manager";
import type { DatabaseClientType } from "@/types/database";

export interface ConnectionConfig {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  filename?: string;
  connectionString?: string;
}

export interface ConnectionTestResult {
  connected: boolean;
  message: string;
  latency?: number;
}

export class ConnectionTestService {
  static async test(
    clientType: string,
    config: ConnectionConfig
  ): Promise<ConnectionTestResult> {
    if (!clientType?.trim()) {
      return {
        connected: false,
        message: "Database type is required",
      };
    }

    try {
      // First validate the config
      const validationResult = this.validateConfig(clientType, config);
      if (!validationResult.valid) {
        return {
          connected: false,
          message: validationResult.message,
        };
      }

      // Then actually test the connection (real database connectivity)
      const result = await testDatabaseConnection(
        clientType.toLowerCase() as DatabaseClientType,
        config
      );

      return {
        connected: result.success,
        message: result.message,
        latency: result.latency,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connection test failed";
      return {
        connected: false,
        message,
      };
    }
  }

  private static validateConfig(
    clientType: string,
    config: ConnectionConfig
  ): { valid: boolean; message: string } {
    const type = clientType.toLowerCase();

    switch (type) {
      case "sqlite":
      case "sqlite3":
        if (!config.filename?.trim()) {
          return {
            valid: false,
            message: "SQLite filename is required",
          };
        }
        break;

      case "pg":
      case "postgres":
      case "postgresql":
        if (config.connectionString) {
          if (!config.connectionString.trim()) {
            return {
              valid: false,
              message: "Connection string cannot be empty",
            };
          }
        } else {
          if (!config.host || !config.database || !config.user) {
            const missing = [];
            if (!config.host) missing.push("host");
            if (!config.database) missing.push("database");
            if (!config.user) missing.push("user");
            return {
              valid: false,
              message: `Missing required fields: ${missing.join(", ")}`,
            };
          }
        }
        break;

      case "mysql":
        if (config.connectionString) {
          if (!config.connectionString.trim()) {
            return {
              valid: false,
              message: "Connection string cannot be empty",
            };
          }
        } else {
          if (!config.host || !config.database || !config.user) {
            const missing = [];
            if (!config.host) missing.push("host");
            if (!config.database) missing.push("database");
            if (!config.user) missing.push("user");
            return {
              valid: false,
              message: `Missing required fields: ${missing.join(", ")}`,
            };
          }
        }
        break;

      case "mssql":
      case "sqlserver":
        if (config.connectionString) {
          if (!config.connectionString.trim()) {
            return {
              valid: false,
              message: "Connection string cannot be empty",
            };
          }
        } else {
          if (!config.host || !config.database || !config.user) {
            const missing = [];
            if (!config.host) missing.push("host");
            if (!config.database) missing.push("database");
            if (!config.user) missing.push("user");
            return {
              valid: false,
              message: `Missing required fields: ${missing.join(", ")}`,
            };
          }
        }
        break;

      case "oracle":
      case "oracledb":
        if (config.connectionString) {
          if (!config.connectionString.trim()) {
            return {
              valid: false,
              message: "Connection string cannot be empty",
            };
          }
        } else {
          if (!config.host || !config.database || !config.user) {
            const missing = [];
            if (!config.host) missing.push("host");
            if (!config.database) missing.push("database");
            if (!config.user) missing.push("user");
            return {
              valid: false,
              message: `Missing required fields: ${missing.join(", ")}`,
            };
          }
        }
        break;

      default:
        return {
          valid: false,
          message: `Unsupported database type: ${clientType}`,
        };
    }

    return { valid: true, message: "" };
  }
}
