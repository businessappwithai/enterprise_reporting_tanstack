import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { auth } from '@/lib/auth/config'
import { getDb } from '@/lib/db/config'

async function getSession(request: Request) {
  return auth(request)
}

export const Route = createFileRoute('/api/data-sources/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json(
              { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
              { status: 401 }
            )
          }

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
