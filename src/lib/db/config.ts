import { getDb, getConfigDB, closeDb, isPostgres, type KyselyDB } from "./kysely-db";

// Re-export Kysely DB functions
export { getDb, getConfigDB, closeDb, isPostgres };
export type { KyselyDB };
