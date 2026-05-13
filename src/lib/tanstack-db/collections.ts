import { createCollection } from '@tanstack/db'
import { z } from 'zod'

// Active Filters schema
const activeFiltersSchema = z.object({
  id: z.string(),
  dashboardId: z.string(),
  widgetId: z.string(),
  field: z.string(),
  operator: z.string(),
  value: z.unknown(),
  createdAt: z.string(),
})

export type ActiveFilter = z.infer<typeof activeFiltersSchema>

export const activeFiltersCollection = createCollection({
  id: 'active-filters',
  schema: activeFiltersSchema,
  getKey: (item) => item.id,
  sync: {
    sync: () => {
      // Phase 2+: Sync active filters from server
      return undefined
    },
  },
})

// Chart Draft schema
const chartDraftSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  chartType: z.string(),
  chartConfig: z.unknown(),
  dataMapping: z.unknown(),
  savedQueryId: z.string().optional(),
  lastEditedAt: z.string(),
})

export type ChartDraft = z.infer<typeof chartDraftSchema>

export const chartDraftCollection = createCollection({
  id: 'chart-drafts',
  schema: chartDraftSchema,
  getKey: (item) => item.id,
  sync: {
    sync: () => {
      // Phase 3: Restore drafts from localStorage
      return undefined
    },
  },
})

// Dashboard State schema
const dashboardStateSchema = z.object({
  dashboardId: z.string(),
  editMode: z.boolean(),
  activeWidgetId: z.string().optional(),
  layoutConfig: z.unknown(),
  lastModified: z.string(),
})

export type DashboardState = z.infer<typeof dashboardStateSchema>

export const dashboardStateCollection = createCollection({
  id: 'dashboard-state',
  schema: dashboardStateSchema,
  getKey: (item) => item.dashboardId,
  sync: {
    sync: () => {
      // Phase 2: Sync dashboard state from server
      return undefined
    },
  },
})

// Query History schema
const queryHistorySchema = z.object({
  id: z.string(),
  sql: z.string(),
  executedAt: z.string(),
  rowCount: z.number(),
  durationMs: z.number(),
  error: z.string().optional(),
})

export type QueryHistory = z.infer<typeof queryHistorySchema>

export const queryHistoryCollection = createCollection({
  id: 'query-history',
  schema: queryHistorySchema,
  getKey: (item) => item.id,
  sync: {
    sync: () => {
      // Phase 5: Persist query history to localStorage
      return undefined
    },
  },
})

// Reports List schema
const reportsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  dataSourceId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Report = z.infer<typeof reportsSchema>

export const reportsCollection = createCollection({
  id: 'reports',
  schema: reportsSchema,
  getKey: (item) => item.id,
  sync: {
    sync: () => {
      // Phase 4: Sync reports from server
      return undefined
    },
  },
})

// Charts List schema
const chartsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  chartType: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Chart = z.infer<typeof chartsSchema>

export const chartsCollection = createCollection({
  id: 'charts',
  schema: chartsSchema,
  getKey: (item) => item.id,
  sync: {
    sync: () => {
      // Phase 4: Sync charts from server
      return undefined
    },
  },
})

// Dashboards List schema
const dashboardsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Dashboard = z.infer<typeof dashboardsSchema>

export const dashboardsCollection = createCollection({
  id: 'dashboards',
  schema: dashboardsSchema,
  getKey: (item) => item.id,
  sync: {
    sync: () => {
      // Phase 4: Sync dashboards from server
      return undefined
    },
  },
})
