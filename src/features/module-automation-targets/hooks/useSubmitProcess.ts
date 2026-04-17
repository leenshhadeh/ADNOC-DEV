import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitProcess } from '../api/automationTargetsService'

export const useSubmitProcess = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (processId: string) => submitProcess(processId),
    onSuccess: (_data, processId) => {
      void queryClient.invalidateQueries({ queryKey: ['automation-process-detail', processId] })
    },
  })
}
