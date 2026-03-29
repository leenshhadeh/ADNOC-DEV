import { useQuery } from '@tanstack/react-query'
import type { GroupCompany } from '../types'
import { getGroupCompanies } from '../api/processCatalogService'

export const groupCompaniesQueryKeys = {
  all: () => ['groupCompanies'] as const,
}

export function useGetGroupCompanies() {
  return useQuery<GroupCompany[], Error>({
    queryKey: groupCompaniesQueryKeys.all(),
    queryFn: getGroupCompanies,
    // Group companies are a lookup — cache for 24 hours.
    staleTime: 24 * 60 * 60 * 1_000,
  })
}
