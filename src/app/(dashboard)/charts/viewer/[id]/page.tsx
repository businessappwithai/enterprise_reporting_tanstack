'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { ChartRenderer } from '@/components/charts/chart-renderer';
import { FilterBar } from '@/components/reporting/filter-bar';
import { ShareDialog } from '@/components/share/ShareDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { RefreshCw, Settings, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { ChartDefinition, ChartConfig, DataMapping } from '@/types/database';

export default function ChartViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const chartId = params.id as string;
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: chart, isLoading: isLoadingChart } = useQuery<ChartDefinition>({
    queryKey: ['chart', chartId],
    queryFn: async () => {
      const res = await fetch(`/api/charts/${chartId}`);
      const data = await res.json();
      console.log('[ChartViewer] Raw API response:', data);
      console.log('[ChartViewer] chart_config type:', typeof data.data?.chart_config);
      console.log('[ChartViewer] data_mapping type:', typeof data.data?.data_mapping);
      return data.data;
    },
  });

  // Fetch chart filters
  const { data: chartFilters } = useQuery({
    queryKey: ['chart-filters', chartId],
    queryFn: async () => {
      const res = await fetch(`/api/charts/${chartId}/filters`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!chartId,
  });

  const { data: chartData, isLoading: isLoadingData, refetch, error: dataError } = useQuery({
    queryKey: ['chart-data', chartId, searchParams.toString()],
    queryFn: async () => {
      // Include filter parameters from URL
      const url = new URL(`/api/charts/${chartId}/data`, window.location.origin);

      // Add all filter parameters from URL
      for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('filter_')) {
          url.searchParams.set(key, value);
        }
      }

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Failed to fetch chart data: ${res.statusText}`);
      }
      const data = await res.json();
      console.log('[ChartViewer] API response:', data);
      return data.data;
    },
    enabled: !!chartId,
    refetchInterval: chart?.refresh_interval ? chart.refresh_interval * 1000 : undefined,
  });

  const handleExport = async (_format: 'png' | 'svg') => {
    toast.info('Export feature coming soon');
  };

  if (isLoadingChart) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chart not found</div>
      </div>
    );
  }

  let chartConfig: ChartConfig | null = null;
  let dataMapping: DataMapping | null = null;

  // Parse chart_config - might be double-escaped in the database
  try {
    let configStr = chart.chart_config;
    console.log('[ChartViewer] chart_config raw value:', configStr, 'Type:', typeof configStr);

    // If it's already an object (not a string), use it directly
    if (typeof configStr === 'object' && configStr !== null) {
      chartConfig = configStr;
    } else if (typeof configStr === 'string') {
      // Check if it's double-escaped (starts with a quote and has escaped quotes)
      if (configStr.startsWith('"') && configStr.includes('\\"')) {
        console.log('[ChartViewer] Detected double-escaped JSON, parsing twice');
        configStr = JSON.parse(configStr); // First parse
      }
      chartConfig = JSON.parse(configStr); // Second parse
    } else {
      console.warn('[ChartViewer] Unexpected chart_config type:', typeof configStr);
    }
    console.log('[ChartViewer] Parsed chartConfig:', chartConfig);
  } catch (e) {
    console.error('[ChartViewer] Failed to parse chart_config:', e, 'Raw value:', chart.chart_config);
    chartConfig = null;
  }

  // Parse data_mapping - same logic
  try {
    let mappingStr = chart.data_mapping;
    console.log('[ChartViewer] data_mapping raw value:', mappingStr, 'Type:', typeof mappingStr);

    if (typeof mappingStr === 'object' && mappingStr !== null) {
      dataMapping = mappingStr;
    } else if (typeof mappingStr === 'string') {
      if (mappingStr.startsWith('"') && mappingStr.includes('\\"')) {
        console.log('[ChartViewer] Detected double-escaped JSON, parsing twice');
        mappingStr = JSON.parse(mappingStr);
      }
      dataMapping = JSON.parse(mappingStr);
    } else {
      console.warn('[ChartViewer] Unexpected data_mapping type:', typeof mappingStr);
    }
    console.log('[ChartViewer] Parsed dataMapping:', dataMapping);
  } catch (e) {
    console.error('[ChartViewer] Failed to parse data_mapping:', e, 'Raw value:', chart.data_mapping);
    dataMapping = null;
  }

  console.log('[ChartViewer] Final parsed values:', {
    chartConfig,
    dataMapping,
    types: { chartConfig: typeof chartConfig, dataMapping: typeof dataMapping },
    xAxisField: dataMapping?.xAxis?.field,
    yAxisCount: dataMapping?.yAxis?.length,
    stackedValue: chartConfig?.stacked,
    stackedType: typeof chartConfig?.stacked
  });

  const isStacked = chartConfig?.stacked === true;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Charts', href: '/charts' },
          { label: chart.name },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{chart.name}</h1>
          {chart.description && (
            <p className="text-muted-foreground">{chart.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('png')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/charts/editor/${chartId}`}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </a>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {chartFilters && chartFilters.length > 0 && (
        <FilterBar
          chartId={chartId}
          filters={chartFilters}
          type="chart"
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>{chartConfig.title?.text || chart.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-muted-foreground">Loading data...</div>
            </div>
          ) : dataError ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-destructive">Error loading chart data: {(dataError as Error).message}</div>
            </div>
          ) : !chartData || chartData.rows?.length === 0 ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-muted-foreground">No data available for this chart</div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3 pb-2 border-b">
                <span>📊 {chartData.rows?.length || 0} rows</span>
                <span>X-Axis: <strong>{dataMapping.xAxis?.label || dataMapping.xAxis?.field || 'none'}</strong></span>
                <span>Y-Axis: <strong>{dataMapping.yAxis?.length || 0}</strong> series</span>
                <span>Stacked: <strong className={isStacked ? 'text-primary' : 'text-muted-foreground'}>{isStacked ? '✓ Yes' : '✗ No'}</strong></span>
                <span>Type: <strong>{chart.chart_type}</strong></span>
              </div>
              <ChartRenderer
                data={chartData.rows || []}
                chartType={chart.chart_type}
                chartConfig={chartConfig}
                dataMapping={dataMapping}
                height={400}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        resourceId={chartId}
        resourceType="chart"
        isPublic={chart?.is_public || false}
        onTogglePublic={(newState) => {
          if (chart) {
            chart.is_public = newState;
            queryClient.invalidateQueries({ queryKey: ['chart', chartId] });
          }
        }}
      />
    </div>
  );
}
