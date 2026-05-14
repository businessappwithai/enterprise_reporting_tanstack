import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { auth } from '@/lib/auth/config'
import { getDb } from '@/lib/db/config'
import { v4 as uuidv4 } from 'uuid'

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
      POST: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { message: 'Not authenticated' } }, { status: 401 })
          }

          const body = await request.json() as {
            name: string
            description?: string
            dataSourceId: string
            sqlContent: string
          }

          if (!body.name || !body.dataSourceId || !body.sqlContent) {
            return json({ success: false, error: { message: 'Missing required fields' } }, { status: 400 })
          }

          const id = uuidv4()
          const db = getDb()

          const now = new Date().toISOString()
          await db.insertInto('saved_queries').values({
            id,
            created_by: session.user.id,
            name: body.name,
            description: body.description || null,
            data_source_id: body.dataSourceId,
            sql_content: body.sqlContent,
            created_at: now,
            updated_at: now,
          }).execute()

          return json({ success: true, data: { id } }, { status: 201 })
        } catch (error) {
          console.error('Error creating query:', error)
          return json({ success: false, error: { message: 'Failed to create query' } }, { status: 500 })
        }
      },
    },
  },
})
