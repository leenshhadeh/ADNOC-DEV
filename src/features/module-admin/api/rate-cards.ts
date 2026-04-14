/**
 * rate-cards.ts
 *
 * API-ready service layer for Rate Cards.
 *
 * Supported endpoints:
 * - GET all rate card rows
 * - PATCH one or many rate card values
 *
 * Notes:
 * - GET rows should return all rows needed by the table.
 * - PATCH updates the same rateCardValue for one or more rows.
 * - Replace endpoint paths only if the backend uses different routes.
 */

import axios from 'axios'

export type FlattenedRateCardRow = {
  id: string
  groupCompany: string
  domain?: string
  domainCode?: string
  level1?: string
  level1Code?: string
  level2?: string
  level2Code?: string
  processLevel3?: string
  processLevel3Code?: string
  processLevel4?: string
  processLevel4Code?: string
  rateCardValue: number | string
}

export interface PatchRateCardValueRequest {
  ids: string[]
  rateCardValue: number
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

export async function getRateCards(): Promise<FlattenedRateCardRow[]> {
  try {
    const response = await api.get<ApiResponse<FlattenedRateCardRow[]>>('/api/rate-cards')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function patchRateCardValue(
  payload: PatchRateCardValueRequest,
): Promise<FlattenedRateCardRow[]> {
  try {
    const response = await api.patch<ApiResponse<FlattenedRateCardRow[]>>(
      '/api/rate-cards',
      payload,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
