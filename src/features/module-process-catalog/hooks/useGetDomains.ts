import { useQuery } from '@tanstack/react-query'
import type { Domain } from '../types'
import { getDomains } from '../api/processCatalogService'

export const domainsQueryKeys = {
  all: () => ['domains'] as const,
}

export function useGetDomains() {
  return useQuery<Domain[], Error>({
    queryKey: domainsQueryKeys.all(),
    queryFn: getDomains,
    // Domains are a stable lookup — cache for 24 hours.
    staleTime: 24 * 60 * 60 * 1_000,
  })
}
