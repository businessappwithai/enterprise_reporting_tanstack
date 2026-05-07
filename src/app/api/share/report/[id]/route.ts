import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/config';
import { decrypt } from '@/lib/security/encryption';
import { getConnection } from '@/lib/db/connection-manager';
import type { ReportDefinition } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const execute = searchParams.get('execute') === 'true';

    const db = getDb();

    // Get report with public status
    const report = await db<ReportDefinition>('report_definitions')
      .where('id', id)
      .first();

    if (!report) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Report not found' } },
        { status: 404 }
      );
    }

    // Check if report is public
    if (!report.is_public) {
      return NextResponse.json(
        { success: false, error: { code: 'PRIVATE', message: 'This report is private' } },
        { status: 403 }
      );
    }

    const response: any = {
      success: true,
      data: {
        id: report.id,
        name: report.name,
        description: report.description,
        is_public: report.is_public,
        column_config: report.column_config ? JSON.parse(report.column_config) : [],
        filter_config: report.filter_config ? JSON.parse(report.filter_config) : null,
        sort_config: report.sort_config ? JSON.parse(report.sort_config) : null,
        pagination_config: report.pagination_config ? JSON.parse(report.pagination_config) : null,
      },
    };

    // If execute=true, also fetch the report data
    if (execute && report.saved_query_id) {
      const query = await db('saved_queries').where('id', report.saved_query_id).first();
      if (query) {
        try {
          const dataSource = await db('data_sources')
            .where('id', query.data_source_id)
            .where('is_active', true)
            .first();

          if (dataSource) {
            const connection = await getConnection(dataSource);
            const result = await connection.raw(query.sql_content);

            let rows: Record<string, unknown>[] = [];
            if (Array.isArray(result)) {
              rows = result;
            } else if (result.rows) {
              rows = result.rows;
            } else if (result[0]) {
              rows = Array.isArray(result[0]) ? result[0] : [result[0]];
            }

            // Get column info
            const columns = rows.length > 0 ? Object.keys(rows[0]).map((name) => ({
              name,
              type: typeof rows[0][name],
            })) : [];

            response.data.results = {
              columns,
              rows,
              rowCount: rows.length,
            };
          }
        } catch (error) {
          console.error('Error executing query for public report:', error);
          response.data.results = null;
          response.data.executionError = 'Failed to load report data';
        }
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching public report:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch report' } },
      { status: 500 }
    );
  }
}
