import { getDb, getConfigDB, getKnexDb, closeDb, isPostgres, type KyselyDB } from "./kysely-db";

// Re-export Kysely DB functions
export { getDb, getConfigDB, getKnexDb, closeDb, isPostgres };
export type { KyselyDB };
