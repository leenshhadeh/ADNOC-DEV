
import type { TaskItem } from '../types/my-tasks'
import { MY_TASKS } from '../constants/my-tasks'


export function getMyTasks(): Promise<TaskItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MY_TASKS), 500))
}
