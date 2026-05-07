'use client';

/**
 * Public Chart Viewer - No authentication required
 * Displays charts that are marked as public (is_public = true)
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock, Home, AlertCircle, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { ChartRenderer } from '@/components/charts/chart-renderer';

interface ChartData {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  chart_type: string;
  chart_config: any;
  data_mapping: any;
  results?: {
    rows: Record<string, unknown>[];
    rowCount: number;
  } | null;
  executionError?: string;
}

function PublicChartContent() {
  const params = useParams();
  const router = useRouter();
  const chartId = params.id as string;

  const [chart, setChart] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    code: string;
    message: string;
  } | null>(null);

  // Fetch public chart with data
  useEffect(() => {
    async function fetchChart() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/share/chart/${chartId}?execute=true`);

        if (res.status === 404) {
          setError({ code: 'NOT_FOUND', message: 'Chart not found' });
          return;
        }

        if (res.status === 403) {
          setError({ code: 'PRIVATE', message: 'This chart is private. Please log in to view it.' });
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to load chart');
        }

        const data = await res.json();
        setChart(data.data);
      } catch (err) {
        console.error('Error loading chart:', err);
        setError({ code: 'ERROR', message: 'Failed to load chart' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchChart();
  }, [chartId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {error.code === 'PRIVATE' ? (
                <>
                  <div className="p-3 bg-muted rounded-full">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Private Chart</h2>
                    <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
                  </div>
                  <Button asChild>
                    <Link href="/login">Log In to View</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-muted rounded-full">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {error.code === 'NOT_FOUND' ? 'Chart Not Found' : 'Error Loading Chart'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Home
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chart not loaded
  if (!chart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold">{chart.name}</h1>
              {chart.description && (
                <p className="text-sm text-muted-foreground">{chart.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Public</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <Lock className="h-3 w-3 mr-2" />
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Public Chart Banner */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are viewing a public chart. Some features may be limited.
            <Button asChild variant="link" className="ml-2 h-auto p-0" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            {' '}
            for full access.
          </AlertDescription>
        </Alert>

        {/* Chart */}
        {chart.executionError ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-2">Unable to load chart data</p>
              <p className="text-sm text-muted-foreground">{chart.executionError}</p>
            </CardContent>
          </Card>
        ) : chart.results ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{chart.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {chart.results.rowCount.toLocaleString()} data points
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartRenderer
                data={chart.results.rows}
                chartType={chart.chart_type as any}
                chartConfig={chart.chart_config}
                dataMapping={chart.data_mapping}
                height={500}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No data available for this chart.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Shared via Enterprise Reporting System</p>
        </div>
      </footer>
    </div>
  );
}

export default function PublicChartPage() {
  return <PublicChartContent />;
}
