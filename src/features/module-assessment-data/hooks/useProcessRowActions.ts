import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  archiveProcess,
  markProcessAsReviewed,
  submitProcess,
  switchProcessToDraft,
} from '../api/processAssesmentService'
import { assessmentProcessQueryKeys } from './useGetAssessmentProcess'

const PROCESS_VIEWS = ['published', 'latest', 'archived'] as const

// Invalidates all assessment process views after a row action changes process state.
const invalidateAssessmentProcessQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  PROCESS_VIEWS.forEach((view) => {
    queryClient.invalidateQueries({ queryKey: assessmentProcessQueryKeys.all(view) })
  })
}

// Calls the submit process API and refreshes process lists on success.
export function useSubmitProcess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ processId , process}: { processId: string ,process:any}) => submitProcess(processId , process),
    onSuccess: () => {
      invalidateAssessmentProcessQueries(queryClient)
    },
  })
}

// Calls the switch-to-draft API. The table updates the visible row locally.
export function useSwitchProcessToDraft() {
  return useMutation({
    mutationFn: ({ processId }: { processId: string }) => switchProcessToDraft(processId),
  })
}

// Calls the mark-as-reviewed API and refreshes process lists on success.
export function useMarkProcessAsReviewed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ processId }: { processId: string }) => markProcessAsReviewed(processId),
    onSuccess: () => {
      invalidateAssessmentProcessQueries(queryClient)
    },
  })
}

// Calls the archive API and refreshes process lists on success.
export function useArchiveProcess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ processId }: { processId: string }) => archiveProcess(processId),
    onSuccess: () => {
      invalidateAssessmentProcessQueries(queryClient)
    },
  })
}
