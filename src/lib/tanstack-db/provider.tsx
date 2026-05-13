'use client'

import React, { useEffect } from 'react'
import {
  activeFiltersCollection,
  chartDraftCollection,
  dashboardStateCollection,
  queryHistoryCollection,
  reportsCollection,
  chartsCollection,
  dashboardsCollection,
} from './collections'

// Initialize all collections on mount to ensure they're ready
export function TanStackDBWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Preload collections to ensure sync starts
    const collections = [
      activeFiltersCollection,
      chartDraftCollection,
      dashboardStateCollection,
      queryHistoryCollection,
      reportsCollection,
      chartsCollection,
      dashboardsCollection,
    ]

    // Start sync for all collections
    collections.forEach((collection) => {
      collection.preload()
    })
  }, [])

  return <>{children}</>
}
