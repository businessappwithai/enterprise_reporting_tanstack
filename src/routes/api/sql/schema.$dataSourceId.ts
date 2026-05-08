import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start/server'
import { getDb } from '@/lib/db/config'
import { getConnection } from '@/lib/db/connection-manager'
import { introspectSchema } from '@/lib/sql/schema-introspection'
import { SyncService } from '@/lib/metadata/sync-service'
import { verifySession } from '@/lib/auth/session'
import type { DataSource } from '@/types/database'

async function getSession(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/session_token=([^;]+)/)
  const token = match?.[1]
  if (!token) return null
  return verifySession(token)
}

export const Route = createFileRoute('/api/sql/schema/$dataSourceId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const { dataSourceId } = params

          const db = getDb()
          const dataSource = await db<DataSource>('data_sources')
            .where('id', dataSourceId)
            .where('is_active', true)
            .first()

          if (!dataSource) {
            return json({ success: false, error: { code: 'NOT_FOUND', message: 'Data source not found or not active' } }, { status: 404 })
          }

          const connection = await getConnection(dataSource)
          const { schema, logs } = await introspectSchema(connection, dataSource.client_type)

          let syncResult
          try {
            syncResult = await SyncService.syncDataSource(dataSourceId, session.user.id)
          } catch (e) {
            console.error('[Schema Sync] Failed to sync metadata:', e)
          }

          if (schema.tables.length === 0 && schema.views.length === 0) {
            return json({
              success: true,
              data: { ...schema, logs },
              warning: 'No tables or views found in this database. The database may be empty or you may not have permission to access the tables.',
            })
          }

          return json({
            success: true,
            data: {
              ...schema,
              logs,
              metadataSync: syncResult ? {
                entitiesCreated: syncResult.entitiesCreated,
                entitiesUpdated: syncResult.entitiesUpdated,
                fieldsCreated: syncResult.fieldsCreated,
                fieldsUpdated: syncResult.fieldsUpdated,
              } : undefined,
            },
          })
        } catch (error) {
          console.error('Schema introspection error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'

          if (errorMessage.includes('SQLITE_CANTOPEN')) {
            return json({
              success: false,
              error: {
                code: 'DATABASE_NOT_FOUND',
                message: 'Database file not found. Please check the file path in the data source configuration.',
              },
            }, { status: 404 })
          }

          return json({
            success: false,
            error: { code: 'INTROSPECTION_ERROR', message: errorMessage },
          }, { status: 500 })
        }
      },
    },
  },
})
