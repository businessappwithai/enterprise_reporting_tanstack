import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import type {
  ColumnDefinition,
  ReportColorTheme,
  DataSource,
} from "@/types/database";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth();
}

function hexToARGB(hex: string | undefined): string {
  if (!hex) return "FFE0E0E0";
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length === 8) return cleanHex.toUpperCase();
  if (cleanHex.length === 6) return `FF${cleanHex}`.toUpperCase();
  if (cleanHex.length === 3) {
    const expanded = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
    return `FF${expanded}`.toUpperCase();
  }
  return "FFE0E0E0";
}

function hexToRGB(hex: string | undefined): { r: number; g: number; b: number } {
  if (!hex) return { r: 240, g: 240, b: 240 };
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  if (cleanHex.length === 3) {
    const expanded = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
    return {
      r: parseInt(expanded.substring(0, 2), 16),
      g: parseInt(expanded.substring(2, 4), 16),
      b: parseInt(expanded.substring(4, 6), 16),
    };
  }
  return { r: 240, g: 240, b: 240 };
}

function parseColorTheme(colorThemeStr: string | null): ReportColorTheme | null {
  if (!colorThemeStr) return null;
  try {
    return JSON.parse(colorThemeStr) as ReportColorTheme;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/reports/$id/export")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const body = await request.json();
          const { format = "csv" } = body;

          const { getDb } = await import("@/lib/db/config");
          const { getConnection } = await import("@/lib/db/connection-manager");
          const { isReadOnlyQuery } = await import("@/lib/sql/validator");
          const db = getDb();

          const report = await db
            .selectFrom("report_definitions")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          if (!report) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Report not found" } },
              { status: 404 }
            );
          }

          let isFormatEnabled = true;
          if (report.export_formats) {
            try {
              const parsedFormats = JSON.parse(report.export_formats);
              if (Array.isArray(parsedFormats)) {
                const formatKey = format === "xlsx" ? "excel" : format;
                isFormatEnabled = parsedFormats.includes(formatKey);
              } else {
                const formatKey = format === "xlsx" ? "excel" : format;
                isFormatEnabled = parsedFormats[formatKey] !== false;
              }
            } catch {
              /* ignore */
            }
          }

          if (!isFormatEnabled) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: `${format.toUpperCase()} export is not enabled for this report`,
                },
              },
              { status: 403 }
            );
          }

          if (!report.saved_query_id) {
            return json(
              {
                success: false,
                error: { code: "NO_QUERY", message: "Report has no associated query" },
              },
              { status: 400 }
            );
          }

          const query = await db
            .selectFrom("saved_queries")
            .selectAll()
            .where("id", "=", report.saved_query_id)
            .executeTakeFirst();

          if (!query) {
            return json(
              {
                success: false,
                error: { code: "QUERY_NOT_FOUND", message: "Associated query not found" },
              },
              { status: 404 }
            );
          }

          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", query.data_source_id)
            .where("is_active", "=", true)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              {
                success: false,
                error: { code: "DATASOURCE_NOT_FOUND", message: "Data source not found" },
              },
              { status: 404 }
            );
          }

          if (!isReadOnlyQuery(query.sql_content)) {
            return json(
              {
                success: false,
                error: { code: "INVALID_QUERY", message: "Report query must be a SELECT query" },
              },
              { status: 400 }
            );
          }

          const connection = await getConnection(dataSource as unknown as DataSource);

          const maxExportRows = parseInt(process.env.EXPORT_PAGE_SIZE || "1000");
          const sqlToRun = query.sql_content.replace(/;$/, "").trim();
          const result = await connection.raw(`${sqlToRun} LIMIT ${maxExportRows}`);

          let rows: Record<string, unknown>[] = [];
          if (Array.isArray(result)) rows = result;
          else if (result.rows) rows = result.rows;
          else if (result[0]) rows = Array.isArray(result[0]) ? result[0] : [result[0]];

          let columnConfig: ColumnDefinition[] = [];
          if (report.column_config) {
            try {
              columnConfig = JSON.parse(report.column_config);
            } catch {
              /* ignore */
            }
          }

          let filteredRows = rows;
          let headers: string[] = [];

          if (columnConfig.length > 0) {
            const visibleColumns = columnConfig.filter((col) => col.visible);
            headers = visibleColumns.map((col) => col.header);
            filteredRows = rows.map((row) => {
              const filteredRow: Record<string, unknown> = {};
              visibleColumns.forEach((col) => {
                if (col.field in row) filteredRow[col.field] = row[col.field];
              });
              return filteredRow;
            });
          } else {
            if (rows.length > 0) headers = Object.keys(rows[0]);
          }

          if (format === "csv") {
            const csvRows = [
              headers.join(","),
              ...filteredRows.map((row) =>
                headers
                  .map((header) => {
                    const colDef = columnConfig.find((c) => c.header === header);
                    const field = colDef?.field || header;
                    const value = row[field];
                    const stringValue = value === null || value === undefined ? "" : String(value);
                    if (
                      stringValue.includes(",") ||
                      stringValue.includes('"') ||
                      stringValue.includes("\n")
                    ) {
                      return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                  })
                  .join(",")
              ),
            ];
            return new Response(csvRows.join("\n"), {
              headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${report.name || "report"}.csv"`,
              },
            });
          }

          if (format === "excel" || format === "xlsx") {
            const colorTheme = parseColorTheme(report.color_theme ?? null);
            const ExcelJS = await import("exceljs");
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Report Data");

            const headerRow = worksheet.addRow(headers);
            headerRow.eachCell((cell) => {
              cell.font = {
                bold:
                  colorTheme?.headerFontWeight === "bold" || colorTheme?.headerFontWeight === "700",
                color: { argb: hexToARGB(colorTheme?.headerTextColor) },
              };
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: hexToARGB(colorTheme?.headerBackgroundColor) },
              };
              cell.border = {
                top: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
                left: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
                bottom: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
                right: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
              };
            });

            filteredRows.forEach((row, rowIndex) => {
              const isAltRow = rowIndex % 2 !== 0;
              const values = headers.map((header) => {
                const colDef = columnConfig.find((c) => c.header === header);
                const field = colDef?.field || header;
                const value = row[field];
                return value === null || value === undefined ? "" : value;
              });
              const dataRow = worksheet.addRow(values);
              dataRow.eachCell((cell) => {
                cell.font = {
                  color: {
                    argb: hexToARGB(
                      isAltRow ? colorTheme?.alternatingRowTextColor : colorTheme?.rowTextColor
                    ),
                  },
                };
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: {
                    argb: hexToARGB(
                      isAltRow
                        ? colorTheme?.alternatingRowBackgroundColor
                        : colorTheme?.rowBackgroundColor
                    ),
                  },
                };
                cell.border = {
                  top: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
                  left: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
                  bottom: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
                  right: { style: "thin", color: { argb: hexToARGB(colorTheme?.borderColor) } },
                };
              });
            });

            worksheet.columns.forEach((column) => {
              let maxLength = 0;
              column.eachCell({ includeEmpty: true }, (cell) => {
                const length = cell.value ? String(cell.value).length : 10;
                if (length > maxLength) maxLength = length;
              });
              column.width = maxLength < 10 ? 10 : maxLength + 2;
            });

            const buffer = await workbook.xlsx.writeBuffer();
            return new Response(Buffer.from(buffer), {
              headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${report.name || "report"}.xlsx"`,
              },
            });
          }

          if (format === "pdf") {
            const colorTheme = parseColorTheme(report.color_theme ?? null);
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 10;
            const tableTop = 30;
            const rowHeight = 7;
            const cellPadding = 2;

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(report.name || "Report", margin, 15);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 22);

            const numColumns = headers.length;
            const columnWidth = (pageWidth - 2 * margin) / numColumns;
            let yPosition = tableTop;

            const drawCell = (
              x: number,
              y: number,
              width: number,
              height: number,
              text: string,
              bgColor: { r: number; g: number; b: number },
              textColor: { r: number; g: number; b: number },
              isBold = false
            ) => {
              doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
              doc.rect(x, y - rowHeight + cellPadding, width, rowHeight, "F");
              doc.setTextColor(textColor.r, textColor.g, textColor.b);
              doc.setFont("helvetica", isBold ? "bold" : "normal");
              const maxWidth = width - 2 * cellPadding;
              let displayText = text;
              if (doc.getTextWidth(text) > maxWidth) {
                while (doc.getTextWidth(displayText + "...") > maxWidth && displayText.length > 0) {
                  displayText = displayText.slice(0, -1);
                }
                displayText = displayText + "...";
              }
              doc.text(displayText, x + cellPadding, y);
            };

            doc.setFontSize(8);
            const headerBgColor = hexToRGB(colorTheme?.headerBackgroundColor);
            const headerTextColor = hexToRGB(colorTheme?.headerTextColor);
            const headerFontBold =
              colorTheme?.headerFontWeight === "bold" || colorTheme?.headerFontWeight === "700";

            headers.forEach((header, index) => {
              drawCell(
                margin + index * columnWidth,
                yPosition,
                columnWidth,
                rowHeight,
                String(header),
                headerBgColor,
                headerTextColor,
                headerFontBold
              );
            });
            yPosition += rowHeight;

            filteredRows.forEach((row, rowIndex) => {
              const isAltRow = rowIndex % 2 !== 0;
              const rowBgColor = hexToRGB(
                isAltRow
                  ? colorTheme?.alternatingRowBackgroundColor
                  : colorTheme?.rowBackgroundColor
              );
              const rowTextColor = hexToRGB(
                isAltRow ? colorTheme?.alternatingRowTextColor : colorTheme?.rowTextColor
              );

              if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = tableTop;
                headers.forEach((header, index) => {
                  drawCell(
                    margin + index * columnWidth,
                    yPosition,
                    columnWidth,
                    rowHeight,
                    String(header),
                    headerBgColor,
                    headerTextColor,
                    headerFontBold
                  );
                });
                yPosition += rowHeight;
              }

              headers.forEach((header, colIndex) => {
                const colDef = columnConfig.find((c) => c.header === header);
                const field = colDef?.field || header;
                const value = row[field];
                const stringValue = value === null || value === undefined ? "" : String(value);
                drawCell(
                  margin + colIndex * columnWidth,
                  yPosition,
                  columnWidth,
                  rowHeight,
                  stringValue,
                  rowBgColor,
                  rowTextColor,
                  false
                );
              });
              yPosition += rowHeight;
            });

            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              doc.setPage(i);
              doc.setFontSize(8);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(0, 0, 0);
              doc.text(
                `Page ${i} of ${totalPages} | Total rows: ${filteredRows.length}`,
                pageWidth / 2,
                pageHeight - 5,
                { align: "center" }
              );
            }

            const pdfBytes = doc.output("arraybuffer");
            return new Response(Buffer.from(pdfBytes), {
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${report.name || "report"}.pdf"`,
              },
            });
          }

          return json(
            { success: false, error: { code: "INVALID_FORMAT", message: "Invalid export format" } },
            { status: 400 }
          );
        } catch (error) {
          console.error("Error exporting report:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to export report" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
