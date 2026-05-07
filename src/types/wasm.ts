/**
 * Type definitions for the WASM-centric architecture.
 * Covers DuckDB, Arrow, Parquet, ECharts, and datasets.
 */

// ---------------------------------------------------------------------------
// DuckDB types
// ---------------------------------------------------------------------------

export type DuckDBStatus = 'initializing' | 'ready' | 'error';

export interface DuckDBConfig {
  /** Maximum memory allowed for DuckDB (bytes). @default 2GB */
  maxMemory?: number;
  /** Path to DuckDB-Wasm worker script */
  workerPath?: string;
  /** Enable query performance logging */
  enableLogging?: boolean;
  /** Custom logger */
  logger?: (message: string, level: 'info' | 'warn' | 'error') => void;
}

export interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
}

export interface TableSchema {
  tableName: string;
  columns: ColumnSchema[];
  rowCount?: number;
}

export interface QueryResult {
  /** Result rows as plain objects */
  rows: Record<string, unknown>[];
  /** Number of rows */
  rowCount: number;
  /** Column schema */
  columns: ColumnSchema[];
  /** Execution time in ms */
  executionTime: number;
  /** The SQL that was executed */
  query: string;
}

export interface MemoryUsage {
  /** Currently used memory in bytes */
  used: number;
  /** Total memory limit in bytes */
  limit: number;
  /** Per-dataset breakdown */
  breakdown: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Dataset types
// ---------------------------------------------------------------------------

export type DatasetCacheStatus = 'not-cached' | 'cached' | 'stale';
export type DatasetStatus = 'pending' | 'ready' | 'error';

export interface DatasetInfo {
  id: string;
  name: string;
  description?: string | null;
  dataSourceId: string;
  dataSourceName?: string;
  tableName: string;
  query?: string;
  rowCount: number;
  fileSize: number;
  compressedSize?: number;
  memorySize: number;
  schema: ColumnSchema[];
  loadedAt?: Date;
  refreshedAt?: Date;
  cacheStatus: DatasetCacheStatus;
  isLoading: boolean;
  loadProgress?: number;
  createdAt?: string;
  updatedAt?: string;
  lastAccessedAt?: string | null;
  downloadUrl?: string;
  status?: DatasetStatus;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string | null;
  dataSourceId: string;
  dataSourceName: string;
  rowCount: number;
  fileSize: number;
  compressedSize: number;
  columns: ColumnSchema[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string | null;
  downloadUrl: string;
  isCached: boolean;
}

// ---------------------------------------------------------------------------
// Parquet export types
// ---------------------------------------------------------------------------

export type ParquetCompression =
  | 'uncompressed'
  | 'snappy'
  | 'gzip'
  | 'brotli'
  | 'lz4'
  | 'zstd';

export interface ParquetExportConfig {
  dataSourceId: string;
  query: string;
  outputFileName: string;
  compression?: ParquetCompression;
  rowGroupSize?: number;
  maxFileSize?: number;
  enableStatistics?: boolean;
  enableDictionary?: boolean;
}

export interface ParquetExportResult {
  id: string;
  files: string[];
  rowCount: number;
  totalSize: number;
  compressionRatio: number;
  schema: ColumnSchema[];
  duration: number;
  createdAt: Date;
}

export interface ExportProgress {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-1
  rowsProcessed: number;
  totalRows?: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// Chart / ECharts types
// ---------------------------------------------------------------------------

export type ChartType =
  // Basic
  | 'bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'doughnut'
  | 'scatter'
  // Advanced
  | 'heatmap'
  | 'treemap'
  | 'sunburst'
  | 'sankey'
  | 'funnel'
  | 'gauge'
  // Geospatial
  | 'map'
  | 'geoScatter'
  // Relational
  | 'graph'
  | 'tree'
  // Statistical
  | 'boxplot'
  | 'candlestick'
  | 'parallel'
  // 3D (optional)
  | 'bar3d'
  | 'scatter3d'
  | 'surface3d';

export interface AxisConfig {
  type?: 'category' | 'value' | 'time' | 'log';
  name?: string;
  min?: number | string;
  max?: number | string;
  data?: string[];
}

export interface LegendConfig {
  data?: string[];
  orient?: 'horizontal' | 'vertical';
  left?: string | number;
  top?: string | number;
}

export interface TooltipConfig {
  trigger?: 'item' | 'axis' | 'none';
  formatter?: string;
}

export interface AnimationConfig {
  duration?: number;
  easing?: string;
}

export interface DataMapping {
  /** Column for x-axis / category */
  x?: string;
  /** Column(s) for y-axis / value */
  y?: string | string[];
  /** Column for color encoding */
  color?: string;
  /** Column for size encoding */
  size?: string;
  /** Column for grouping (series) */
  group?: string;
  /** Aggregation function */
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'none';
}

export interface EChartsConfig {
  type: ChartType;
  title?: string;
  subtitle?: string;
  width?: string | number;
  height?: string | number;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  colors?: string[];
  /** Per-series colors (maps to series order) */
  seriesColors?: string[];
  legend?: boolean | LegendConfig;
  tooltip?: boolean | TooltipConfig;
  dataMapping: DataMapping;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customOptions?: Record<string, any>;
  animation?: boolean | AnimationConfig;
}

// ---------------------------------------------------------------------------
// TanStack Table types (for data grid)
// ---------------------------------------------------------------------------

export interface TableFilterState {
  columnId: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'contains'
    | 'startsWith'
    | 'in'
    | 'notIn';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface TableSortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// Cross-filter types
// ---------------------------------------------------------------------------

export interface FilterLink {
  sourceWidgetId: string;
  columnMapping: Record<string, string>;
  operator?: 'eq' | 'in' | 'range';
}

export interface WidgetFilterConfig {
  widgetId: string;
  type: 'chart' | 'table' | 'metric';
  datasetId: string;
  baseQuery: string;
  filterLinks: FilterLink[];
  broadcastsFilters?: boolean;
  filterableColumns?: string[];
}

export interface ActiveFilter {
  id: string;
  sourceWidgetId: string;
  column: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any[];
  operator: 'eq' | 'in' | 'range';
  affectedWidgets: string[];
}

export interface CrossFilterConfig {
  dashboardId: string;
  widgets: WidgetFilterConfig[];
}

// ---------------------------------------------------------------------------
// Execution mode types
// ---------------------------------------------------------------------------

export type ExecutionMode = 'auto' | 'server' | 'client';
export type OutputFormat = 'json' | 'arrow' | 'parquet';

export interface BrowserCapabilities {
  wasmSupported: boolean;
  sharedArrayBuffer: boolean;
  indexedDB: boolean;
  sufficientMemory: boolean;
}

// ---------------------------------------------------------------------------
// API error codes
// ---------------------------------------------------------------------------

export const ERROR_CODES = {
  UNAUTHORIZED: 'AUTH_001',
  FORBIDDEN: 'AUTH_002',
  SESSION_EXPIRED: 'AUTH_003',
  VALIDATION_ERROR: 'VAL_001',
  INVALID_SQL: 'VAL_002',
  INVALID_FILTER: 'VAL_003',
  DATASET_NOT_FOUND: 'RES_001',
  DATA_SOURCE_NOT_FOUND: 'RES_002',
  CHART_NOT_FOUND: 'RES_003',
  EXPORT_FAILED: 'OPS_001',
  QUERY_FAILED: 'OPS_002',
  MEMORY_LIMIT_EXCEEDED: 'OPS_003',
  RATE_LIMITED: 'RT_001',
  INTERNAL_ERROR: 'SRV_001',
  SERVICE_UNAVAILABLE: 'SRV_002',
} as const;

// ---------------------------------------------------------------------------
// Parquet presets
// ---------------------------------------------------------------------------

export const PARQUET_PRESETS = {
  fast: {
    compression: 'snappy' as ParquetCompression,
    rowGroupSize: 100_000,
    enableDictionary: true,
    enableStatistics: true,
  },
  balanced: {
    compression: 'snappy' as ParquetCompression,
    rowGroupSize: 1_000_000,
    enableDictionary: true,
    enableStatistics: true,
  },
  compressed: {
    compression: 'zstd' as ParquetCompression,
    rowGroupSize: 1_000_000,
    enableDictionary: true,
    enableStatistics: true,
  },
  timeSeries: {
    compression: 'zstd' as ParquetCompression,
    rowGroupSize: 500_000,
    enableDictionary: false,
    enableStatistics: true,
  },
} as const;
