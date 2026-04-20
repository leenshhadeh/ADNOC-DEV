import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveProcess } from '../api/automationTargetsService'

export const useApproveProcess = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (processId: string) => approveProcess(processId),
    onSuccess: (_data, processId) => {
      void queryClient.invalidateQueries({ queryKey: ['automation-process-detail', processId] })
    },
  })
}
