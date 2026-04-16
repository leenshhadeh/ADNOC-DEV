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
import { apiClient } from '@/shared/api'
import type { FlattenedRateCardRow } from '../components/rate-cards/types'

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
    const response = await apiClient.get<ApiResponse<FlattenedRateCardRow[]>>('/api/rate-cards')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function patchRateCardValue(
  payload: PatchRateCardValueRequest,
): Promise<FlattenedRateCardRow[]> {
  try {
    const response = await apiClient.patch<ApiResponse<FlattenedRateCardRow[]>>(
      '/api/rate-cards',
      payload,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
