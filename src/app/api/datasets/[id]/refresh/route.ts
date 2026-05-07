/**
 * POST /api/datasets/[id]/refresh — Re-export dataset from source.
 */

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/config';
import { exportToParquet } from '@/lib/export/parquet-exporter';
import { deleteExportFile } from '@/lib/export/storage';
import { createHash } from 'crypto';
import { nanoid } from 'nanoid';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = getDb();

    const dataset = await db('dataset_cache').where({ id }).first();
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: { code: 'RES_001', message: 'Dataset not found' } },
        { status: 404 },
      );
    }

    const jobId = nanoid();
    const now = new Date().toISOString();

    // Create refresh job record
    await db('dataset_refresh_jobs').insert({
      id: jobId,
      dataset_id: id,
      status: 'processing',
      started_at: now,
      created_by: 'system',
      created_at: now,
    });

    try {
      const result = await exportToParquet({
        dataSourceId: dataset.data_source_id,
        query: dataset.query,
        outputFileName: dataset.name.replace(/[^a-zA-Z0-9_-]/g, '_'),
      });

      const hash = createHash('sha256')
        .update(`${id}_${result.rowCount}_${result.totalSize}_${Date.now()}`)
        .digest('hex')
        .slice(0, 16);

      // Delete old file
      if (dataset.file_path) {
        try {
          deleteExportFile(dataset.file_path);
        } catch { /* ignore */ }
      }

      // Update dataset record
      await db('dataset_cache').where({ id }).update({
        row_count: result.rowCount,
        file_size: result.totalSize,
        compressed_size: result.totalSize,
        schema: JSON.stringify(result.schema),
        file_path: result.files[0],
        hash,
        updated_at: new Date().toISOString(),
        last_refresh_at: new Date().toISOString(),
        status: 'ready',
        error_message: null,
      });

      // Update job
      await db('dataset_refresh_jobs').where({ id: jobId }).update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        row_count: result.rowCount,
        file_size: result.totalSize,
      });

      return NextResponse.json({
        success: true,
        data: { id, status: 'completed', jobId },
      });
    } catch (err) {
      await db('dataset_refresh_jobs').where({ id: jobId }).update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: err instanceof Error ? err.message : String(err),
      });

      return NextResponse.json(
        {
          success: false,
          error: { code: 'OPS_001', message: 'Refresh failed' },
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Failed to refresh dataset:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SRV_001', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
