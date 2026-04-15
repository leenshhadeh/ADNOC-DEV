import { useQuery } from '@tanstack/react-query'
import { getAutomationProcessDetail } from '../api/automationTargetsService'

export const useGetAutomationProcessDetail = (processId: string) => {
  return useQuery({
    queryKey: ['automation-process-detail', processId],
    queryFn: () => getAutomationProcessDetail(processId),
    enabled: !!processId,
  })
}
