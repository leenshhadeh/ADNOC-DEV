import { useQuery } from '@tanstack/react-query'
import type { ProcessItem } from '../types'
import { getProcessCatalogRows } from '../api/processCatalogService'

export const processCatalogQueryKeys = {
  rows: () => ['processCatalog', 'rows'] as const,
}

export function useGetProcessCatalogRows() {
  return useQuery<ProcessItem[], Error>({
    queryKey: processCatalogQueryKeys.rows(),
    queryFn: getProcessCatalogRows,
    staleTime: 5 * 60 * 1_000,
  })
}
