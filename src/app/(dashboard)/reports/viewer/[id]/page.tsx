'use client';

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/reporting/data-table';
import { FilterBar } from '@/components/reporting/filter-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ShareDialog } from '@/components/share/ShareDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RefreshCw, Settings, Palette } from 'lucide-react';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReportDefinition, ColumnDefinition, ReportColorTheme } from '@/types/database';

export default function ReportViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const reportId = params.id as string;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [editableColorTheme, setEditableColorTheme] = useState<ReportColorTheme>({
    headerBackgroundColor: '#1e293b',
    headerTextColor: '#ffffff',
    headerFontWeight: '600',
    rowBackgroundColor: '#ffffff',
    rowTextColor: '#334155',
    alternatingRowBackgroundColor: '#f8fafc',
    alternatingRowTextColor: '#334155',
    borderColor: '#e2e8f0',
  });

  const { data: report, isLoading: isLoadingReport } = useQuery<ReportDefinition>({
    queryKey: ['report', reportId],
    queryFn: async () => {
      const res = await fetch(`/api/reports/${reportId}`);
      const data = await res.json();
      return data.data;
    },
  });

  // Fetch report filters
  const { data: reportFilters } = useQuery({
    queryKey: ['report-filters', reportId],
    queryFn: async () => {
      const res = await fetch(`/api/reports/${reportId}/filters`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!reportId,
  });

  const { data: reportData, isLoading: isLoadingData, refetch } = useQuery({
    queryKey: ['report-data', reportId, page, pageSize, searchParams.toString(), search],
    queryFn: async () => {
      console.log('[ReportViewer] Fetching report data with search:', search);
      // Include filter parameters from URL
      const url = new URL(`/api/reports/${reportId}/data`, window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('pageSize', String(pageSize));

      // Add search parameter
      if (search) {
        console.log('[ReportViewer] Adding search parameter to URL:', search);
        url.searchParams.set('search', search);
      }

      // Add all filter parameters from URL
      for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('filter_')) {
          url.searchParams.set(key, value);
        }
      }

      console.log('[ReportViewer] Fetching URL:', url.toString());
      const res = await fetch(url.toString());

      if (!res.ok) {
        console.error('[ReportViewer] Error fetching data:', res.status, res.statusText);
        // Return empty result on error
        return { items: [], meta: { total: 0, page, pageSize, totalPages: 0, hasMoreData: false } };
      }

      const data = await res.json();
      console.log('[ReportViewer] Response:', data);

      // Return the data or a default empty result
      return data.data || { items: [], meta: { total: 0, page, pageSize, totalPages: 0, hasMoreData: false } };
    },
    enabled: !!reportId,
  });

  // Parse color theme from report and load into editable state
  const colorTheme = useMemo(() => {
    if (!report?.color_theme) {
      setEditableColorTheme({
        headerBackgroundColor: '#1e293b',
        headerTextColor: '#ffffff',
        headerFontWeight: '600',
        rowBackgroundColor: '#ffffff',
        rowTextColor: '#334155',
        alternatingRowBackgroundColor: '#f8fafc',
        alternatingRowTextColor: '#334155',
        borderColor: '#e2e8f0',
      });
      return null;
    }
    try {
      const parsed = JSON.parse(report.color_theme) as ReportColorTheme;
      console.log('[ReportViewer] Loaded color theme:', parsed);
      setEditableColorTheme(parsed);
      return parsed;
    } catch {
      return null;
    }
  }, [report?.color_theme]);

  // Save color theme to database
  const handleSaveColorTheme = async () => {
    try {
      console.log('[ReportViewer] Saving color theme:', editableColorTheme);
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colorTheme: editableColorTheme,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save color theme');
      }

      // Invalidate queries to refresh
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });

      toast.success('Color theme saved successfully');
      setColorDialogOpen(false);
    } catch (error) {
      console.error('[ReportViewer] Error saving color theme:', error);
      toast.error('Failed to save color theme');
    }
  };

  // Apply color changes in real-time (temporary, not saved)
  const handleColorChange = (key: keyof ReportColorTheme, value: string) => {
    console.log('[ReportViewer] Color change:', key, value);
    setEditableColorTheme((prev) => ({ ...prev, [key]: value }));
  };

  const columns: ColumnDef<Record<string, unknown>>[] = useMemo(() => {
    if (!report?.column_config) return [];

    try {
      const columnConfig: ColumnDefinition[] = JSON.parse(report.column_config);
      return columnConfig
        .filter((col) => col.visible)
        .map((col) => ({
          accessorKey: col.field,
          header: col.header,
          cell: ({ getValue }) => {
            const value = getValue();
            if (value === null || value === undefined) {
              return <span className="text-muted-foreground">-</span>;
            }
            return String(value);
          },
        }));
    } catch {
      return [];
    }
  }, [report?.column_config]);

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      const res = await fetch(`/api/reports/${reportId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });

      if (!res.ok) {
        throw new Error('Export failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report?.name || 'report'}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (isLoadingReport) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading report...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Report not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Reports', href: '/reports' },
          { label: report.name },
        ]}
      />

      <div className="flex items-center justify-between py-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{report.name}</h1>
          {report.description && (
            <p className="text-sm text-muted-foreground">{report.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Palette className="h-4 w-4 mr-2" />
                Colors
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Color Theme</DialogTitle>
                <DialogDescription>
                  Customize the colors for this report. Changes apply to the viewer and exports (PDF, Excel).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="viewer-header-bg">Header Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="viewer-header-bg"
                        type="color"
                        value={editableColorTheme.headerBackgroundColor || '#1e293b'}
                        onChange={(e) => handleColorChange('headerBackgroundColor', e.target.value)}
                        className="h-10 w-16 rounded cursor-pointer border"
                      />
                      <Input
                        type="text"
                        value={editableColorTheme.headerBackgroundColor || '#1e293b'}
                        onChange={(e) => handleColorChange('headerBackgroundColor', e.target.value)}
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="viewer-header-text">Header Text</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="viewer-header-text"
                        type="color"
                        value={editableColorTheme.headerTextColor || '#ffffff'}
                        onChange={(e) => handleColorChange('headerTextColor', e.target.value)}
                        className="h-10 w-16 rounded cursor-pointer border"
                      />
                      <Input
                        type="text"
                        value={editableColorTheme.headerTextColor || '#ffffff'}
                        onChange={(e) => handleColorChange('headerTextColor', e.target.value)}
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="viewer-row-bg">Row Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="viewer-row-bg"
                        type="color"
                        value={editableColorTheme.rowBackgroundColor || '#ffffff'}
                        onChange={(e) => handleColorChange('rowBackgroundColor', e.target.value)}
                        className="h-10 w-16 rounded cursor-pointer border"
                      />
                      <Input
                        type="text"
                        value={editableColorTheme.rowBackgroundColor || '#ffffff'}
                        onChange={(e) => handleColorChange('rowBackgroundColor', e.target.value)}
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="viewer-row-text">Row Text</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="viewer-row-text"
                        type="color"
                        value={editableColorTheme.rowTextColor || '#334155'}
                        onChange={(e) => handleColorChange('rowTextColor', e.target.value)}
                        className="h-10 w-16 rounded cursor-pointer border"
                      />
                      <Input
                        type="text"
                        value={editableColorTheme.rowTextColor || '#334155'}
                        onChange={(e) => handleColorChange('rowTextColor', e.target.value)}
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="viewer-alt-row-bg">Alternating Row Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="viewer-alt-row-bg"
                        type="color"
                        value={editableColorTheme.alternatingRowBackgroundColor || '#f8fafc'}
                        onChange={(e) => handleColorChange('alternatingRowBackgroundColor', e.target.value)}
                        className="h-10 w-16 rounded cursor-pointer border"
                      />
                      <Input
                        type="text"
                        value={editableColorTheme.alternatingRowBackgroundColor || '#f8fafc'}
                        onChange={(e) => handleColorChange('alternatingRowBackgroundColor', e.target.value)}
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="viewer-alt-row-text">Alternating Row Text</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="viewer-alt-row-text"
                        type="color"
                        value={editableColorTheme.alternatingRowTextColor || '#334155'}
                        onChange={(e) => handleColorChange('alternatingRowTextColor', e.target.value)}
                        className="h-10 w-16 rounded cursor-pointer border"
                      />
                      <Input
                        type="text"
                        value={editableColorTheme.alternatingRowTextColor || '#334155'}
                        onChange={(e) => handleColorChange('alternatingRowTextColor', e.target.value)}
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="viewer-border">Border Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="viewer-border"
                        type="color"
                        value={editableColorTheme.borderColor || '#e2e8f0'}
                        onChange={(e) => handleColorChange('borderColor', e.target.value)}
                        className="h-10 w-16 rounded cursor-pointer border"
                      />
                      <Input
                        type="text"
                        value={editableColorTheme.borderColor || '#e2e8f0'}
                        onChange={(e) => handleColorChange('borderColor', e.target.value)}
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="viewer-header-weight">Header Font Weight</Label>
                    <select
                      id="viewer-header-weight"
                      value={editableColorTheme.headerFontWeight || '600'}
                      onChange={(e) => handleColorChange('headerFontWeight', e.target.value)}
                      className="h-10 w-full rounded border border-input bg-background px-3 py-2"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="600">Semi-Bold (600)</option>
                      <option value="700">Extra-Bold (700)</option>
                    </select>
                  </div>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Preview</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{
                        backgroundColor: editableColorTheme.headerBackgroundColor,
                        color: editableColorTheme.headerTextColor,
                      }}>
                        <th className="p-2 text-left font-semibold" style={{ fontWeight: editableColorTheme.headerFontWeight }}>
                          Column 1
                        </th>
                        <th className="p-2 text-left font-semibold" style={{ fontWeight: editableColorTheme.headerFontWeight }}>
                          Column 2
                        </th>
                        <th className="p-2 text-left font-semibold" style={{ fontWeight: editableColorTheme.headerFontWeight }}>
                          Column 3
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{
                        backgroundColor: editableColorTheme.rowBackgroundColor,
                        color: editableColorTheme.rowTextColor,
                        borderColor: editableColorTheme.borderColor,
                      }}>
                        <td className="p-2 border" style={{ borderColor: editableColorTheme.borderColor }}>Data 1</td>
                        <td className="p-2 border" style={{ borderColor: editableColorTheme.borderColor }}>Data 2</td>
                        <td className="p-2 border" style={{ borderColor: editableColorTheme.borderColor }}>Data 3</td>
                      </tr>
                      <tr style={{
                        backgroundColor: editableColorTheme.alternatingRowBackgroundColor,
                        color: editableColorTheme.alternatingRowTextColor,
                        borderColor: editableColorTheme.borderColor,
                      }}>
                        <td className="p-2 border" style={{ borderColor: editableColorTheme.borderColor }}>Data 4</td>
                        <td className="p-2 border" style={{ borderColor: editableColorTheme.borderColor }}>Data 5</td>
                        <td className="p-2 border" style={{ borderColor: editableColorTheme.borderColor }}>Data 6</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setColorDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveColorTheme}>
                  Save Colors
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
            Share
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/reports/editor/${reportId}`}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </a>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {reportFilters && reportFilters.length > 0 && (
        <FilterBar
          reportId={reportId}
          filters={reportFilters}
          type="report"
        />
      )}

      <div className="rounded-lg border bg-card">
        <DataTable
          data={reportData?.items || []}
          columns={columns}
          isLoading={isLoadingData}
          totalRows={reportData?.meta?.total}
          pageSize={pageSize}
          pageIndex={page}
          onExport={handleExport}
          serverSide
          colorTheme={editableColorTheme}
          onSearchChange={setSearch}
          onPaginationChange={(pagination) => {
            setPage(pagination.pageIndex);
            setPageSize(pagination.pageSize);
          }}
        />
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        resourceId={reportId}
        resourceType="report"
        isPublic={report?.is_public || false}
        onTogglePublic={(newState) => {
          if (report) {
            report.is_public = newState;
            queryClient.invalidateQueries({ queryKey: ['report', reportId] });
          }
        }}
      />
    </div>
  );
}
