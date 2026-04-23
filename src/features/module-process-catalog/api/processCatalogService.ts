/**
 * Process Catalog API service — mock implementation.
 *
 * Both functions simulate network latency with setTimeout.
 * To wire the real .NET backend, replace each function body with the
 * corresponding apiClient call, e.g.:
 *   return apiClient.get<ProcessItem[]>('/api/process-catalog/rows')
 *   return apiClient.get<GroupCompany[]>('/api/group-companies')
 */

import type { Domain, GroupCompany, ProcessItem, YesNo } from '../types'
import type { ChangeLogEntry } from '../types'
import type { TaskItem } from '../types/my-tasks'
import type { RequestItem } from '../types/submitted-requests'
import { CATALOG_DATA } from '../constants/catalog-data'
import { DOMAINS_DATA } from '../constants/domains-data'
import { MY_TASKS } from '../constants/my-tasks'
import { SUBMITTED_REQUESTS } from '../constants/submitted-requests'

// ── Request / Response types ──────────────────────────────────────────────────

/** POST /api/process-catalog — create a new process row */
export type CreateProcessPayload = Omit<ProcessItem, 'id' | 'level3Status'>

/** PATCH /api/process-catalog/entities — bulk update applicability toggles */
export interface UpdateEntitiesUpdate {
  processId: string
  company: string
  site: string
  value: YesNo
}

export interface UpdateEntitiesPayload {
  updates: UpdateEntitiesUpdate[]
}

// ── Mock group companies lookup ───────────────────────────────────────────────
//
// In production this list is user-scoped: the API returns only the companies
// the authenticated user is authorised to see (typically 1–13 entries).

const MOCK_GROUP_COMPANIES: GroupCompany[] = [
  {
    id: 'gc-001',
    name: 'ADNOC HQ',
    sites: [
      { id: 's-001', name: 'General' },
      { id: 's-002', name: 'Bisher test' },
      { id: 's-003', name: 'Site B' },
      { id: 's-004', name: 'Site c' },
    ],
  },
  {
    id: 'gc-002',
    name: 'ADNOC AL DHAFRA AND AL YASAT',
    sites: [
      { id: 's-005', name: 'General' },
      { id: 's-006', name: 'Site A' },
    ],
  },
  { id: 'gc-003', name: 'ADNOC Onshore', sites: [{ id: 's-007', name: 'General' }] },
  {
    id: 'gc-004',
    name: 'ADNOC Offshore',
    sites: [
      { id: 's-008', name: 'General' },
      { id: 's-009', name: 'Site A' },
    ],
  },
  { id: 'gc-005', name: 'ADNOC Gas Processing', sites: [{ id: 's-010', name: 'General' }] },
  {
    id: 'gc-006',
    name: 'ADNOC Drilling',
    sites: [
      { id: 's-011', name: 'General' },
      { id: 's-012', name: 'Site A' },
    ],
  },
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

/**
 * Fetches the list of business domains.
 * GET /api/domains
 */
export function getDomains(): Promise<Domain[]> {
  return new Promise((resolve) => setTimeout(() => resolve(DOMAINS_DATA), 300))
}

/**
 * Fetches the change log for a specific Level 3 process.
 * GET /api/process-catalog/recorded-changes/:processId
 */
export function getRecordedChanges(processId: string): Promise<ChangeLogEntry[]> {
  const process = CATALOG_DATA.find((r) => r.id === processId)
  if (!process) return Promise.resolve([])

  const entries: ChangeLogEntry[] = [
    {
      id: 'c1',
      section: 'parent',
      processName: process.level1Name,
      levelLabel: 'L 1',
      levelNum: 1,
      changeType: 'Update',
      changedItem: 'Process Name',
      groupCompany: '-',
      oldValue: process.level1Name,
      newValue: process.domain,
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 3:33PM',
    },
    {
      id: 'c2',
      section: 'parent',
      processName: process.level2Name,
      levelLabel: 'L 2',
      levelNum: 2,
      changeType: 'Update',
      changedItem: 'Process Name',
      groupCompany: '-',
      oldValue: process.level2Name,
      newValue: 'Studies',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 4:21PM',
    },
    {
      id: 'c3',
      section: 'this',
      processName: process.level3Name,
      levelLabel: 'L 3',
      levelNum: 3,
      changeType: 'Update',
      changedItem: 'Process Name',
      groupCompany: '-',
      oldValue: `${process.level3Name} 2`,
      newValue: process.level3Name,
      modifiedBy: 'Mohammed Al Hajeri',
      modifiedOn: '05 Apr 2024, 1:03PM',
    },
    {
      id: 'c4',
      section: 'this',
      processName: process.level3Name,
      levelLabel: 'L 3',
      levelNum: 3,
      changeType: 'Update',
      changedItem: 'Applicability',
      groupCompany: '-',
      oldValue: 'ADNOC Sour Gas',
      newValue: 'ADNOC Sour Gas, ADNOC Onshore - Sit...',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '06 Apr 2024, 2:24PM',
    },
    {
      id: 'c5',
      section: 'this',
      processName: process.level3Name,
      levelLabel: 'L 3',
      levelNum: 3,
      changeType: 'Update',
      changedItem: 'Shared service',
      groupCompany: '-',
      oldValue: 'Yes',
      newValue: 'No',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 6:09PM',
    },
    {
      id: 'c6',
      section: 'child',
      processName: 'Define basin framework',
      levelLabel: 'L 4',
      levelNum: 4,
      changeType: 'Create',
      changedItem: 'Process Name',
      groupCompany: 'Sour Gas',
      oldValue: '-',
      newValue: 'Define basin framework',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '03 Apr 2024, 1:11PM',
    },
    {
      id: 'c7',
      section: 'child',
      processName: 'Define basin framework',
      levelLabel: 'L 4',
      levelNum: 4,
      changeType: 'Update',
      changedItem: 'Description',
      groupCompany: 'Sour Gas',
      oldValue: '-',
      newValue: 'Defines the structural and stratigraphic fra...',
      modifiedBy: 'Dania Al Farsi',
      modifiedOn: '04 Apr 2024, 2:13PM',
    },
  ]
  return new Promise((resolve) => setTimeout(() => resolve(entries), 500))
}

/**
 * Creates a new process row (Level 1, 2, or 3).
 * POST /api/process-catalog
 */
export function createProcess(payload: CreateProcessPayload): Promise<ProcessItem> {
  const created: ProcessItem = {
    ...payload,
    id: `proc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    level3Status: 'Published',
  }
  return new Promise((resolve) => setTimeout(() => resolve(created), 600))
}

/**
 * Renames a process at any level.
 * PATCH /api/process-catalog/:id/rename
 */
export function renameProcess(id: string, name: string): Promise<null> {
  void id
  void name
  return new Promise((resolve) => setTimeout(() => resolve(null), 400))
}

/**
 * Bulk-updates entity applicability toggles (Yes/No per company-site).
 * PATCH /api/process-catalog/entities
 */
export function updateEntities(payload: UpdateEntitiesPayload): Promise<null> {
  void payload
  return new Promise((resolve) => setTimeout(() => resolve(null), 400))
}

/**
 * Triggers validation / submission for approval on a Level 3 process.
 * POST /api/process-catalog/:id/validate
 */
export function validateProcess(id: string): Promise<null> {
  void id
  return new Promise((resolve) => setTimeout(() => resolve(null), 400))
}
