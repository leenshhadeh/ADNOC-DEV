import type { TaskItem } from '../types/my-tasks'
import type { WorkflowHistoryItem } from '../types/submitted-requests'
import { MY_TASKS } from '../constants/my-tasks'
import { SUBMITTED_REQUESTS } from '../constants/submitted-requests'

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
