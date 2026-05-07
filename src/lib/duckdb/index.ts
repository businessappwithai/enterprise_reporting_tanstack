/**
 * DuckDB-Wasm library — main exports.
 */

export { initDuckDB, getDuckDB, createConnection, closeDuckDB } from './instance';
export {
  executeQuery,
  executeQueryArrow,
  loadParquetFromUrl,
  loadParquetFromBuffer,
  dropTable,
} from './query';
export { listTables, getTableSchema, getAllTableSchemas } from './schema';
export { MemoryManager, getMemoryManager } from './memory';
export type { DuckDBQueryResult, DuckDBTableInfo, DuckDBInstanceOptions } from './types';
export { DEFAULT_DUCKDB_OPTIONS } from './types';
