import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { auth } from '@/lib/auth/config'
import { getDb } from '@/lib/db/config'

async function getSession(request: Request) {
  return auth(request)
}

export const Route = createFileRoute('/api/charts/')({
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

          const charts = await db
            .selectFrom('chart_definitions')
            .selectAll()
            .orderBy('created_at', 'desc')
            .limit(pageSize)
            .offset(page * pageSize)
            .execute()

          const countResult = await db
            .selectFrom('chart_definitions')
            .select(db.fn.count<number>('id').as('count'))
            .executeTakeFirstOrThrow()
          const total = Number(countResult.count)

          return json({
            success: true,
            data: {
              items: charts,
              meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            },
          })
        } catch (error) {
          console.error('Error fetching charts:', error)
          return json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch charts' } },
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
            chart_type: string
            chart_config: object
            data_source_id: string
          }

          if (!body.name || !body.chart_type || !body.chart_config) {
            return json(
              { success: false, error: { message: 'Missing required fields' } },
              { status: 400 }
            )
          }

          const db = getDb()
          const { lastInsertRowid } = await db
            .insertInto('chart_definitions')
            .values({
              name: body.name,
              description: body.description || null,
              chart_type: body.chart_type,
              chart_config: JSON.stringify(body.chart_config),
              data_source_id: body.data_source_id || null,
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
          console.error('Error creating chart:', error)
          return json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create chart' } },
            { status: 500 }
          )
        }
      },
    },
  },
})
