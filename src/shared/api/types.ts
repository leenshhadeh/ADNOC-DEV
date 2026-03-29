/**
 * Standard envelope returned by the ADNOC backend for every endpoint.
 *
 * Usage:
 *   const res = await apiClient.get<ApiResponse<User[]>>('/users')
 *   // res is already unwrapped to ApiResponse<User[]> by the response interceptor,
 *   // so res.data is User[].
 */
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  /** Optional pagination metadata, present on paginated list endpoints. */
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
}

/**
 * Shape of an error body returned by the backend.
 * The response interceptor normalises every non-2xx response to this.
 */
export interface ApiError {
  message: string
  code?: string
  status: number
}
