import type { CatalogStatus } from '@features/module-process-catalog/components/cells/StatusBadgeCell'

export interface RequestItem {
  id: string
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
}
