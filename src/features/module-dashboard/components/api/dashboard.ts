import axios from 'axios'
import { apiClient } from '@/shared/api'

/* ---------------------------------- */
/* shared helpers                     */
/* ---------------------------------- */

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

/* ---------------------------------- */
/* process summary                    */
/* ---------------------------------- */

export interface ProcessSummaryDomainItem {
  id: string
  domainKey: string
  domainLabel: string
  l3: number
  l4: number
}

export interface ProcessSummaryStatusItem {
  id: string
  key: string
  label: string
  value: number
}

export interface ProcessSummaryPendingAction {
  total: number
  l3: number
  l4: number
}

export interface ProcessSummaryResponse {
  totalDomainsAssigned: number
  totalProcesses: number
  processesBreakdown: {
    l3: number
    l4: number
  }
  domainProcesses: ProcessSummaryDomainItem[]
  statusSummary: ProcessSummaryStatusItem[]
  pendingAction: ProcessSummaryPendingAction
}

export async function getProcessSummary(): Promise<ProcessSummaryResponse> {
  try {
    const response = await apiClient.get<ApiResponse<ProcessSummaryResponse>>(
      '/api/dashboard/process-summary',
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/* ---------------------------------- */
/* notifications                      */
/* ---------------------------------- */

export interface DashboardNotificationItem {
  id: string
  title: string
  description: string
  createdAt: string
  read: boolean
}

export interface DashboardNotificationsResponse {
  notifications: DashboardNotificationItem[]
  unreadCount: number
}

export async function getNotifications(): Promise<DashboardNotificationsResponse> {
  try {
    const response = await apiClient.get<ApiResponse<DashboardNotificationsResponse>>(
      '/api/dashboard/notifications',
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/* ---------------------------------- */
/* my tasks                           */
/* ---------------------------------- */

export interface DashboardTaskModule {
  title: string
  url: string
}

export interface DashboardTaskItem {
  id: string
  title: string
  description: string
  createdAt: string
}

export interface DashboardTaskGroup {
  module: DashboardTaskModule
  items: DashboardTaskItem[]
}

export interface GetMyTasksParams {
  module?: string[]
}

export interface DashboardMyTasksResponse {
  taskGroups: DashboardTaskGroup[]
  totalCount: number
}

export async function getMyTasks(params?: GetMyTasksParams): Promise<DashboardMyTasksResponse> {
  try {
    const searchParams = new URLSearchParams()

    params?.module?.forEach((module) => {
      searchParams.append('module', module)
    })

    const queryString = searchParams.toString()
    const endpoint = queryString
      ? `/api/dashboard/my-tasks?${queryString}`
      : '/api/dashboard/my-tasks'

    const response = await apiClient.get<ApiResponse<DashboardMyTasksResponse>>(endpoint)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function markNotificationAsRead(id: string): Promise<DashboardNotificationItem> {
  try {
    const response = await apiClient.patch<ApiResponse<DashboardNotificationItem>>(
      `/api/dashboard/notifications/${id}/read`,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
