import { createFileRoute } from '@tanstack/react-router'
import { json } from '@/lib/server/response'
import { getDb } from '@/lib/db/config'
import { getConnection } from '@/lib/db/connection-manager'
import { isReadOnlyQuery } from '@/lib/sql/validator'
import { logAudit } from '@/lib/security/audit'
import { verifySession } from '@/lib/auth/session'
import { sqlEditorConfig, validatePageSize } from '@/lib/config/pagination'
import type { DataSource } from '@/types/database'

const DEFAULT_TIMEOUT = 30000

async function getSession(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/session_token=([^;]+)/)
  const token = match?.[1]
  if (!token) return null
  return verifySession(token)
}

export const Route = createFileRoute('/api/sql/execute')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await getSession(request)
          if (!session?.user) {
            return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 })
          }

          const body = await request.json() as {
            sql: string
            dataSourceId: string
            parameters?: unknown[]
            limit?: number
            offset?: number
            timeout?: number
          }

          const { sql, dataSourceId, limit, offset, timeout = DEFAULT_TIMEOUT } = body

          if (!sql) {
            return json({ success: false, error: { code: 'INVALID_INPUT', message: 'SQL content is required' } }, { status: 400 })
          }

          if (!dataSourceId) {
            return json({ success: false, error: { code: 'INVALID_INPUT', message: 'Data source ID is required' } }, { status: 400 })
          }

          if (!isReadOnlyQuery(sql)) {
            return json({
              success: false,
              error: { code: 'FORBIDDEN', message: 'Only SELECT queries are allowed in the SQL editor' },
            }, { status: 403 })
          }

          const db = getDb()
          const dataSource = await db<DataSource>('data_sources')
            .where('id', dataSourceId)
            .where('is_active', true)
            .first()

          if (!dataSource) {
            return json({ success: false, error: { code: 'NOT_FOUND', message: 'Data source not found' } }, { status: 404 })
          }

          const connection = await getConnection(dataSource)

          const PAGE_SIZE = sqlEditorConfig.serverPageSize
          const MAX_CLIENT_ROWS = sqlEditorConfig.maxClientRows

          let totalRowCount = 0
          const countSQL = `SELECT COUNT(*) as total FROM (${sql.replace(/;$/, '')}) as count_query`

          try {
            const countResult = dataSource.client_type === 'sqlite3'
              ? await connection.raw(countSQL)
              : await connection.raw(countSQL).timeout(5000)

            if (Array.isArray(countResult) && countResult[0]) {
              totalRowCount = Number(countResult[0].total) || 0
            }
          } catch (e) {
            console.error('Could not count total rows:', e)
          }

          const tooLargeForInteractive = totalRowCount > MAX_CLIENT_ROWS

          if (tooLargeForInteractive) {
            return json({
              success: true,
              data: {
                columns: [],
                rows: [],
                rowCount: totalRowCount,
                executionTime: 0,
                truncated: false,
                pagination: { limit: PAGE_SIZE, offset: offset || 0, hasMore: false, serverSide: true },
                warning: {
                  code: 'DATASET_TOO_LARGE',
                  message: `Query returns ${totalRowCount.toLocaleString()} rows, which exceeds the interactive limit of ${MAX_CLIENT_ROWS.toLocaleString()} rows.`,
                  suggestion: 'Run this query as a background job instead.',
                  totalRows: totalRowCount,
                  interactiveLimit: MAX_CLIENT_ROWS,
                },
              },
            })
          }

          let limitedSQL = sql.trim()
          const effectiveLimit = validatePageSize(limit || sqlEditorConfig.serverPageSize)
          const effectiveOffset = offset || 0

          if (!/\bLIMIT\s+\d+/i.test(limitedSQL) && !/\bTOP\s+\d+/i.test(limitedSQL)) {
            if (limitedSQL.endsWith(';')) limitedSQL = limitedSQL.slice(0, -1)
            limitedSQL = `${limitedSQL} LIMIT ${effectiveLimit} OFFSET ${effectiveOffset}`
          } else if (/\bLIMIT\s+\d+/i.test(limitedSQL) && !/\bOFFSET\s+\d+/i.test(limitedSQL) && effectiveOffset > 0) {
            if (limitedSQL.endsWith(';')) limitedSQL = limitedSQL.slice(0, -1)
            limitedSQL = `${limitedSQL} OFFSET ${effectiveOffset}`
          }

          const limitMatch = limitedSQL.match(/\bLIMIT\s+(\d+)/i)
          if (limitMatch) {
            const userLimit = parseInt(limitMatch[1], 10)
            const validatedLimit = validatePageSize(userLimit)
            if (userLimit !== validatedLimit) {
              limitedSQL = limitedSQL.replace(/\bLIMIT\s+\d+/i, `LIMIT ${validatedLimit}`)
            }
          }

          const startTime = Date.now()

          const result = dataSource.client_type === 'sqlite3'
            ? await connection.raw(limitedSQL)
            : await connection.raw(limitedSQL).timeout(timeout)

          const executionTime = Date.now() - startTime

          let rows: Record<string, unknown>[] = []
          let columns: { name: string; type: string }[] = []

          if (Array.isArray(result)) {
            rows = result
          } else if (result.rows) {
            rows = result.rows
          } else if (result[0]) {
            rows = Array.isArray(result[0]) ? result[0] : [result[0]]
          }

          if (rows.length > 0) {
            columns = Object.keys(rows[0]).map((name) => ({
              name,
              type: typeof rows[0][name],
            }))
          }

          await logAudit({
            userId: session.user.id,
            action: 'execute',
            resourceType: 'query',
            resourceId: dataSourceId,
            details: { sql: sql.substring(0, 500), rowCount: rows.length, executionTime },
          })

          return json({
            success: true,
            data: {
              columns,
              rows,
              rowCount: rows.length,
              totalRows: totalRowCount,
              executionTime,
              truncated: rows.length >= PAGE_SIZE,
              pagination: {
                limit: PAGE_SIZE,
                offset: effectiveOffset,
                totalRows: totalRowCount,
                hasMore: totalRowCount > 0 ? (effectiveOffset + rows.length) < totalRowCount : false,
                serverSide: true,
                maxClientRows: MAX_CLIENT_ROWS,
              },
            },
          })
        } catch (error) {
          console.error('[SQL EXECUTE ERROR]', error)
          return json({
            success: false,
            error: {
              code: 'EXECUTION_ERROR',
              message: error instanceof Error ? error.message : 'Unknown error',
            },
          }, { status: 500 })
        }
      },
    },
  },
})
