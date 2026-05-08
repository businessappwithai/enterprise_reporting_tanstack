'use server'

import { createServerFn } from '@tanstack/react-start'
import { getDb } from '@/lib/db/config'
import { logAudit } from '@/lib/security/audit'
import { randomUUID } from 'crypto'
import type { ReportDefinition } from '@/types/database'
import { requireAuth } from '@/lib/auth/middleware'

interface ListReportsInput {
  page?: number
  pageSize?: number
}

interface CreateReportInput {
  name: string
  description?: string
  savedQueryId?: string
  columnConfig?: unknown[]
  filterConfig?: unknown
  sortConfig?: unknown
  paginationConfig?: unknown
  exportFormats?: string[]
}

interface UpdateReportInput {
  id: string
  name?: string
  description?: string
  columnConfig?: unknown[]
  filterConfig?: unknown
  sortConfig?: unknown
}

export const listReports = createServerFn({
  method: 'GET',
}).handler(async (input: ListReportsInput) => {
  const session = await requireAuth()
  const { page = 0, pageSize = 20 } = input

  const db = getDb()
  const reports = await db<ReportDefinition>('report_definitions')
    .orderBy('created_at', 'desc')
    .limit(pageSize)
    .offset(page * pageSize)

  const countResult = await db<ReportDefinition>('report_definitions').count('* as count').first()
  const total = Number((countResult as { count?: string })?.count || 0)

  return {
    items: reports,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  }
})

export const getReport = createServerFn({
  method: 'GET',
}).handler(async (input: { id: string }) => {
  const session = await requireAuth()
  const { id } = input

  const db = getDb()
  const report = await db<ReportDefinition>('report_definitions')
    .where('id', id)
    .first()

  if (!report) {
    throw new Error('Report not found')
  }

  return report
})

export const createReport = createServerFn({
  method: 'POST',
}).handler(async (input: CreateReportInput) => {
  const session = await requireAuth()

  const { name, description, savedQueryId, columnConfig, filterConfig, sortConfig, paginationConfig, exportFormats } = input

  if (!name) {
    throw new Error('Name is required')
  }

  const db = getDb()
  const id = randomUUID()

  await db<ReportDefinition>('report_definitions').insert({
    id,
    name,
    description: description || null,
    saved_query_id: savedQueryId || null,
    column_config: JSON.stringify(columnConfig || []),
    filter_config: filterConfig ? JSON.stringify(filterConfig) : null,
    sort_config: sortConfig ? JSON.stringify(sortConfig) : null,
    pagination_config: paginationConfig ? JSON.stringify(paginationConfig) : null,
    export_formats: JSON.stringify(exportFormats || ['csv', 'xlsx', 'pdf']),
    created_by: session.user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  await logAudit({
    userId: session.user.id,
    action: 'create',
    resourceType: 'report',
    resourceId: id,
    details: { name },
  })

  return { id }
})

export const updateReport = createServerFn({
  method: 'PUT',
}).handler(async (input: UpdateReportInput) => {
  const session = await requireAuth()
  const { id, ...updates } = input

  const db = getDb()
  await db<ReportDefinition>('report_definitions')
    .where('id', id)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })

  await logAudit({
    userId: session.user.id,
    action: 'update',
    resourceType: 'report',
    resourceId: id,
    details: updates,
  })

  return { success: true }
})

export const deleteReport = createServerFn({
  method: 'DELETE',
}).handler(async (input: { id: string }) => {
  const session = await requireAuth()
  const { id } = input

  const db = getDb()
  await db<ReportDefinition>('report_definitions').where('id', id).delete()

  await logAudit({
    userId: session.user.id,
    action: 'delete',
    resourceType: 'report',
    resourceId: id,
  })

  return { success: true }
})
