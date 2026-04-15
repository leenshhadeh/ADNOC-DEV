/**
 * level4Service.ts
 *
 * Mock service layer for Level 4 process records.
 *
 * Swap the implementation bodies below for real Axios calls once the .NET
 * backend is available — the hook and all callers remain unchanged.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Endpoint contract for the BE team:                                         │
 * │                                                                            │
 * │  GET  /api/processes/:parentId/level4s                                     │
 * │    Resp:  { data: Level4Item[], success, message }                         │
 * │                                                                            │
 * │  POST /api/processes/:parentId/level4s                                     │
 * │    Body:  { selectedCompanySites: string[], items: CreateLevel4Request[] } │
 * │    Resp:  { data: Level4Item[], success, message }                         │
 * │                                                                            │
 * │  PUT  /api/processes/:parentId/level4s                                     │
 * │    Body:  { rows: UpdateLevel4Request[] }                                  │
 * │    Resp:  { data: { updated: number, created: number, deleted: number },   │
 * │            success, message }                                              │
 * │                                                                            │
 * │  DELETE /api/level4s/:id                                                   │
 * │    Resp:  { data: { id: string }, success, message }                       │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Real implementation example:
 *   import { apiClient } from '@/shared/api/client'
 *   import type { ApiResponse } from '@/shared/api/types'
 *
 *   export async function getLevel4ByParent(parentId: string) {
 *     return apiClient.get<ApiResponse<Level4Item[]>>(`/processes/${parentId}/level4s`)
 *   }
 */

import type { Level4Item } from '../types'
import { MOCK_LEVEL4_DATA } from './mock-data'

const SIMULATED_LATENCY_MS = 800

// ── Request / Response types ──────────────────────────────────────────────────

/** POST /api/processes/:parentId/level4s — create new L4 rows */
export interface CreateLevel4Request {
  processName: string
  processDescription?: string
}

/** PUT /api/processes/:parentId/level4s — full replacement of L4 rows */
export interface UpdateLevel4Request {
  processName: string
  processDescription?: string
  status?: 'Published' | 'Draft'
}

export interface SaveLevel4sResponse {
  updated: number
  created: number
  deleted: number
}

export interface DeleteLevel4Response {
  id: string
}

// ── GET ───────────────────────────────────────────────────────────────────────

/**
 * Returns all Level 4 records whose parentId matches the given Level 3 id.
 * The 800 ms delay simulates real network latency during development.
 */
export function getLevel4ByParent(parentId: string): Promise<Level4Item[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!parentId) {
        reject(new Error('parentId is required'))
        return
      }

      const results = MOCK_LEVEL4_DATA.filter((item) => item.parentId === parentId)
      resolve(results)
    }, SIMULATED_LATENCY_MS)
  })
}

// ── POST — create new L4 rows under a parent ─────────────────────────────────

/**
 * Creates new Level 4 rows under the given Level 3 parent.
 *
 * Replace the mock body with:
 *   return apiClient.post<ApiResponse<Level4Item[]>>(
 *     `/processes/${parentId}/level4s`, { items }
 *   ).then(r => r.data)
 */
export function createLevel4s(
  parentId: string,
  items: CreateLevel4Request[],
): Promise<Level4Item[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!parentId) {
        reject(new Error('parentId is required'))
        return
      }
      if (!items.length) {
        reject(new Error('At least one item is required'))
        return
      }

      const created: Level4Item[] = items.map((item, i) => ({
        id: `l4-new-${Date.now()}-${i}`,
        processCode: `AUTO.${Date.now()}.${i + 1}`,
        name: item.processName,
        description: item.processDescription ?? '',
        status: 'Draft',
        parentId,
      }))

      resolve(created)
    }, SIMULATED_LATENCY_MS)
  })
}

// ── PUT — full save / sync of L4 rows under a parent ─────────────────────────

/**
 * Saves the full set of Level 4 rows for the given Level 3 parent.
 * The backend should diff against its stored rows to determine which
 * rows were created, updated, or deleted.
 *
 * Replace the mock body with:
 *   return apiClient.put<ApiResponse<SaveLevel4sResponse>>(
 *     `/processes/${parentId}/level4s`, { rows }
 *   ).then(r => r.data)
 */
export function saveLevel4s(
  parentId: string,
  rows: UpdateLevel4Request[],
): Promise<SaveLevel4sResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!parentId) {
        reject(new Error('parentId is required'))
        return
      }

      const existing = MOCK_LEVEL4_DATA.filter((item) => item.parentId === parentId)
      const existingNames = new Set(existing.map((e) => e.name))
      const incomingNames = new Set(rows.map((r) => r.processName))

      const created = rows.filter((r) => !existingNames.has(r.processName)).length
      const updated = rows.filter((r) => existingNames.has(r.processName)).length
      const deleted = existing.filter((e) => !incomingNames.has(e.name)).length

      resolve({ updated, created, deleted })
    }, SIMULATED_LATENCY_MS)
  })
}

// ── DELETE — remove a single L4 row ───────────────────────────────────────────

/**
 * Deletes a single Level 4 record by id.
 *
 * Replace the mock body with:
 *   return apiClient.delete<ApiResponse<DeleteLevel4Response>>(
 *     `/level4s/${id}`
 *   ).then(r => r.data)
 */
export function deleteLevel4(id: string): Promise<DeleteLevel4Response> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id) {
        reject(new Error('id is required'))
        return
      }
      resolve({ id })
    }, SIMULATED_LATENCY_MS)
  })
}

// ── GET — all L4 process names under the same group company ───────────────────

/**
 * Returns distinct Level 4 process names already added under the same
 * group company / parent scope. Used by the EditLevel4sModal to show
 * name suggestions and avoid duplicates.
 *
 * Replace the mock body with:
 *   return apiClient.get<ApiResponse<string[]>>(
 *     `/processes/${parentId}/level4-names`
 *   ).then(r => r.data)
 */
export function getLevel4NamesByParent(parentId: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!parentId) {
        reject(new Error('parentId is required'))
        return
      }

      // Return all distinct L4 names across every parent (simulates group-company scope)
      const names = [...new Set(MOCK_LEVEL4_DATA.map((item) => item.name))]
      resolve(names)
    }, SIMULATED_LATENCY_MS / 2)
  })
}
