/**
 * level4Service.ts
 *
 * Mock service layer for Level 4 process records.
 *
 * Swap the implementation bodies below for real Axios calls once the .NET
 * backend is available — the hook and all callers remain unchanged.
 *
 * Real implementation example:
 *   export async function getLevel4ByParent(parentId: string): Promise<Level4Item[]> {
 *     return apiClient.get<ApiResponse<Level4Item[]>>(`/processes/${parentId}/level4s`)
 *   }
 */

import type { Level4Item } from '../types'
import { MOCK_LEVEL4_DATA } from './mock-data'

const SIMULATED_LATENCY_MS = 800

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
