import { createSyncAdapter } from '@tanstack/db'
import {
  activeFiltersCollection,
  chartDraftCollection,
  dashboardStateCollection,
  queryHistoryCollection,
  reportsCollection,
  chartsCollection,
  dashboardsCollection,
} from './collections'

// Placeholder sync adapters — each collection can sync via server functions
// In Phases 2-5, these will be connected to actual server functions

export const filtersSync = createSyncAdapter({
  async load() {
    // Initial load from localStorage or server; for Phase 1, use defaults
    return []
  },
  async create(item) {
    // Phase 2+: persist to server
    return item
  },
  async update(id, patch) {
    // Phase 2+: persist to server
    return { id, ...patch }
  },
  async delete(id) {
    // Phase 2+: persist to server
    return true
  },
})

export const chartDraftSync = createSyncAdapter({
  async load() {
    // Restore from localStorage on app load
    return []
  },
  async create(item) {
    return item
  },
  async update(id, patch) {
    return { id, ...patch }
  },
  async delete(id) {
    return true
  },
})

export const dashboardStateSync = createSyncAdapter({
  async load() {
    return []
  },
  async create(item) {
    return item
  },
  async update(id, patch) {
    return { id, ...patch }
  },
  async delete(id) {
    return true
  },
})

export const queryHistorySync = createSyncAdapter({
  async load() {
    return []
  },
  async create(item) {
    return item
  },
  async update(id, patch) {
    return { id, ...patch }
  },
  async delete(id) {
    return true
  },
})

export const reportsSync = createSyncAdapter({
  async load() {
    // Phase 4: will fetch from listReports() server function
    return []
  },
  async create(item) {
    return item
  },
  async update(id, patch) {
    return { id, ...patch }
  },
  async delete(id) {
    return true
  },
})

export const chartsSync = createSyncAdapter({
  async load() {
    // Phase 4: will fetch from listCharts() server function
    return []
  },
  async create(item) {
    return item
  },
  async update(id, patch) {
    return { id, ...patch }
  },
  async delete(id) {
    return true
  },
})

export const dashboardsSync = createSyncAdapter({
  async load() {
    // Phase 4: will fetch from listDashboards() server function
    return []
  },
  async create(item) {
    return item
  },
  async update(id, patch) {
    return { id, ...patch }
  },
  async delete(id) {
    return true
  },
})
