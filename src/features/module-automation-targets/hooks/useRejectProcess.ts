import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectProcess } from '../api/automationTargetsService'

export const useRejectProcess = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ processId, reason }: { processId: string; reason?: string }) =>
      rejectProcess(processId, reason),
    onSuccess: (_data, { processId }) => {
      void queryClient.invalidateQueries({ queryKey: ['automation-process-detail', processId] })
    },
  })
}
