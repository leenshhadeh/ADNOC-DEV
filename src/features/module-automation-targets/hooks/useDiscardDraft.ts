import { useMutation, useQueryClient } from '@tanstack/react-query'
import { discardDraft } from '../api/automationTargetsService'

export const useDiscardDraft = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (processId: string) => discardDraft(processId),
    onSuccess: (_data, processId) => {
      void queryClient.invalidateQueries({ queryKey: ['automation-process-detail', processId] })
    },
  })
}
