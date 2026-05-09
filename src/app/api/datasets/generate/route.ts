/**
 * POST /api/datasets/generate — Trigger a new dataset export.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/config";
import { exportToParquet } from "@/lib/export/parquet-exporter";
import { nanoid } from "nanoid";
import { createHash } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dataSourceId, query, name, description, options } = body;

    if (!dataSourceId || !query || !name) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VAL_001",
            message: "dataSourceId, query, and name are required",
          },
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const datasetId = nanoid();
    const now = new Date().toISOString();

    // Insert pending record
    await db("dataset_cache").insert({
      id: datasetId,
      name,
      description: description ?? null,
      data_source_id: dataSourceId,
      query,
      row_count: 0,
      file_size: 0,
      compressed_size: 0,
      schema: "[]",
      file_path: "",
      hash: "",
      created_at: now,
      updated_at: now,
      status: "pending",
      created_by: "system",
      permissions: "{}",
    });

    // Run export (inline for simplicity; in production this goes to BullMQ)
    try {
      const result = await exportToParquet({
        dataSourceId,
        query,
        outputFileName: name.replace(/[^a-zA-Z0-9_-]/g, "_"),
        compression: options?.compression ?? "snappy",
        rowGroupSize: options?.rowGroupSize,
        maxFileSize: options?.maxFileSize,
      });

      const hash = createHash("sha256")
        .update(`${datasetId}_${result.rowCount}_${result.totalSize}`)
        .digest("hex")
        .slice(0, 16);

      await db("dataset_cache")
        .where({ id: datasetId })
        .update({
          row_count: result.rowCount,
          file_size: result.totalSize,
          compressed_size: result.totalSize,
          schema: JSON.stringify(result.schema),
          file_path: result.files[0],
          hash,
          updated_at: new Date().toISOString(),
          status: "ready",
        });

      return NextResponse.json({
        success: true,
        data: {
          id: datasetId,
          status: "completed",
          rowCount: result.rowCount,
          fileSize: result.totalSize,
          duration: result.duration,
        },
      });
    } catch (exportErr) {
      await db("dataset_cache")
        .where({ id: datasetId })
        .update({
          status: "error",
          error_message: exportErr instanceof Error ? exportErr.message : String(exportErr),
          updated_at: new Date().toISOString(),
        });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "OPS_001",
            message: "Export failed",
            details: exportErr instanceof Error ? exportErr.message : String(exportErr),
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to generate dataset:", error);
    return NextResponse.json(
      { success: false, error: { code: "SRV_001", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
