import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError, ApiResponse } from './types'
import { getAccessToken } from '@/shared/auth/useAuth'

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const TIMEOUT_MS = 10_000

// ── Instance ──────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor ───────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken()
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error: unknown) => Promise.reject(error),
)

// ── Response interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  // Unwrap the envelope so callers receive response.data directly.
  // The cast is deliberate: downstream callers type the return via the
  // generic on apiClient.get<ApiResponse<T>>(), so the runtime shape is correct.
  (response: AxiosResponse<ApiResponse<unknown>>) =>
    response.data as unknown as AxiosResponse<ApiResponse<unknown>>,

  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status

    if (status === 401) {
      // Session expired — redirect to Azure AD login.
      window.location.replace('/login')
    }

    if (status !== undefined && status >= 500) {
      // Bubble the event so the global toast listener in AppProviders can pick it up
      window.dispatchEvent(
        new CustomEvent('api:server-error', {
          detail: {
            status,
            message: error.response?.data?.message ?? 'An unexpected server error occurred.',
          },
        }),
      )
    }

    const normalised: ApiError = {
      message: error.response?.data?.message ?? error.message ?? 'Unknown error',
      status: status ?? 0,
      code: error.code,
    }

    return Promise.reject(normalised)
  },
)
