import { useQuery } from '@tanstack/react-query'
import { getOpportunities } from '../api/opportunityService'
import type { Opportunity } from '../types'

export const opportunityQueryKeys = {
  all: ['opportunities'] as const,
}

export function useGetOpportunities() {
  return useQuery<Opportunity[], Error>({
    queryKey: opportunityQueryKeys.all,
    queryFn: getOpportunities,
    staleTime: 2 * 60 * 1_000,
  })
}
