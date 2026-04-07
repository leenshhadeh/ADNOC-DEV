import { useQuery } from '@tanstack/react-query'
import { getLevel4ByParent, getLevel4NamesByParent } from '../api/level4Service'
import type { Level4Item } from '../types'

// Centralised key factory — ensures cache entries are consistent across the app
export const level4QueryKeys = {
  all: ['level4s'] as const,
  byParent: (parentId: string) => ['level4s', parentId] as const,
  namesByParent: (parentId: string) => ['level4s', 'names', parentId] as const,
}

/**
 * Fetches all Level 4 records for a given Level 3 parent.
 *
 * @param parentId - The Level 3 process id to load L4s for.
 *                   Pass an empty string / undefined to skip the fetch.
 *
 * Returns `{ data, isLoading, isError, error }` from TanStack Query.
 *
 * Swap `getLevel4ByParent` for a real Axios call when the backend is ready —
 * this hook's signature stays the same.
 */
export function useGetLevel4s(parentId: string | undefined) {
  return useQuery<Level4Item[], Error>({
    queryKey: level4QueryKeys.byParent(parentId ?? ''),
    queryFn: () => getLevel4ByParent(parentId!),
    // Skip the fetch entirely when parentId is empty
    enabled: Boolean(parentId),
    // Keep results fresh for 5 minutes — avoids redundant fetches while
    // navigating back and forth across catalog rows
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetches distinct Level 4 process names already added under the same
 * group company scope. Used to populate the suggestion dropdown in
 * EditLevel4sModal.
 */
export function useGetLevel4Names(parentId: string | undefined) {
  return useQuery<string[], Error>({
    queryKey: level4QueryKeys.namesByParent(parentId ?? ''),
    queryFn: () => getLevel4NamesByParent(parentId!),
    enabled: Boolean(parentId),
    staleTime: 5 * 60 * 1000,
  })
}
