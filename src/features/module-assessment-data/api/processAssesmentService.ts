import type { TaskItem } from '../types/my-tasks'
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
