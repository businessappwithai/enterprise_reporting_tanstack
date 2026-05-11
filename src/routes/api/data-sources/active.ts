import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { requireAuth } from '@/lib/auth/middleware'
import { getDb } from '@/lib/db/config'

export const Route = createFileRoute('/api/data-sources/active')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const session = await requireAuth()
          const db = getDb()

          const dataSources = await db
            .selectFrom('data_sources')
            .where('is_active', '=', true)
            .where('is_deleted', '=', false)
            .selectAll()
            .execute()

          const activeDataSource = dataSources[0] || null

          return json({
            success: true,
            data: {
              activeDataSource,
            },
          })
        } catch (error) {
          console.error('Error fetching active data source:', error)
          return json({
            success: false,
            error: {
              message: 'Failed to fetch active data source',
            },
          }, { status: 500 })
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await requireAuth()
          const body = (await request.json()) as { dataSourceId: string }
          const { dataSourceId } = body

          if (!dataSourceId) {
            return json({
              success: false,
              error: { message: 'dataSourceId is required' },
            }, { status: 400 })
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
            return json({
              success: false,
              error: { message: 'Data source not found' },
            }, { status: 404 })
          }

          return json({
            success: true,
            data: {
              activeDataSource: dataSource,
            },
          })
        } catch (error) {
          console.error('Error setting active data source:', error)
          return json({
            success: false,
            error: {
              message: 'Failed to set active data source',
            },
          }, { status: 500 })
        }
      },
    },
  },
})
