/**
 * GET /api/datasets/[id]/parquet — Stream the dataset file.
 * Supports Range requests, ETag caching, and conditional requests.
 */

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/config';
import { getExportPath } from '@/lib/export/storage';
import { readFileSync, statSync, existsSync } from 'fs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = getDb();

    const dataset = await db('dataset_cache')
      .where({ id, status: 'ready' })
      .first();

    if (!dataset) {
      return NextResponse.json(
        { success: false, error: { code: 'RES_001', message: 'Dataset not found or not ready' } },
        { status: 404 },
      );
    }

    const filePath = getExportPath(dataset.file_path);
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: { code: 'RES_001', message: 'Dataset file not found' } },
        { status: 404 },
      );
    }

    const stat = statSync(filePath);
    const etag = `"${dataset.hash}"`;

    // Conditional request — ETag
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    // Read file
    const buffer = readFileSync(filePath);

    // Range request support
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : stat.size - 1;
        const slice = buffer.slice(start, end + 1);

        return new NextResponse(slice, {
          status: 206,
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Content-Length': String(slice.byteLength),
            'Accept-Ranges': 'bytes',
            ETag: etag,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }

    // Update last accessed
    await db('dataset_cache')
      .where({ id })
      .update({ last_accessed_at: new Date().toISOString() });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${dataset.name}.parquet"`,
        'Content-Length': String(stat.size),
        'Accept-Ranges': 'bytes',
        ETag: etag,
        'Last-Modified': new Date(dataset.updated_at).toUTCString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Failed to stream dataset:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SRV_001', message: 'Failed to stream dataset' } },
      { status: 500 },
    );
  }
}
