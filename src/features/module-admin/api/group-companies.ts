// group-companies.ts
/**
 * group-companies.ts
 *
 * API-ready service layer for Group Companies.
 *
 * Supported endpoints:
 * - GET all
 * - GET by id
 * - POST new
 * - PUT update row
 *
 * Replace endpoint paths only if the backend uses different routes.
 */

import axios from 'axios'

export type GroupCompanySite = {
  id: string
  name: string
}

export type GroupCompanyRow = {
  id: string
  groupCompany: string
  code: string
  sites: GroupCompanySite[]
  isEditing?: boolean
}

export interface CreateGroupCompanyRequest {
  groupCompany: string
  code: string
  sites?: Array<{
    name: string
  }>
}

export interface UpdateGroupCompanyRequest {
  groupCompany?: string
  code?: string
}

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

// ----------------------------------------------------------------------------
// Axios instance
// ----------------------------------------------------------------------------

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Optional: handle unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

// ----------------------------------------------------------------------------
// Error helper
// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------
// GET all group companies
// ----------------------------------------------------------------------------

export async function getGroupCompanies(): Promise<GroupCompanyRow[]> {
  try {
    const response = await api.get<ApiResponse<GroupCompanyRow[]>>('/api/group-companies')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// GET group company by id
// ----------------------------------------------------------------------------

export async function getGroupCompanyById(id: string): Promise<GroupCompanyRow> {
  try {
    const response = await api.get<ApiResponse<GroupCompanyRow>>(`/api/group-companies/${id}`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// POST create group company
// ----------------------------------------------------------------------------

export async function createGroupCompany(
  payload: CreateGroupCompanyRequest,
): Promise<GroupCompanyRow> {
  try {
    const response = await api.post<ApiResponse<GroupCompanyRow>>('/api/group-companies', payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// PUT update group company row
// ----------------------------------------------------------------------------

export async function updateGroupCompany(
  id: string,
  payload: UpdateGroupCompanyRequest,
): Promise<GroupCompanyRow> {
  try {
    const response = await api.put<ApiResponse<GroupCompanyRow>>(
      `/api/group-companies/${id}`,
      payload,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
