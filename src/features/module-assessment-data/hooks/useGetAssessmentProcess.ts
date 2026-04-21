import { useQuery } from '@tanstack/react-query'
import type { TaskItem } from '../types/my-tasks'
import {getAssessmentProcess} from '../api/processAssesmentService'

export const assessmentProcessQueryKeys = {
  all: () => ['assessmentProcess'] as const,
}

export function useGetAssessmentProcess() {
  return useQuery<any[], Error>({
    queryKey: assessmentProcessQueryKeys.all(),
    queryFn: getAssessmentProcess,
    staleTime: 2 * 60 * 1_000,
  })
}
