/**
 * GET /api/datasets/[id]/arrow — Stream Arrow IPC format.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/config";
import { getExportPath } from "@/lib/export/storage";
import { readFileSync, existsSync, statSync } from "fs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();

    const dataset = await db("dataset_cache").where({ id, status: "ready" }).first();

    if (!dataset) {
      return NextResponse.json(
        { success: false, error: { code: "RES_001", message: "Dataset not found or not ready" } },
        { status: 404 }
      );
    }

    const filePath = getExportPath(dataset.file_path);
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: { code: "RES_001", message: "Dataset file not found" } },
        { status: 404 }
      );
    }

    const buffer = readFileSync(filePath);
    const stat = statSync(filePath);

    await db("dataset_cache").where({ id }).update({ last_accessed_at: new Date().toISOString() });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apache.arrow.stream",
        "Content-Disposition": `attachment; filename="${dataset.name}.arrow"`,
        "Content-Length": String(stat.size),
        ETag: `"${dataset.hash}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to stream arrow dataset:", error);
    return NextResponse.json(
      { success: false, error: { code: "SRV_001", message: "Failed to stream dataset" } },
      { status: 500 }
    );
  }
}
