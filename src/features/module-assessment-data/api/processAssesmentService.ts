import type { CommentEntry, TaskItem } from '../types/my-tasks'
import type { BulkCellOperation, BulkCellActionResult } from '../types/process'
import type { RequestItem, WorkflowHistoryItem } from '../types/submitted-requests'
import { MY_TASKS } from '../constants/my-tasks'
import { SUBMITTED_REQUESTS } from '../constants/submitted-requests'
import { PROESS_DETAILS } from '../constants/process-details'
import { ASSESSMENT_DATA } from '../constants/assessment-data'
import type { DomainItem } from '../types/process'
import type { ProcessViewOptionId } from '@/shared/components/ProcessesMenu'

export function getMyTasks(): Promise<TaskItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MY_TASKS), 500))
}

// getSubmittedRequests
export function getSubmittedRequests(): Promise<RequestItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(SUBMITTED_REQUESTS), 500))
}

//getAssessmentProcess
export function getAssessmentProcess(processView: ProcessViewOptionId): Promise<DomainItem[]> {
  console.log('Call API getAssessmentProcess, with view=',processView)
  return new Promise((resolve) => setTimeout(() => resolve(ASSESSMENT_DATA), 500))
}

// ── Process row actions (mock) ───────────────────────────────────────────────

export function submitProcess(processId: string): Promise<{ success: boolean; message: string }> {
  void processId
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, message: 'Process submitted successfully.' }), 600),
  )
}

export function switchProcessToDraft(
  processId: string,
): Promise<{ success: boolean; status: string; message: string }> {
  void processId
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ success: true, status: 'Draft', message: 'Process switched to draft.' }),
      600,
    ),
  )
}

export function markProcessAsReviewed(
  processId: string,
): Promise<{ success: boolean; message: string }> {
  void processId
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ success: true, message: 'Process marked as reviewed successfully.' }),
      600,
    ),
  )
}

export function archiveProcess(
  processId: string,
): Promise<{ success: boolean; status: string; message: string }> {
  void processId
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ success: true, status: 'Archived', message: 'Process archived successfully.' }),
      600,
    ),
  )
}

// ── Bulk Actions (mock) ───────────────────────────────────────────────────────
export function bulkCellAction(operations: BulkCellOperation[]): Promise<BulkCellActionResult> {
  const processedIds = [...new Set(operations.map((op) => op.rowId))]
  return new Promise((resolve) => setTimeout(() => resolve({ processedIds }), 600))
}

export function copyAssessmentData(
  targetIds: string[],
  sourceId: string,
): Promise<{ updatedIds: string[] }> {
  void sourceId
  return new Promise((resolve) => setTimeout(() => resolve({ updatedIds: targetIds }), 800))
}

// ── Task Action APIs (mock) ───────────────────────────────────────────────────

export function approveTask(taskId: string, comment?: string): Promise<{ success: boolean }> {
  void taskId
  void comment
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 700))
}

export function returnTask(
  taskId: string,
  reason: string,
  comment?: string,
): Promise<{ success: boolean }> {
  void taskId
  void reason
  void comment
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 700))
}

export function rejectTask(
  taskId: string,
  reason?: string,
  comment?: string,
): Promise<{ success: boolean }> {
  void taskId
  void reason
  void comment
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 700))
}

export function requestEndorsement(
  taskId: string,
  endorserNames: string[],
  reason: string,
): Promise<{ success: boolean }> {
  void taskId
  void endorserNames
  void reason
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 700))
}

export function saveTaskFieldComments(taskId: string): Promise<{ success: boolean }> {
  void taskId
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500))
}

// ── Bulk Task Actions (mock) ──────────────────────────────────────────────────

export function bulkApproveTasks(taskIds: string[]): Promise<{ approvedIds: string[] }> {
  return new Promise((resolve) => setTimeout(() => resolve({ approvedIds: taskIds }), 700))
}

export function bulkReturnTasks(
  taskIds: string[],
  reason: string,
): Promise<{ returnedIds: string[] }> {
  void reason
  return new Promise((resolve) => setTimeout(() => resolve({ returnedIds: taskIds }), 700))
}

export function bulkRejectTasks(
  taskIds: string[],
  reason: string,
): Promise<{ rejectedIds: string[] }> {
  void reason
  return new Promise((resolve) => setTimeout(() => resolve({ rejectedIds: taskIds }), 700))
}

export function bulkRequestEndorsement(
  taskIds: string[],
  endorserNames: string[],
  reason: string,
): Promise<{ requestedIds: string[] }> {
  void endorserNames
  void reason
  return new Promise((resolve) => setTimeout(() => resolve({ requestedIds: taskIds }), 700))
}

// ── Task Details (mock) ───────────────────────────────────────────────────────

export function getTaskDetails(taskId: string): Promise<TaskItem | null> {
  const task = MY_TASKS.find((t) => t.id === taskId) ?? null
  return new Promise((resolve) => setTimeout(() => resolve(task), 400))
}

const MOCK_WORKFLOW_HISTORY: WorkflowHistoryItem[] = [
  {
    id: 'wh-1',
    action: 'Submitted',
    date: '10 Apr 2026 at 09:00 AM',
    userName: 'Mohammed Al Rashid',
    userRole: 'Business FP',
  },
  {
    id: 'wh-2',
    action: 'Returned',
    date: '11 Apr 2026 at 02:30 PM',
    userName: 'Sara Al Mansouri',
    userRole: 'Digital FP',
    reason: 'Please update the automation level field and resubmit.',
  },
  {
    id: 'wh-3',
    action: 'Resubmitted',
    date: '12 Apr 2026 at 10:15 AM',
    userName: 'Mohammed Al Rashid',
    userRole: 'Business FP',
  },
]

export function getTaskWorkflowHistory(taskId: string): Promise<WorkflowHistoryItem[]> {
  void taskId
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_WORKFLOW_HISTORY), 500))
}

export function getProcess(processId: string): Promise<any[]> {
  void processId
  return new Promise((resolve) => setTimeout(() => resolve(PROESS_DETAILS), 500))
}

// ── Field Comments (mock) ─────────────────────────────────────────────────────

const MOCK_COMMENTS: Record<string, CommentEntry[]> = {
  'task-1::Automation level 1': [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      author: 'Maryam Al Shamsi',
      role: 'Quality Manager',
      text: 'Please review the automation level — the old value seems incorrect.',
      timestamp: '01 Mar 2024 at 12:30',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      author: 'Sara Al Mansouri',
      role: 'Digital Focal Point',
      text: 'Confirmed with the team, the new value is correct.',
      timestamp: '02 Mar 2024 at 09:15',
    },
  ],
}

export interface GetFieldCommentsParams {
  taskId: string
  fieldName: string
}

export interface AddFieldCommentParams {
  taskId: string
  fieldName: string
  text: string
}

export function getFieldComments({
  taskId,
  fieldName,
}: GetFieldCommentsParams): Promise<CommentEntry[]> {
  const key = `${taskId}::${fieldName}`
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_COMMENTS[key] ?? []), 400))
}

export function addFieldComment({
  taskId,
  fieldName,
  text,
}: AddFieldCommentParams): Promise<CommentEntry> {
  const entry: CommentEntry = {
    id: crypto.randomUUID(),
    author: 'Jane Doe',
    role: 'Quality Manager',
    text,
    timestamp:
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' at ' +
      new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }),
  }
  const key = `${taskId}::${fieldName}`
  if (!MOCK_COMMENTS[key]) MOCK_COMMENTS[key] = []
  MOCK_COMMENTS[key].push(entry)
  return new Promise((resolve) => setTimeout(() => resolve(entry), 300))
}

// proces details - commets section
export function getProcessCommentsByFiled(fieldId: string): Promise<any[]> {
  void fieldId
  return new Promise((resolve) => setTimeout(() => resolve([]), 500))
}
export function getProcessComments(): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve([]), 500))
}
