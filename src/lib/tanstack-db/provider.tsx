import React from 'react'
import { TanStackDBProvider } from '@tanstack/db'
import {
  activeFiltersCollection,
  chartDraftCollection,
  dashboardStateCollection,
  queryHistoryCollection,
  reportsCollection,
  chartsCollection,
  dashboardsCollection,
} from './collections'

export function TanStackDBWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TanStackDBProvider
      collections={[
        activeFiltersCollection,
        chartDraftCollection,
        dashboardStateCollection,
        queryHistoryCollection,
        reportsCollection,
        chartsCollection,
        dashboardsCollection,
      ]}
      defaultSyncSettings={{
        // Optional: configure sync behavior globally
        // E.g. delay before sync, conflict resolution, etc.
      }}
    >
      {children}
    </TanStackDBProvider>
  )
}
