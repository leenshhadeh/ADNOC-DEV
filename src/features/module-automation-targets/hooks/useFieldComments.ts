import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CommentEntry } from '../types'
import { getFieldComments, addFieldComment } from '../api/automationTargetsService'

export const fieldCommentsKeys = {
  all: () => ['at-fieldComments'] as const,
  byField: (processId: string, fieldId: string) =>
    ['at-fieldComments', processId, fieldId] as const,
}

export function useFieldComments(processId: string | undefined, fieldId: string | undefined) {
  return useQuery<CommentEntry[], Error>({
    queryKey: fieldCommentsKeys.byField(processId ?? '', fieldId ?? ''),
    queryFn: () => getFieldComments({ processId: processId!, fieldId: fieldId! }),
    enabled: !!processId && !!fieldId,
    staleTime: 30_000,
  })
}

export function useAddFieldComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFieldComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: fieldCommentsKeys.byField(variables.processId, variables.fieldId),
      })
    },
  })
}
