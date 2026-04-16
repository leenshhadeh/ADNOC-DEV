import { useQuery } from '@tanstack/react-query'
import { getOpportunities } from '../api/automationTargetsService'

export const useGetOpportunities = (processId: string) =>
  useQuery({
    queryKey: ['automation-opportunities', processId],
    queryFn: () => getOpportunities(processId),
    enabled: !!processId,
  })
