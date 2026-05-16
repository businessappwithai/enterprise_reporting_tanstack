import { createAPIFileRoute } from '@tanstack/react-start/server'
import { requireAuth } from '@/lib/auth/middleware'
import { getDb } from '@/lib/db/config'
import { EntityService } from '@/lib/metadata/entity-service'

export const Route = createAPIFileRoute('/api/metadata/entities')({
  GET: async (req) => {
    const session = await requireAuth()
    const url = new URL(req.url)
    const dataSourceId = url.searchParams.get('data_source_id')
    const includeHidden = url.searchParams.get('include_hidden') === 'true'
    const isActive = url.searchParams.get('is_active') !== 'false'

    if (!dataSourceId) {
      return new Response(
        JSON.stringify({ error: 'data_source_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    try {
      const db = getDb()
      const entityService = new EntityService(db)

      let query = entityService.byDataSource(dataSourceId)

      if (includeHidden) {
        query = query.includeHidden()
      } else {
        query = query.byHidden(false)
      }

      if (!isActive) {
        query = query.byActive(false)
      } else {
        query = query.byActive(true)
      }

      const result = await query.withCount()

      return new Response(
        JSON.stringify({
          data: {
            entities: result.entities,
            total: result.total,
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      console.error('[MetadataEntities API] Error:', error)
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch entities',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  },
})
