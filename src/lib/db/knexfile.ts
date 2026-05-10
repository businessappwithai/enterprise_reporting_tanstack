import type { Knex } from "knex";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const DATABASE_URL = process.env.DATABASE_URL || "";
const isProduction = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(projectRoot, "data/config.sqlite");

function getMigrationsDirectory(): string {
  if (isProduction) {
    const prodPath = "/app/migrations";
    if (fs.existsSync(prodPath)) return prodPath;
  }
  return path.join(__dirname, "migrations");
}

function getSeedsDirectory(): string {
  if (isProduction) {
    const prodPath = "/app/seeds";
    if (fs.existsSync(prodPath)) return prodPath;
  }
  return path.join(__dirname, "seeds");
}

const pgConfig: Knex.Config = {
  client: "pg",
  connection: DATABASE_URL,
  pool: { min: 2, max: 10 },
  migrations: {
    directory: getMigrationsDirectory(),
    extension: "ts",
  },
  seeds: {
    directory: getSeedsDirectory(),
    extension: "ts",
  },
};

const sqliteConfig: Knex.Config = {
  client: "better-sqlite3",
  connection: { filename: DATABASE_PATH },
  useNullAsDefault: true,
  migrations: {
    directory: getMigrationsDirectory(),
    extension: "ts",
  },
  seeds: {
    directory: getSeedsDirectory(),
    extension: "ts",
  },
  pool: {
    afterCreate: (conn: { pragma: (s: string) => void }, cb: () => void) => {
      conn.pragma("foreign_keys = ON");
      cb();
    },
  },
};

const config: { [key: string]: Knex.Config } = {
  development: DATABASE_URL ? pgConfig : sqliteConfig,
  production: DATABASE_URL
    ? {
        ...pgConfig,
        migrations: { ...pgConfig.migrations, extension: "js" },
        seeds: { ...pgConfig.seeds, extension: "js" },
      }
    : {
        ...sqliteConfig,
        client: "better-sqlite3",
        migrations: { ...sqliteConfig.migrations, extension: "js" },
        seeds: { ...sqliteConfig.seeds, extension: "js" },
      },
};

export default config;
