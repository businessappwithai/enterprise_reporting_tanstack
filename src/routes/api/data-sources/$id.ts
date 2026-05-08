import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import type { DataSource } from '@/types/database'

async function getSession(request: Request) {
  const { auth } = await import('@/lib/auth/config')
  return auth()
}

export const Route = createFileRoute('/api/data-sources/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const { id } = params
          const { getDb } = await import('@/lib/db/config')
          const db = getDb()
          const dataSource = await db<DataSource>('data_sources').where('id', id).where('is_deleted', false).first()

          if (!dataSource) {
            return json({ success: false, error: { code: 'NOT_FOUND', message: 'Data source not found' } }, { status: 404 })
          }

          let connectionConfig
          try {
            const isEncrypted = dataSource.connection_config.length > 64 && /^[0-9a-fA-F]+$/.test(dataSource.connection_config)
            if (isEncrypted) {
              const { decrypt } = await import('@/lib/security/encryption')
              connectionConfig = JSON.parse(decrypt(dataSource.connection_config))
            } else {
              connectionConfig = JSON.parse(dataSource.connection_config)
              // Re-encrypt in background
              const { encrypt } = await import('@/lib/security/encryption')
              const encryptedConfig = encrypt(JSON.stringify(connectionConfig))
              db('data_sources').where('id', id).update({ connection_config: encryptedConfig }).catch(console.error)
            }
          } catch (decryptError) {
            console.error('Failed to decrypt connection config', { dataSourceId: id }, decryptError)
            throw decryptError
          }

          return json({ success: true, data: { ...dataSource, connectionConfig } })
        } catch (error) {
          console.error('Error fetching data source:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch data source' } }, { status: 500 })
        }
      },

      PATCH: async ({ request, params }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const { id } = params
          const body = await request.json()
          const { name, description, clientType, connectionConfig } = body

          if (!name || !clientType || !connectionConfig) {
            return json({ success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields' } }, { status: 400 })
          }

          const { getDb } = await import('@/lib/db/config')
          const { decrypt } = await import('@/lib/security/encryption')
          const { encrypt } = await import('@/lib/security/encryption')
          const { closeConnection } = await import('@/lib/db/connection-manager')
          const db = getDb()

          const existing = await db<DataSource>('data_sources').where('id', id).where('is_deleted', false).first()
          if (!existing) {
            return json({ success: false, error: { code: 'NOT_FOUND', message: 'Data source not found' } }, { status: 404 })
          }

          let finalConnectionConfig = connectionConfig
          if (!connectionConfig.password) {
            const existingConfig = JSON.parse(decrypt(existing.connection_config))
            finalConnectionConfig = { ...connectionConfig, password: existingConfig.password }
          }

          await db<DataSource>('data_sources').where('id', id).update({
            name, description,
            client_type: clientType,
            connection_config: encrypt(JSON.stringify(finalConnectionConfig)),
            updated_at: new Date().toISOString(),
          })

          await closeConnection(id)

          const updatedDataSource = await db<DataSource>('data_sources').where('id', id).first()
          return json({ success: true, data: updatedDataSource })
        } catch (error) {
          console.error('Error updating data source:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update data source' } }, { status: 500 })
        }
      },

      PUT: async ({ request, params }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const { id } = params
          const body = await request.json()
          const { name, description, clientType, connectionConfig } = body

          if (!name || !clientType || !connectionConfig) {
            return json({ success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields' } }, { status: 400 })
          }

          const { getDb } = await import('@/lib/db/config')
          const { decrypt } = await import('@/lib/security/encryption')
          const { encrypt } = await import('@/lib/security/encryption')
          const { closeConnection } = await import('@/lib/db/connection-manager')
          const db = getDb()

          const existing = await db<DataSource>('data_sources').where('id', id).where('is_deleted', false).first()
          if (!existing) {
            return json({ success: false, error: { code: 'NOT_FOUND', message: 'Data source not found' } }, { status: 404 })
          }

          let finalConnectionConfig = connectionConfig
          if (!connectionConfig.password) {
            const existingConfig = JSON.parse(decrypt(existing.connection_config))
            finalConnectionConfig = { ...connectionConfig, password: existingConfig.password }
          }

          await db<DataSource>('data_sources').where('id', id).update({
            name, description,
            client_type: clientType,
            connection_config: encrypt(JSON.stringify(finalConnectionConfig)),
            updated_at: new Date().toISOString(),
          })

          await closeConnection(id)

          const updatedDataSource = await db<DataSource>('data_sources').where('id', id).first()
          return json({ success: true, data: updatedDataSource })
        } catch (error) {
          console.error('Error updating data source:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update data source' } }, { status: 500 })
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const { id } = params
          const { getDb } = await import('@/lib/db/config')
          const { closeConnection } = await import('@/lib/db/connection-manager')
          const db = getDb()

          const dataSource = await db<DataSource>('data_sources').where('id', id).where('is_deleted', false).first()
          if (!dataSource) {
            return json({ success: false, error: { code: 'NOT_FOUND', message: 'Data source not found' } }, { status: 404 })
          }

          const queryCount = await db('saved_queries').where('data_source_id', id).where('is_deleted', false).count('id as count').first()
          const reportCount = await db('report_definitions')
            .join('saved_queries', 'report_definitions.saved_query_id', 'saved_queries.id')
            .where('saved_queries.data_source_id', id)
            .where('report_definitions.is_deleted', false)
            .where('saved_queries.is_deleted', false)
            .count('report_definitions.id as count')
            .first()
          const chartCount = await db('chart_definitions')
            .join('saved_queries', 'chart_definitions.saved_query_id', 'saved_queries.id')
            .where('saved_queries.data_source_id', id)
            .where('chart_definitions.is_deleted', false)
            .where('saved_queries.is_deleted', false)
            .count('chart_definitions.id as count')
            .first()

          const queries = Number(queryCount?.count || 0)
          const reports = Number(reportCount?.count || 0)
          const charts = Number(chartCount?.count || 0)

          if (queries > 0 || reports > 0 || charts > 0) {
            return json({
              success: false,
              error: { code: 'IN_USE', message: 'Cannot delete data source: it is in use', details: { queries, reports, charts } }
            }, { status: 400 })
          }

          await db<DataSource>('data_sources').where('id', id).update({
            is_deleted: true,
            is_active: false,
            deleted_at: new Date().toISOString(),
            deleted_by: session.user.id,
            updated_at: new Date().toISOString(),
          } as any)

          await closeConnection(id)

          return json({ success: true, data: { message: 'Data source deleted successfully' } })
        } catch (error) {
          console.error('Error deleting data source:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete data source' } }, { status: 500 })
        }
      },
    },
  },
})
