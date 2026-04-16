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
import { apiClient } from '@/shared/api'
import type { DomainRow } from '../components/domains/types'

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
    const response = await apiClient.get<ApiResponse<DomainRow[]>>('/api/domains')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createDomain(payload: CreateDomainRequest): Promise<DomainRow> {
  try {
    const response = await apiClient.post<ApiResponse<DomainRow>>('/api/domains', payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateDomain(id: string, payload: UpdateDomainRequest): Promise<DomainRow> {
  try {
    const response = await apiClient.put<ApiResponse<DomainRow>>(`/api/domains/${id}`, payload)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
