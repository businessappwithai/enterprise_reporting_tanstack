import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/config";
import { getConnection } from "@/lib/db/connection-manager";
import type { ChartDefinition } from "@/types/database";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const execute = searchParams.get("execute") === "true";

    const db = getDb();

    // Get chart with public status
    const chart = await db<ChartDefinition>("chart_definitions").where("id", id).first();

    if (!chart) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Chart not found" } },
        { status: 404 }
      );
    }

    // Check if chart is public
    if (!chart.is_public) {
      return NextResponse.json(
        { success: false, error: { code: "PRIVATE", message: "This chart is private" } },
        { status: 403 }
      );
    }

    const response: any = {
      success: true,
      data: {
        id: chart.id,
        name: chart.name,
        description: chart.description,
        is_public: chart.is_public,
        chart_type: chart.chart_type,
        chart_config: chart.chart_config ? JSON.parse(chart.chart_config) : {},
        data_mapping: chart.data_mapping ? JSON.parse(chart.data_mapping) : {},
      },
    };

    // If execute=true, also fetch the chart data
    if (execute && chart.saved_query_id) {
      const query = await db("saved_queries").where("id", chart.saved_query_id).first();
      if (query) {
        try {
          const dataSource = await db("data_sources")
            .where("id", query.data_source_id)
            .where("is_active", true)
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

            response.data.results = {
              rows,
              rowCount: rows.length,
            };
          }
        } catch (error) {
          console.error("Error executing query for public chart:", error);
          response.data.results = null;
          response.data.executionError = "Failed to load chart data";
        }
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching public chart:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch chart" } },
      { status: 500 }
    );
  }
}
