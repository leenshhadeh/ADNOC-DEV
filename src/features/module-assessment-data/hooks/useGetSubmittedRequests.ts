import { useQuery } from '@tanstack/react-query'
import type { RequestItem } from '../types/submitted-requests'
import { getSubmittedRequests } from '../api/processAssesmentService'

export const submittedRequestsQueryKeys = {
  all: () => ['submittedRequests'] as const,
}

export function useGetSubmittedRequests() {
  return useQuery<RequestItem[], Error>({
    queryKey: submittedRequestsQueryKeys.all(),
    queryFn: getSubmittedRequests,
    staleTime: 2 * 60 * 1_000,
  })
}
