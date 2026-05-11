import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { auth } from '@/lib/auth/config'
import { getDb } from '@/lib/db/config'

async function getSession(request: Request) {
  return auth(request)
}

export const Route = createFileRoute('/api/dashboards/')({
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

          const { searchParams } = new URL(request.url)
          const page = parseInt(searchParams.get('page') || '0', 10)
          const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

          const db = getDb()

          const dashboards = await db
            .selectFrom('dashboard_layouts')
            .selectAll()
            .orderBy('created_at', 'desc')
            .limit(pageSize)
            .offset(page * pageSize)
            .execute()

          const countResult = await db
            .selectFrom('dashboard_layouts')
            .select(db.fn.count<number>('id').as('count'))
            .executeTakeFirstOrThrow()
          const total = Number(countResult.count)

          return json({
            success: true,
            data: {
              items: dashboards,
              meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            },
          })
        } catch (error) {
          console.error('Error fetching dashboards:', error)
          return json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch dashboards' } },
            { status: 500 }
          )
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json(
              { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
              { status: 401 }
            )
          }

          const body = (await request.json()) as {
            name: string
            description?: string
            layout: object
          }

          if (!body.name || !body.layout) {
            return json(
              { success: false, error: { message: 'Missing required fields' } },
              { status: 400 }
            )
          }

          const db = getDb()
          const { lastInsertRowid } = await db
            .insertInto('dashboard_layouts')
            .values({
              name: body.name,
              description: body.description || null,
              layout: JSON.stringify(body.layout),
              created_by: session.user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .executeTakeFirstOrThrow()

          return json(
            {
              success: true,
              data: { id: lastInsertRowid },
            },
            { status: 201 }
          )
        } catch (error) {
          console.error('Error creating dashboard:', error)
          return json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create dashboard' } },
            { status: 500 }
          )
        }
      },
    },
  },
})
