/**
 * taskActionService.ts — Mock API layer for My Tasks actions (approve / return / reject).
 *
 * Each function simulates a POST request and returns the shape the .NET backend
 * should implement. Replace the mock bodies with real apiClient calls when ready.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Endpoint contract for the BE team:                                         │
 * │                                                                            │
 * │  POST /api/tasks/:taskId/approve                                           │
 * │    Body:  (none)                                                           │
 * │    Resp:  { data: { taskId, status, message }, success, message }          │
 * │                                                                            │
 * │  POST /api/tasks/:taskId/return                                            │
 * │    Body:  { reason: string }                                               │
 * │    Resp:  { data: { taskId, status, message }, success, message }          │
 * │                                                                            │
 * │  POST /api/tasks/:taskId/reject                                            │
 * │    Body:  { reason: string }                                               │
 * │    Resp:  { data: { taskId, status, message }, success, message }          │
 * │                                                                            │
 * │  POST /api/tasks/bulk-approve                                              │
 * │    Body:  { taskIds: string[] }                                            │
 * │    Resp:  { data: { processed: number, failed: number }, success, message }│
 * │                                                                            │
 * │  POST /api/tasks/bulk-return                                               │
 * │    Body:  { taskIds: string[], reason: string }                            │
 * │    Resp:  { data: { processed: number, failed: number }, success, message }│
 * │                                                                            │
 * │  POST /api/tasks/bulk-reject                                               │
 * │    Body:  { taskIds: string[], reason?: string }                           │
 * │    Resp:  { data: { processed: number, failed: number }, success, message }│
 * │                                                                            │
 * │  POST /api/tasks/:taskId/endorse-approve                                   │
 * │    Body:  { comment?: string }                                             │
 * │    Resp:  { data: { taskId, endorsementStatus, message }, success, message}│
 * │                                                                            │
 * │  POST /api/tasks/:taskId/endorse-reject                                    │
 * │    Body:  { reason: string }                                               │
 * │    Resp:  { data: { taskId, endorsementStatus, message }, success, message}│
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Real implementation example:
 *   import { apiClient } from '@/shared/api/client'
 *   import type { ApiResponse } from '@/shared/api/types'
 *
 *   export async function approveTask(taskId: string) {
 *     return apiClient.post<ApiResponse<TaskActionResponse>>(
 *       `/api/tasks/${taskId}/approve`,
 *     )
 *   }
 */

const SIMULATED_LATENCY_MS = 600

// ── Response Types ────────────────────────────────────────────────────────────

export interface TaskActionResponse {
  taskId: string
  status: 'approved' | 'returned' | 'rejected'
  message: string
}

export interface EndorsementActionResponse {
  taskId: string
  endorsementStatus: 'endorsed' | 'endorsement-rejected'
  message: string
}

export interface BulkActionResponse {
  processed: number
  failed: number
}

// ── Request Types (for BE reference) ──────────────────────────────────────────

export interface ReturnTaskRequest {
  reason: string
}

export interface RejectTaskRequest {
  reason: string
}

export interface BulkApproveRequest {
  taskIds: string[]
}

export interface BulkReturnRequest {
  taskIds: string[]
  reason: string
}

export interface BulkRejectRequest {
  taskIds: string[]
  reason?: string
}

export interface EndorseApproveRequest {
  comment?: string
}

export interface EndorseRejectRequest {
  reason: string
}

// ── Single-row actions ────────────────────────────────────────────────────────

/** POST /api/tasks/:taskId/approve */
export function approveTask(taskId: string): Promise<TaskActionResponse> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          taskId,
          status: 'approved',
          message: 'Approved and forwarded for BPA Program Manager.',
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

/** POST /api/tasks/:taskId/return — body: { reason } */
export function returnTask(taskId: string, body: ReturnTaskRequest): Promise<TaskActionResponse> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          taskId,
          status: 'returned',
          message: `Request has been returned. Reason: ${body.reason}`,
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

/** POST /api/tasks/:taskId/reject — body: { reason } */
export function rejectTask(taskId: string, body: RejectTaskRequest): Promise<TaskActionResponse> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          taskId,
          status: 'rejected',
          message: `Request has been rejected. Reason: ${body.reason}`,
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

// ── Bulk actions ──────────────────────────────────────────────────────────────

/** POST /api/tasks/bulk-approve — body: { taskIds } */
export function bulkApproveTasks(body: BulkApproveRequest): Promise<BulkActionResponse> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          processed: body.taskIds.length,
          failed: 0,
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

/** POST /api/tasks/bulk-return — body: { taskIds, reason } */
export function bulkReturnTasks(body: BulkReturnRequest): Promise<BulkActionResponse> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          processed: body.taskIds.length,
          failed: 0,
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

/** POST /api/tasks/bulk-reject — body: { taskIds, reason? } */
export function bulkRejectTasks(body: BulkRejectRequest): Promise<BulkActionResponse> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          processed: body.taskIds.length,
          failed: 0,
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

/** POST /api/tasks/:taskId/request-endorsement — body: { endorserNames, reason } */
export function requestEndorsement(
  taskId: string,
  endorserNames: string[],
  reason: string,
): Promise<TaskActionResponse> {
  void endorserNames
  void reason
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          taskId,
          status: 'approved',
          message: 'Endorsement request has been sent.',
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

/** POST /api/tasks/:taskId/endorse-approve — body: { comment? } */
export function endorseApprove(
  taskId: string,
  body: EndorseApproveRequest = {},
): Promise<EndorsementActionResponse> {
  void body
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          taskId,
          endorsementStatus: 'endorsed',
          message: 'Endorsement approved successfully.',
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}

/** POST /api/tasks/:taskId/endorse-reject — body: { reason } */
export function endorseReject(
  taskId: string,
  body: EndorseRejectRequest,
): Promise<EndorsementActionResponse> {
  void body
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          taskId,
          endorsementStatus: 'endorsement-rejected',
          message: 'Endorsement rejected.',
        }),
      SIMULATED_LATENCY_MS,
    ),
  )
}
