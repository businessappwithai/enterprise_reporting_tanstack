'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { DuckDBProvider } from '@/components/duckdb/DuckDBProvider';
import { isFeatureEnabled } from '@/lib/feature-flags';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const wasmEnabled = isFeatureEnabled('wasmEnabled');

  const inner = (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <QueryClientProvider client={queryClient}>
        {wasmEnabled ? (
          <DuckDBProvider>{inner}</DuckDBProvider>
        ) : (
          inner
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}
