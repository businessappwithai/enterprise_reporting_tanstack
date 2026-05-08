import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start/server'
import { v4 as uuidv4 } from 'uuid'
import type { ReportDefinition } from '@/types/database'

async function getSession(request: Request) {
  const { auth } = await import('@/lib/auth/config')
  return auth()
}

export const Route = createFileRoute('/api/reports')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const { searchParams } = new URL(request.url)
          const page = parseInt(searchParams.get('page') || '0', 10)
          const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

          const { getDb } = await import('@/lib/db/config')
          const db = getDb()
          const reports = await db<ReportDefinition>('report_definitions')
            .orderBy('created_at', 'desc')
            .limit(pageSize)
            .offset(page * pageSize)

          const countResult = await db<ReportDefinition>('report_definitions').count('* as count').first()
          const total = Number((countResult as { count?: string })?.count || 0)

          return json({
            success: true,
            data: {
              items: reports,
              meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            },
          })
        } catch (error) {
          console.error('Error fetching reports:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch reports' } }, { status: 500 })
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const body = await request.json()
          const { name, description, savedQueryId, columnConfig, filterConfig, sortConfig, paginationConfig, exportFormats } = body

          if (!name) {
            return json({ success: false, error: { code: 'INVALID_INPUT', message: 'Name is required' } }, { status: 400 })
          }

          const { getDb } = await import('@/lib/db/config')
          const { logAudit } = await import('@/lib/security/audit')
          const db = getDb()
          const id = uuidv4()

          await db<ReportDefinition>('report_definitions').insert({
            id,
            name,
            description,
            saved_query_id: savedQueryId,
            column_config: JSON.stringify(columnConfig || []),
            filter_config: filterConfig ? JSON.stringify(filterConfig) : undefined,
            sort_config: sortConfig ? JSON.stringify(sortConfig) : undefined,
            pagination_config: paginationConfig ? JSON.stringify(paginationConfig) : undefined,
            export_formats: exportFormats ? JSON.stringify(exportFormats) : '["csv","xlsx","pdf"]',
            created_by: session.user.id,
          })

          await logAudit({
            userId: session.user.id,
            action: 'create',
            resourceType: 'report',
            resourceId: id,
            details: { name },
          })

          const report = await db<ReportDefinition>('report_definitions').where('id', id).first()

          return json({ success: true, data: report }, { status: 201 })
        } catch (error) {
          console.error('Error creating report:', error)
          return json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create report' } }, { status: 500 })
        }
      },
    },
  },
})
