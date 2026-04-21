import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CommentEntry } from '../types/my-tasks'
import {
  getFieldComments,
  addFieldComment,
  type GetFieldCommentsParams,
} from '../api/processAssesmentService'

export const fieldCommentsKeys = {
  all: () => ['fieldComments'] as const,
  byField: (taskId: string, fieldName: string) => ['fieldComments', taskId, fieldName] as const,
}

export function useFieldComments(taskId: string | undefined, fieldName: string | undefined) {
  return useQuery<CommentEntry[], Error>({
    queryKey: fieldCommentsKeys.byField(taskId ?? '', fieldName ?? ''),
    queryFn: () =>
      getFieldComments({ taskId: taskId!, fieldName: fieldName! } satisfies GetFieldCommentsParams),
    enabled: !!taskId && !!fieldName,
    staleTime: 30_000,
  })
}

export function useAddFieldComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFieldComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: fieldCommentsKeys.byField(variables.taskId, variables.fieldName),
      })
    },
  })
}
