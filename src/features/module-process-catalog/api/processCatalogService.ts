/**
 * Process Catalog API service — mock implementation.
 *
 * Both functions simulate network latency with setTimeout.
 * To wire the real .NET backend, replace each function body with the
 * corresponding apiClient call, e.g.:
 *   return apiClient.get<ProcessItem[]>('/api/process-catalog/rows')
 *   return apiClient.get<GroupCompany[]>('/api/group-companies')
 */

import type { GroupCompany, ProcessItem } from '../types'
import type { TaskItem } from '../types/my-tasks'
import type { RequestItem } from '../types/submitted-requests'
import { CATALOG_DATA } from '../constants/catalog-data'
import { MY_TASKS } from '../constants/my-tasks'
import { SUBMITTED_REQUESTS } from '../constants/submitted-requests'

// ── Mock group companies lookup ───────────────────────────────────────────────
//
// In production this list is user-scoped: the API returns only the companies
// the authenticated user is authorised to see (typically 1–13 entries).

const MOCK_GROUP_COMPANIES: GroupCompany[] = [
  { id: 'gc-001', name: 'ADNOC HQ', sites: ['General', 'Bisher test', 'Site B', 'Site c'] },
  { id: 'gc-002', name: 'ADNOC AL DHAFRA AND AL YASAT', sites: ['General', 'Site A'] },
  { id: 'gc-003', name: 'ADNOC Onshore', sites: ['General'] },
  { id: 'gc-004', name: 'ADNOC Offshore', sites: ['General', 'Site A'] },
  { id: 'gc-005', name: 'ADNOC Gas Processing', sites: ['General'] },
  { id: 'gc-006', name: 'ADNOC Drilling', sites: ['General', 'Site A'] },
]

// ── Service functions ─────────────────────────────────────────────────────────

/**
 * Fetches all process catalog rows for the current user's scope.
 * Returns Level 1 / Level 2 / Level 3 hierarchy flattened into rows.
 */
export function getProcessCatalogRows(): Promise<ProcessItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(CATALOG_DATA), 600))
}

/**
 * Fetches the group company lookup visible to the current user.
 * This is a stable reference dataset — TanStack Query caches it for 24 h.
 */
export function getGroupCompanies(): Promise<GroupCompany[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_GROUP_COMPANIES), 300))
}

/**
 * Fetches the My Tasks list for the current user.
 * Returns tasks the user needs to action — ordered by submission date descending.
 */
export function getMyTasks(): Promise<TaskItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MY_TASKS), 500))
}

/**
 * Fetches all submitted change requests made by (or visible to) the current user.
 */
export function getSubmittedRequests(): Promise<RequestItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(SUBMITTED_REQUESTS), 500))
}
