import { createAPIFileRoute } from '@tanstack/react-start/server'
import { requireAuth } from '@/lib/auth/middleware'
import { getDb } from '@/lib/db/config'

export const Route = createAPIFileRoute('/api/data-sources/active')({
  GET: async () => {
    try {
      const session = await requireAuth()
      const db = getDb()

      // Get all active data sources
      const dataSources = await db
        .selectFrom('data_sources')
        .where('is_active', '=', true)
        .where('is_deleted', '=', false)
        .selectAll()
        .execute()

      // For now, return the first active data source as the "active" one
      // In a real app, this would be stored per-user in a session
      const activeDataSource = dataSources[0] || null

      return {
        success: true,
        data: {
          activeDataSource,
        },
      }
    } catch (error) {
      console.error('Error fetching active data source:', error)
      return {
        success: false,
        error: {
          message: 'Failed to fetch active data source',
        },
      }
    }
  },

  POST: async ({ request }) => {
    try {
      const session = await requireAuth()
      const body = (await request.json()) as { dataSourceId: string }
      const { dataSourceId } = body

      if (!dataSourceId) {
        return {
          success: false,
          error: { message: 'dataSourceId is required' },
        }
      }

      const db = getDb()
      const dataSource = await db
        .selectFrom('data_sources')
        .where('id', '=', dataSourceId)
        .where('is_active', '=', true)
        .where('is_deleted', '=', false)
        .selectAll()
        .executeTakeFirst()

      if (!dataSource) {
        return {
          success: false,
          error: { message: 'Data source not found' },
        }
      }

      // In a real app, you'd store this in user session
      // For now, just validate the data source exists
      return {
        success: true,
        data: {
          activeDataSource: dataSource,
        },
      }
    } catch (error) {
      console.error('Error setting active data source:', error)
      return {
        success: false,
        error: {
          message: 'Failed to set active data source',
        },
      }
    }
  },
})
