import { useQuery } from '@tanstack/react-query'
import type { TaskItem } from '../types/my-tasks'
import { getMyTasks } from '../api/processCatalogService'

export const myTasksQueryKeys = {
  all: () => ['myTasks'] as const,
}

export function useGetMyTasks() {
  return useQuery<TaskItem[], Error>({
    queryKey: myTasksQueryKeys.all(),
    queryFn: getMyTasks,
    staleTime: 2 * 60 * 1_000,
  })
}
