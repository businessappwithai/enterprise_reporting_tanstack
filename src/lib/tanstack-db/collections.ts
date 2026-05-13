import { createCollection } from '@tanstack/db'
import { z } from 'zod'

// 1. Active Filters (for cross-filtering)
export const activeFiltersCollection = createCollection({
  id: 'active-filters',
  schema: z.object({
    id: z.string().default(() => crypto.randomUUID()),
    dashboardId: z.string(),
    widgetId: z.string(),
    field: z.string(),
    operator: z.string(),
    value: z.unknown(),
    createdAt: z.string().datetime(),
  }),
})

// 2. Chart Draft (for editor state)
export const chartDraftCollection = createCollection({
  id: 'chart-drafts',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    chartType: z.enum(['bar', 'line', 'area', 'pie', 'scatter', 'composed']),
    chartConfig: z.unknown(), // JSON object
    dataMapping: z.unknown(), // JSON object
    savedQueryId: z.string().optional(),
    lastEditedAt: z.string().datetime(),
  }),
})

// 3. Dashboard State (for layout, widget selection)
export const dashboardStateCollection = createCollection({
  id: 'dashboard-state',
  schema: z.object({
    dashboardId: z.string(),
    editMode: z.boolean().default(false),
    activeWidgetId: z.string().optional(),
    layoutConfig: z.unknown(), // Grid layout
    lastModified: z.string().datetime(),
  }),
})

// 4. Query History (for SQL editor)
export const queryHistoryCollection = createCollection({
  id: 'query-history',
  schema: z.object({
    id: z.string().default(() => crypto.randomUUID()),
    sql: z.string(),
    executedAt: z.string().datetime(),
    rowCount: z.number(),
    durationMs: z.number(),
    error: z.string().optional(),
  }),
})

// 5. Reports List (for instant search)
export const reportsCollection = createCollection({
  id: 'reports',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    dataSourceId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
})

// 6. Charts List (for instant search)
export const chartsCollection = createCollection({
  id: 'charts',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    chartType: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
})

// 7. Dashboards List (for instant search)
export const dashboardsCollection = createCollection({
  id: 'dashboards',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    isPublic: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
})
