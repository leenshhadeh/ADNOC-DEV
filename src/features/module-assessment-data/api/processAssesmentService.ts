import type { CommentEntry, TaskItem } from '../types/my-tasks'
import type { WorkflowHistoryItem } from '../types/submitted-requests'
import { MY_TASKS } from '../constants/my-tasks'
import { SUBMITTED_REQUESTS } from '../constants/submitted-requests'
import { PROESS_DETAILS } from '../constants/process-details'

export function getMyTasks(): Promise<TaskItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MY_TASKS), 500))
}

// getSubmittedRequests
export function getSubmittedRequests(): Promise<any[]> {
  return new Promise((resolve) => setTimeout(() => resolve(SUBMITTED_REQUESTS), 500))
}

// ── Bulk Actions (mock) ───────────────────────────────────────────────────────

export function bulkEditProcesses(
  ids: string[],
  field: string,
  value: string,
): Promise<{ updatedIds: string[] }> {
  void field
  void value
  return new Promise((resolve) => setTimeout(() => resolve({ updatedIds: ids }), 600))
}

export function bulkCommentProcesses(
  ids: string[],
  comment: string,
): Promise<{ updatedIds: string[] }> {
  void comment
  return new Promise((resolve) => setTimeout(() => resolve({ updatedIds: ids }), 600))
}

export function copyAssessmentData(
  targetIds: string[],
  sourceId: string,
): Promise<{ updatedIds: string[] }> {
  void sourceId
  return new Promise((resolve) => setTimeout(() => resolve({ updatedIds: targetIds }), 800))
}

export function bulkSubmitProcesses(ids: string[]): Promise<{ submittedIds: string[] }> {
  return new Promise((resolve) => setTimeout(() => resolve({ submittedIds: ids }), 600))
}

export function bulkMarkAsReviewed(
  ids: string[],
  comment: string,
): Promise<{ reviewedIds: string[] }> {
  void comment
  return new Promise((resolve) => setTimeout(() => resolve({ reviewedIds: ids }), 600))
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
  'c1-0': [
    {
      id: 'cmt-1',
      author: 'Maryam Al Shamsi',
      role: 'Quality Manager',
      text: 'Please review the automation level — the old value seems incorrect.',
      timestamp: '01 Mar 2024 at 12:30',
    },
    {
      id: 'cmt-2',
      author: 'Sara Al Mansouri',
      role: 'Digital Focal Point',
      text: 'Confirmed with the team, the new value is correct.',
      timestamp: '02 Mar 2024 at 09:15',
    },
  ],
}

export interface GetFieldCommentsParams {
  taskId: string
  changeId: string
}

export interface AddFieldCommentParams {
  taskId: string
  changeId: string
  text: string
}

export function getFieldComments({
  taskId,
  changeId,
}: GetFieldCommentsParams): Promise<CommentEntry[]> {
  void taskId
  const key = changeId
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_COMMENTS[key] ?? []), 400))
}

export function addFieldComment({
  taskId,
  changeId,
  text,
}: AddFieldCommentParams): Promise<CommentEntry> {
  void taskId
  const entry: CommentEntry = {
    id: `cmt-${Date.now()}`,
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
  const key = changeId
  if (!MOCK_COMMENTS[key]) MOCK_COMMENTS[key] = []
  MOCK_COMMENTS[key].push(entry)
  return new Promise((resolve) => setTimeout(() => resolve(entry), 300))
}
