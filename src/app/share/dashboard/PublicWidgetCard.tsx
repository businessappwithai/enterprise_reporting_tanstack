'use client';

/**
 * Public Widget Card - Renders widgets for public dashboard viewers.
 * Uses public share APIs that don't require authentication.
 */

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartRenderer } from '@/components/charts/chart-renderer';
import { DataTable } from '@/components/reporting/data-table';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { ChartType, ChartConfig, DataMapping } from '@/types/database';

interface PublicWidgetCardProps {
  widget: {
    id: string;
    widget_type: string;
    report_id: string | null;
    chart_id: string | null;
    title?: string;
  };
}

export function PublicWidgetCard({ widget }: PublicWidgetCardProps) {
  // Fetch chart data from public API
  const { data: chartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['public-chart', widget.chart_id],
    queryFn: async () => {
      if (!widget.chart_id) return null;
      const res = await fetch(`/api/share/chart/${widget.chart_id}?execute=true`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    },
    enabled: widget.widget_type === 'chart' && !!widget.chart_id,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Fetch report data from public API
  const { data: reportData, isLoading: isLoadingReport } = useQuery({
    queryKey: ['public-report', widget.report_id],
    queryFn: async () => {
      if (!widget.report_id) return null;
      const res = await fetch(`/api/share/report/${widget.report_id}?execute=true`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    },
    enabled: widget.widget_type === 'report' && !!widget.report_id,
    staleTime: 30000,
  });

  const isLoading = widget.widget_type === 'chart' ? isLoadingChart : isLoadingReport;

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-3 w-full px-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Render widget content based on type
  switch (widget.widget_type) {
    case 'chart':
      if (!chartData || !chartData.results) {
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
            No chart data available
            {widget.chart_id && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                asChild
              >
                <a href={`/share/chart/${widget.chart_id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Full Chart
                </a>
              </Button>
            )}
          </div>
        );
      }
      try {
        const chartConfig: ChartConfig = chartData.chart_config
          ? (typeof chartData.chart_config === 'string' ? JSON.parse(chartData.chart_config) : chartData.chart_config)
          : {};
        const dataMapping: DataMapping = chartData.data_mapping
          ? (typeof chartData.data_mapping === 'string' ? JSON.parse(chartData.data_mapping) : chartData.data_mapping)
          : { xAxis: { field: '' }, yAxis: [] };

        return (
          <div className="relative h-full">
            <ChartRenderer
              data={chartData.results.rows || []}
              chartType={chartData.chart_type as ChartType}
              chartConfig={chartConfig}
              dataMapping={dataMapping}
              height={220}
            />
            {widget.chart_id && (
              <div className="absolute bottom-2 right-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/share/chart/${widget.chart_id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Expand
                  </a>
                </Button>
              </div>
            )}
          </div>
        );
      } catch (error) {
        console.error('Error rendering chart:', error);
        return (
          <div className="flex items-center justify-center h-full text-destructive text-sm">
            Error rendering chart
          </div>
        );
      }

    case 'report':
      if (!reportData || !reportData.results) {
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
            No report data available
            {widget.report_id && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                asChild
              >
                <a href={`/share/report/${widget.report_id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Full Report
                </a>
              </Button>
            )}
          </div>
        );
      }
      try {
        const rows = reportData.results.rows || [];
        const columns = reportData.results.columns || [];

        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <DataTable
                data={rows}
                columns={columns.map((col: any) => ({
                  id: col.id || `col_${col.field || col.name || Math.random().toString(36).substr(2, 9)}`,
                  accessorKey: col.field || col.accessorKey || col.name,
                  header: col.header || col.field || col.name,
                  cell: ({ getValue }) => {
                    const value = getValue();
                    if (value === null || value === undefined) {
                      return <span className="text-muted-foreground">-</span>;
                    }
                    return String(value);
                  },
                }))}
                pageSize={10}
              />
            </div>
            {widget.report_id && (
              <div className="flex justify-end p-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/share/report/${widget.report_id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Expand
                  </a>
                </Button>
              </div>
            )}
          </div>
        );
      } catch (error) {
        console.error('Error rendering report:', error);
        return (
          <div className="flex items-center justify-center h-full text-destructive text-sm">
            Error rendering report
          </div>
        );
      }

    case 'metric':
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Metric widgets are not supported in public view
        </div>
      );

    case 'text':
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Text widgets are not supported in public view
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Unknown widget type: {widget.widget_type}
        </div>
      );
  }
}
