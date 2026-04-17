import { z } from 'zod'

export const targetRecommendationsSchema = z.object({
  targetAutomationLevelPercent: z.string().min(1, 'Target automation level is required'),
  toBeAIPowered: z.string().min(1, 'AI powered field is required'),
  toBeAIPoweredComments: z.string().optional(),
  smeFeedback: z.string().optional(),
})

export type TargetRecommendationsFormValues = z.infer<typeof targetRecommendationsSchema>
