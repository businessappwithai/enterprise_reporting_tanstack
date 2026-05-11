import { createAPIFileRoute } from '@tanstack/react-start/server'
import { requireAuth } from '@/lib/auth/middleware'
import { getDb } from '@/lib/db/config'

export const Route = createAPIFileRoute('/api/data-sources')({
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

      return {
        success: true,
        data: dataSources,
      }
    } catch (error) {
      console.error('Error fetching data sources:', error)
      return {
        success: false,
        error: { message: 'Failed to fetch data sources' },
      }
    }
  },
})
