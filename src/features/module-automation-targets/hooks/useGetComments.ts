import { useQuery } from '@tanstack/react-query'
import { getComments } from '../api/automationTargetsService'

export const useGetComments = (processId: string) => {
  return useQuery({
    queryKey: ['automation-comments', processId],
    queryFn: () => getComments(processId),
    enabled: !!processId,
  })
}
