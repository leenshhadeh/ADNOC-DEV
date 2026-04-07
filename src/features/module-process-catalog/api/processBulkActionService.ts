/**
 * processBulkActionService.ts — Mock API layer for Processes tab bulk actions
 * (bulk edit applicability, bulk submit).
 *
 * Each function simulates a request and returns the shape the .NET backend
 * should implement. Replace the mock bodies with real apiClient calls when ready.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Endpoint contract for the BE team:                                         │
 * │                                                                            │
 * │  PUT  /api/processes/bulk-edit                                             │
 * │    Body:  { processIds: string[], companySite: string }                    │
 * │    Resp:  { data: { processed, failed }, success, message }                │
 * │                                                                            │
 * │  POST /api/processes/bulk-submit                                           │
 * │    Body:  { processIds: string[] }                                         │
 * │    Resp:  { data: { processed, failed }, success, message }                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Real implementation example:
 *   import { apiClient } from '@/shared/api/client'
 *   import type { ApiResponse } from '@/shared/api/types'
 *
 *   export async function bulkEditProcesses(req: BulkEditProcessesRequest) {
 *     return apiClient.put<ApiResponse<BulkProcessActionResponse>>(
 *       '/processes/bulk-edit', req
 *     ).then(r => r.data)
 *   }
 */

const SIMULATED_LATENCY_MS = 600

// ── Request / Response types ──────────────────────────────────────────────────

export interface BulkEditProcessesRequest {
  processIds: string[]
  /** Selected "CompanyName - SiteName" to apply */
  companySite: string
}

export interface BulkSubmitProcessesRequest {
  processIds: string[]
}

export interface BulkProcessActionResponse {
  processed: number
  failed: number
}

// ── PUT — bulk edit (apply company/site to selected processes) ────────────────

export function bulkEditProcesses(
  req: BulkEditProcessesRequest,
): Promise<BulkProcessActionResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!req.processIds.length) {
        reject(new Error('At least one process must be selected'))
        return
      }
      if (!req.companySite) {
        reject(new Error('companySite is required'))
        return
      }
      resolve({ processed: req.processIds.length, failed: 0 })
    }, SIMULATED_LATENCY_MS)
  })
}

// ── POST — bulk submit selected processes ─────────────────────────────────────

export function bulkSubmitProcesses(
  req: BulkSubmitProcessesRequest,
): Promise<BulkProcessActionResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!req.processIds.length) {
        reject(new Error('At least one process must be selected'))
        return
      }
      resolve({ processed: req.processIds.length, failed: 0 })
    }, SIMULATED_LATENCY_MS)
  })
}
