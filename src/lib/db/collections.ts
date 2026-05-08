import { createCollection, localOnlyCollectionOptions } from '@tanstack/db'

export interface Report {
  id: string
  name: string
  description?: string
  saved_query_id?: string
  column_config?: string
  filter_config?: string
  sort_config?: string
  pagination_config?: string
  export_formats?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Chart {
  id: string
  name: string
  description?: string
  chart_type: string
  data_source_id?: string
  saved_query_id?: string
  config?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  layout?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface SavedQuery {
  id: string
  name: string
  description?: string
  sql?: string
  data_source_id?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface DataSource {
  id: string
  name: string
  type: string
  description?: string
  config?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message?: string
  type?: string
  read?: boolean
  created_at?: string
}

function createSyncOptions(endpoint: string) {
  return {
    sync: {
      sync({ begin, write, commit }: {
        begin: () => void
        write: (op: { type: string; id: string; value?: unknown }) => void
        commit: () => void
      }) {
        let cursor: string | undefined

        const poll = async () => {
          try {
            const url = new URL(endpoint, window.location.origin)
            if (cursor) url.searchParams.set('cursor', cursor)

            const res = await fetch(url.toString())
            if (!res.ok) return

            const { items, nextCursor } = await res.json()

            begin()
            for (const item of items as Array<{ op: string; id: string; value?: unknown }>) {
              write({ type: item.op, id: item.id, value: item.value })
            }
            commit()

            if (nextCursor) cursor = nextCursor as string
          } catch {
          }
        }

        poll()
        const interval = setInterval(poll, 5000)

        return () => clearInterval(interval)
      },
    },
  }
}

export const reportsCollection = typeof window !== 'undefined'
  ? createCollection<Report, 'id'>({
      id: 'reports',
      getKey: (r) => r.id,
      ...createSyncOptions('/api/sync/reports'),
    })
  : null

export const chartsCollection = typeof window !== 'undefined'
  ? createCollection<Chart, 'id'>({
      id: 'charts',
      getKey: (c) => c.id,
      ...createSyncOptions('/api/sync/charts'),
    })
  : null

export const dashboardsCollection = typeof window !== 'undefined'
  ? createCollection<Dashboard, 'id'>({
      id: 'dashboards',
      getKey: (d) => d.id,
      ...createSyncOptions('/api/sync/dashboards'),
    })
  : null

export const queriesCollection = typeof window !== 'undefined'
  ? createCollection<SavedQuery, 'id'>({
      id: 'saved_queries',
      getKey: (q) => q.id,
      ...createSyncOptions('/api/sync/queries'),
    })
  : null

export const notificationsCollection = typeof window !== 'undefined'
  ? createCollection<Notification, 'id'>({
      ...localOnlyCollectionOptions<Notification, 'id'>({
        id: 'notifications',
        getKey: (n) => n.id,
      }),
    })
  : null
