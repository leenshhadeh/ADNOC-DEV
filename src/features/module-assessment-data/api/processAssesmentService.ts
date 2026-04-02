
import type { TaskItem } from '../types/my-tasks'
import { MY_TASKS } from '../constants/my-tasks'
import { SUBMITTED_REQUESTS } from '../constants/submitted-requests'



export function getMyTasks(): Promise<TaskItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MY_TASKS), 500))
}

// getSubmittedRequests
export function getSubmittedRequests(): Promise<any[]> {
  return new Promise((resolve) => setTimeout(() => resolve(SUBMITTED_REQUESTS), 500))
}
