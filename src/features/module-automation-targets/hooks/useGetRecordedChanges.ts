import { useQuery } from '@tanstack/react-query'
import { getRecordedChanges } from '../api/automationTargetsService'

export const useGetRecordedChanges = (processId: string) =>
  useQuery({
    queryKey: ['automation-recorded-changes', processId],
    queryFn: () => getRecordedChanges(processId),
    enabled: !!processId,
  })
