import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { auth } from '@/lib/auth/config'
import { getDb } from '@/lib/db/config'

async function getSession(request: Request) {
  return auth(request)
}

export const Route = createFileRoute('/api/queries')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { message: 'Not authenticated' } }, { status: 401 })
          }

          const db = getDb()
          const queries = await db.selectFrom('saved_queries').selectAll().execute()

          return json({ success: true, data: queries })
        } catch (error) {
          console.error('Error fetching queries:', error)
          return json({ success: false, error: { message: 'Failed to fetch queries' } }, { status: 500 })
        }
      },
    },
  },
})
