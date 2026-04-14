import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  approveTask,
  returnTask,
  rejectTask,
  requestEndorsement,
  saveTaskFieldComments,
  bulkApproveTasks,
  bulkReturnTasks,
  bulkRejectTasks,
  bulkRequestEndorsement,
} from '../api/processAssesmentService'
import { myTasksQueryKeys } from './useGetMyTasks'

export function useApproveTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, comment }: { taskId: string; comment?: string }) =>
      approveTask(taskId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

export function useReturnTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskId,
      reason,
      comment,
    }: {
      taskId: string
      reason: string
      comment?: string
    }) => returnTask(taskId, reason, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

export function useRejectTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskId,
      reason,
      comment,
    }: {
      taskId: string
      reason?: string
      comment?: string
    }) => rejectTask(taskId, reason, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

export function useRequestEndorsement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskId,
      endorserNames,
      reason,
    }: {
      taskId: string
      endorserNames: string[]
      reason: string
    }) => requestEndorsement(taskId, endorserNames, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

export function useSaveTaskFieldComments() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => saveTaskFieldComments(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

// ── Bulk actions ──────────────────────────────────────────────────────────────

export function useBulkApproveTasks() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskIds }: { taskIds: string[] }) => bulkApproveTasks(taskIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

export function useBulkReturnTasks() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskIds, reason }: { taskIds: string[]; reason: string }) =>
      bulkReturnTasks(taskIds, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

export function useBulkRejectTasks() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskIds, reason }: { taskIds: string[]; reason: string }) =>
      bulkRejectTasks(taskIds, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}

export function useBulkRequestEndorsement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      taskIds,
      endorserNames,
      reason,
    }: {
      taskIds: string[]
      endorserNames: string[]
      reason: string
    }) => bulkRequestEndorsement(taskIds, endorserNames, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myTasksQueryKeys.all() })
    },
  })
}
