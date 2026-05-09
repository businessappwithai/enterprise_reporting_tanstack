/**
 * GET  /api/datasets/[id] — Get dataset metadata.
 * DELETE /api/datasets/[id] — Delete a dataset.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/config";
import { deleteExportFile } from "@/lib/export/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();

    const dataset = await db("dataset_cache")
      .leftJoin("data_sources", "dataset_cache.data_source_id", "data_sources.id")
      .select("dataset_cache.*", "data_sources.name as data_source_name")
      .where("dataset_cache.id", id)
      .first();

    if (!dataset) {
      return NextResponse.json(
        { success: false, error: { code: "RES_001", message: "Dataset not found" } },
        { status: 404 }
      );
    }

    // Update last accessed timestamp
    await db("dataset_cache").where({ id }).update({ last_accessed_at: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      data: {
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        dataSourceId: dataset.data_source_id,
        dataSourceName: dataset.data_source_name,
        query: dataset.query,
        rowCount: dataset.row_count,
        fileSize: dataset.file_size,
        compressedSize: dataset.compressed_size,
        compressionRatio:
          dataset.file_size > 0
            ? dataset.file_size / (dataset.compressed_size || dataset.file_size)
            : 1,
        columns: JSON.parse(dataset.schema || "[]"),
        createdAt: dataset.created_at,
        updatedAt: dataset.updated_at,
        lastAccessedAt: dataset.last_accessed_at,
        downloadUrl: `/api/datasets/${id}/parquet`,
        arrowDownloadUrl: `/api/datasets/${id}/arrow`,
        status: dataset.status,
      },
    });
  } catch (error) {
    console.error("Failed to get dataset:", error);
    return NextResponse.json(
      { success: false, error: { code: "SRV_001", message: "Failed to get dataset" } },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();

    const dataset = await db("dataset_cache").where({ id }).first();
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: { code: "RES_001", message: "Dataset not found" } },
        { status: 404 }
      );
    }

    // Delete refresh jobs
    await db("dataset_refresh_jobs").where({ dataset_id: id }).del();

    // Delete the database record
    await db("dataset_cache").where({ id }).del();

    // Delete the file
    if (dataset.file_path) {
      try {
        deleteExportFile(dataset.file_path);
      } catch {
        // File may already be deleted
      }
    }

    return NextResponse.json({ success: true, data: { id, deleted: true } });
  } catch (error) {
    console.error("Failed to delete dataset:", error);
    return NextResponse.json(
      { success: false, error: { code: "SRV_001", message: "Failed to delete dataset" } },
      { status: 500 }
    );
  }
}
