import { useQuery } from '@tanstack/react-query'
import {getAssessmentProcess} from '../api/processAssesmentService'
import type { DomainItem } from '../types/process'
import type { ProcessViewOptionId } from '@/shared/components/ProcessesMenu'

export const assessmentProcessQueryKeys = {
  all: (processView: ProcessViewOptionId) => ['assessmentProcess', processView] as const,
}

export function useGetAssessmentProcess(processView: ProcessViewOptionId) {
  return useQuery<DomainItem[], Error>({
    queryKey: assessmentProcessQueryKeys.all(processView),
    queryFn: () => getAssessmentProcess(processView),
    enabled: !!processView,
    staleTime: 2 * 60 * 1_000,
  })
}
