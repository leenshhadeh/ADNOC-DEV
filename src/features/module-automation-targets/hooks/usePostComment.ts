import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postComment } from '../api/automationTargetsService'
import type { CommentEntry } from '../types'

interface PostCommentPayload {
  processId: string
  text: string
  author: string
  role: string
}

export const usePostComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ processId, text, author, role }: PostCommentPayload) =>
      postComment(processId, { text, author, role }),

    // Optimistic update: prepend the new comment immediately
    onMutate: async ({ processId, text, author, role }) => {
      await queryClient.cancelQueries({ queryKey: ['automation-comments', processId] })

      const previous = queryClient.getQueryData<CommentEntry[]>(['automation-comments', processId])

      const optimistic: CommentEntry = {
        id: `cmt-optimistic-${Date.now()}`,
        author,
        role,
        text,
        timestamp: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        statusLabel: 'Draft',
      }

      queryClient.setQueryData<CommentEntry[]>(['automation-comments', processId], (old = []) => [
        optimistic,
        ...old,
      ])

      return { previous, processId }
    },

    // On error: roll back to previous state
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(['automation-comments', context.processId], context.previous)
      }
    },

    // On success: replace optimistic entry with server response
    onSuccess: (newComment, { processId }) => {
      queryClient.setQueryData<CommentEntry[]>(['automation-comments', processId], (old = []) =>
        old.map((c) => (c.id.startsWith('cmt-optimistic-') ? newComment : c)),
      )
    },
  })
}
