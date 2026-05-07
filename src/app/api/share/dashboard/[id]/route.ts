import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/config';
import type { DashboardLayout } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    // Get dashboard with public status
    const dashboard = await db<DashboardLayout>('dashboard_layouts')
      .where('id', id)
      .first();

    if (!dashboard) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Dashboard not found' } },
        { status: 404 }
      );
    }

    // Check if dashboard is public
    if (!dashboard.is_public) {
      return NextResponse.json(
        { success: false, error: { code: 'PRIVATE', message: 'This dashboard is private' } },
        { status: 403 }
      );
    }

    // Get widgets for the dashboard
    const widgets = await db('dashboard_widgets')
      .where('dashboard_id', id)
      .orderBy('created_at', 'asc');

    // Parse widget data from JSON columns
    const parsedWidgets = widgets.map(w => {
      let position = { x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 };
      let widgetConfig = {};

      try {
        if (w.position_config) {
          position = JSON.parse(w.position_config);
        }
      } catch {}

      try {
        if (w.widget_config) {
          widgetConfig = JSON.parse(w.widget_config);
        }
      } catch {}

      return {
        id: w.id,
        widget_type: w.widget_type,
        report_id: w.report_id,
        chart_id: w.chart_id,
        dashboard_id: w.dashboard_id,
        position_config: w.position_config,
        widget_config: w.widget_config,
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
        minW: position.minW,
        minH: position.minH,
        title: widgetConfig.title,
      };
    });

    // Return sanitized dashboard data (without sensitive info)
    return NextResponse.json({
      success: true,
      data: {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        is_public: dashboard.is_public,
        layout_config: dashboard.layout_config,
        theme_config: dashboard.theme_config,
        refresh_config: dashboard.refresh_config,
        widgets: parsedWidgets,
      },
    });
  } catch (error) {
    console.error('Error fetching public dashboard:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch dashboard' } },
      { status: 500 }
    );
  }
}
