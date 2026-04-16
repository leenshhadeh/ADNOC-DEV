import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveSMEFeedback } from '../api/automationTargetsService'

interface SaveSMEFeedbackPayload {
  processId: string
  feedback: string
}

export const useSaveSMEFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ processId, feedback }: SaveSMEFeedbackPayload) =>
      saveSMEFeedback(processId, feedback),

    onSuccess: (_data, { processId }) => {
      void queryClient.invalidateQueries({ queryKey: ['automation-process-detail', processId] })
    },
  })
}
