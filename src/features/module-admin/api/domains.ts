// domains.ts
/**
 * domains.ts
 *
 * API-ready service layer for Domains.
 *
 * Supported endpoints:
 * - GET rows
 * - POST row
 * - PUT row
 *
 * Notes:
 * - GET rows should return data sorted by sortingIndex ascending.
 * - Replace endpoint paths only if the backend uses different routes.
 */

import axios from 'axios'

export type DomainRow = {
  id: string
  businessDomain: string
  code: string
  sortingIndex: number | string
  isEditing?: boolean
}

export interface CreateDomainRequest {
  businessDomain: string
  code: string
  sortingIndex: number
}

export interface UpdateDomainRequest {
  businessDomain?: string
  code?: string
  sortingIndex?: number
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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

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

export async function getDomains(): Promise<DomainRow[]> {
  try {
    const response = await api.get<ApiResponse<DomainRow[]>>('/api/domains')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createDomain(payload: CreateDomainRequest): Promise<DomainRow> {
  try {
    const response = await api.post<ApiResponse<DomainRow>>('/api/domains', payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateDomain(id: string, payload: UpdateDomainRequest): Promise<DomainRow> {
  try {
    const response = await api.put<ApiResponse<DomainRow>>(`/api/domains/${id}`, payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
