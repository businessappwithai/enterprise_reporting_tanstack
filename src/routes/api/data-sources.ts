import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { v4 as uuidv4 } from 'uuid'
import type { DataSource } from '@/types/database'

async function getSession(request: Request) {
  const { auth } = await import('@/lib/auth/config')
  return auth()
}

export const Route = createFileRoute('/api/data-sources')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const { getDb } = await import('@/lib/db/config')
          const db = getDb()
          const dataSources = await db<DataSource>('data_sources').where('is_deleted', false).orderBy('name')
          const sanitizedSources = dataSources.map(({ connection_config, ...rest }) => rest)

          return json({ success: true, data: { items: sanitizedSources, meta: { total: sanitizedSources.length } } })
        } catch (error) {
          console.error('Error fetching data sources:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch data sources' } }, { status: 500 })
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const body = await request.json()
          const { name, description, clientType, connectionConfig } = body

          if (!name || !clientType || !connectionConfig) {
            return json({ success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields' } }, { status: 400 })
          }

          const { getDb } = await import('@/lib/db/config')
          const { encrypt } = await import('@/lib/security/encryption')
          const { logAudit } = await import('@/lib/security/audit')
          const db = getDb()
          const id = uuidv4()
          const encryptedConfig = encrypt(JSON.stringify(connectionConfig))

          await db<DataSource>('data_sources').insert({
            id, name, description,
            client_type: clientType as any,
            connection_config: encryptedConfig,
            created_by: session.user.id,
          })

          await logAudit({ userId: session.user.id, action: 'create', resourceType: 'data_source', resourceId: id, details: { name, clientType } })

          const dataSource = await db<DataSource>('data_sources').where('id', id).first()
          return json({ success: true, data: dataSource }, { status: 201 })
        } catch (error) {
          console.error('Error creating data source:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create data source' } }, { status: 500 })
        }
      },
    },
  },
})
