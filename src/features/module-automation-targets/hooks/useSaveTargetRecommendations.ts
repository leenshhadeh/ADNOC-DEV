import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveTargetRecommendations } from '../api/automationTargetsService'

interface SaveTargetRecommendationsPayload {
  processId: string
  targetAutomationLevelPercent: string
  smeFeedback: string
  toBeAIPowered: string
  toBeAIPoweredComments: string
}

export const useSaveTargetRecommendations = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ processId, ...payload }: SaveTargetRecommendationsPayload) =>
      saveTargetRecommendations(processId, payload),

    onSuccess: (_data, { processId }) => {
      void queryClient.invalidateQueries({ queryKey: ['automation-process-detail', processId] })
    },
  })
}
