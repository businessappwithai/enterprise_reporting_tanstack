import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { requireAuth } from '@/lib/auth/middleware'
import { getDb } from '@/lib/db/config'

export const Route = createFileRoute('/api/data-sources/')({
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

          return json({
            success: true,
            data: dataSources,
          })
        } catch (error) {
          console.error('Error fetching data sources:', error)
          return json({
            success: false,
            error: { message: 'Failed to fetch data sources' },
          }, { status: 500 })
        }
      },
    },
  },
})
