import type { CatalogStatus } from '@features/module-process-catalog/components/cells/StatusBadgeCell'

export interface ChangeRecord {
  name: string
  changeType: string
  oldValue: string
  newValue: string
}

export interface TaskItem {
  id: string
  processName: string
  requestId: string
  level: string
  domain: string
  stageCurrent: number
  stageTotal: number
  stageText: string
  requester: string
  status: CatalogStatus
  returnComment?: string
  returnedBy?: string
  actionRequired?: string
  changes?: ChangeRecord[]
  submittedOn?: string
  subRows?: TaskItem[]
}

export function makeChangeSubRow(parentId: string, change: ChangeRecord, index: number): TaskItem {
  return {
    id: `${parentId}-c${index}`,
    processName: '',
    requestId: '',
    level: '',
    domain: '',
    stageCurrent: 0,
    stageTotal: 0,
    stageText: '',
    requester: '',
    status: 'Published',
    changes: [change],
  }
}

export function withSubRows(item: Omit<TaskItem, 'subRows'>): TaskItem {
  return {
    ...item,
    subRows: (item.changes ?? []).map((c, i) => makeChangeSubRow(item.id, c, i)),
  }
}
