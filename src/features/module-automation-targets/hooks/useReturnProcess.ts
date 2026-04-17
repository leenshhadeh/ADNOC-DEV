import { useMutation, useQueryClient } from '@tanstack/react-query'
import { returnForRevision } from '../api/automationTargetsService'

export const useReturnProcess = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (processId: string) => returnForRevision(processId),
    onSuccess: (_data, processId) => {
      void queryClient.invalidateQueries({ queryKey: ['automation-process-detail', processId] })
    },
  })
}
