export interface CommentEntry {
  id: string
  author: string
  role: string
  text: string
  timestamp: string
}

export interface ChangeRecord {
  name?: string
  comment: string
  oldValue: string
  newValue: string
  id?: string
  label?: string
  comments?: CommentEntry[]
}

export interface TaskItem {
  id: string
  processId?: string
  processName: string
  processCode?: string
  groupCompany: string
  requestId: string
  domain: string
  stageCurrent: number
  stageTotal: number
  stageText: string
  requester: string
  status: string
  returnComment?: string
  rejectComment?: string
  actionRequired?: string
  changes?: ChangeRecord[]
  submittedOn?: string
  level?: string
  level1?: string
  level2?: string
  businessFocalPoint?: string
  digitalFocalPoint?: string
  subRows?: TaskItem[]
}

export function makeChangeSubRow(parentId: string, change: ChangeRecord, index: number): TaskItem {
  return {
    id: `${parentId}-c${index}`,
    processName: '',
    groupCompany: '',
    requestId: '',
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
