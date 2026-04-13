import { useQuery } from '@tanstack/react-query'
import { getProcess } from '../api/processAssesmentService'

 

export function useGetProcessDetails(processId: string) {
  return useQuery<any[], Error>({
    queryKey: ['processDetails', processId],
    queryFn: () => getProcess(processId),
    enabled: !!processId,
    staleTime: 2 * 60 * 1_000,
  })
}