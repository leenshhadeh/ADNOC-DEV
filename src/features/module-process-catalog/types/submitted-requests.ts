import type { CatalogStatus } from '@features/module-process-catalog/components/cells/StatusBadgeCell'

export interface WorkflowHistoryItem {
  id: string
  /** e.g. "Submitted", "Reviewed", "Returned" */
  action: string
  /** e.g. "22 Apr 2025 at 10:14 AM" */
  date: string
  userName: string
  userRole: string
  /** Populated for "Returned" events */
  reason?: string
}

export interface RequestItem {
  id: string
  /** ID of the corresponding ProcessItem in the catalog — used for deep-link navigation. */
  processId?: string
  processName: string
  requestId: string
  level: string
  requester: string
  approver: string
  status: CatalogStatus
  stageCurrent: number
  stageTotal: number
  stageText: string
  submittedOn: string
  publishedOn: string
  changes: Array<{
    id: string
    label: string
    oldValue: string
    newValue: string
  }>
  // ── Detail-view fields (optional — populated per request) ────────────────
  /** Badge shown below the title, e.g. "Dashboard" */
  processCategory?: string
  domain?: string
  processLevel?: string
  level1?: string
  level2?: string
  /** Falls back to approver when absent */
  businessFocalPoint?: string
  workflowHistory?: WorkflowHistoryItem[]
}
