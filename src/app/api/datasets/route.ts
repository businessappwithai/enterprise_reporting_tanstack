/**
 * GET /api/datasets — List all available datasets.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/config";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "50", 10)));
    const dataSourceId = searchParams.get("dataSourceId");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") ?? "updated_at";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    let query = db("dataset_cache")
      .leftJoin("data_sources", "dataset_cache.data_source_id", "data_sources.id")
      .select("dataset_cache.*", "data_sources.name as data_source_name");

    if (dataSourceId) {
      query = query.where("dataset_cache.data_source_id", dataSourceId);
    }
    if (search) {
      query = query.where("dataset_cache.name", "like", `%${search}%`);
    }

    // Total count
    const countQuery = query.clone().clearSelect().count("dataset_cache.id as cnt");
    const countResult = await countQuery.first();
    const total = Number(countResult?.cnt ?? 0);

    // Paginated results
    const datasets = await query
      .orderBy(`dataset_cache.${sortBy}`, sortOrder)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return NextResponse.json({
      success: true,
      data: {
        datasets: datasets.map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          dataSourceId: d.data_source_id,
          dataSourceName: d.data_source_name,
          rowCount: d.row_count,
          fileSize: d.file_size,
          compressedSize: d.compressed_size,
          columns: JSON.parse(d.schema || "[]"),
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          lastAccessedAt: d.last_accessed_at,
          status: d.status,
        })),
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Failed to list datasets:", error);
    return NextResponse.json(
      { success: false, error: { code: "SRV_001", message: "Failed to list datasets" } },
      { status: 500 }
    );
  }
}
