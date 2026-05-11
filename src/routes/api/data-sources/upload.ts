import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { auth } from '@/lib/auth/config'
import { getDb } from '@/lib/db/config'

async function getSession(request: Request) {
  return auth(request)
}

export const Route = createFileRoute('/api/data-sources/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json(
              { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
              { status: 401 }
            )
          }

          const formData = await request.formData()
          const file = formData.get('file') as File | null

          if (!file) {
            return json(
              { success: false, error: { message: 'No file provided' } },
              { status: 400 }
            )
          }

          // Parse the JSON file
          const fileContent = await file.text()
          let dataSourceConfig: any

          try {
            dataSourceConfig = JSON.parse(fileContent)
          } catch {
            return json(
              { success: false, error: { message: 'Invalid JSON file' } },
              { status: 400 }
            )
          }

          if (!dataSourceConfig.name || !dataSourceConfig.client_type || !dataSourceConfig.connection_config) {
            return json(
              { success: false, error: { message: 'Missing required fields: name, client_type, connection_config' } },
              { status: 400 }
            )
          }

          const db = getDb()
          const { lastInsertRowid } = await db
            .insertInto('data_sources')
            .values({
              name: dataSourceConfig.name,
              description: dataSourceConfig.description || null,
              client_type: dataSourceConfig.client_type,
              connection_config: JSON.stringify(dataSourceConfig.connection_config),
              is_active: dataSourceConfig.is_active !== false,
              is_editable: dataSourceConfig.is_editable !== false,
              created_by: session.user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .executeTakeFirstOrThrow()

          return json(
            {
              success: true,
              data: { id: lastInsertRowid, name: dataSourceConfig.name },
            },
            { status: 201 }
          )
        } catch (error) {
          console.error('Error uploading data source:', error)
          return json(
            { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to upload data source' } },
            { status: 500 }
          )
        }
      },
    },
  },
})
