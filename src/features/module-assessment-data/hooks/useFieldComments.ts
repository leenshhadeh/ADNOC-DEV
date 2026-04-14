import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CommentEntry } from '../types/my-tasks'
import {
  getFieldComments,
  addFieldComment,
  type GetFieldCommentsParams,
} from '../api/processAssesmentService'

export const fieldCommentsKeys = {
  all: () => ['fieldComments'] as const,
  byChange: (taskId: string, changeId: string) => ['fieldComments', taskId, changeId] as const,
}

export function useFieldComments(taskId: string | undefined, changeId: string | undefined) {
  return useQuery<CommentEntry[], Error>({
    queryKey: fieldCommentsKeys.byChange(taskId ?? '', changeId ?? ''),
    queryFn: () =>
      getFieldComments({ taskId: taskId!, changeId: changeId! } satisfies GetFieldCommentsParams),
    enabled: !!taskId && !!changeId,
    staleTime: 30_000,
  })
}

export function useAddFieldComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFieldComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: fieldCommentsKeys.byChange(variables.taskId, variables.changeId),
      })
    },
  })
}
