// userPermissionsService.ts
/**
 * userPermissionsService.ts
 *
 * API-ready service layer for User Permissions records.
 *
 * Replace endpoint paths only if the backend uses different routes.
 * The exported function names and signatures are kept stable so hooks
 * and UI callers do not need to change.
 */

import axios from 'axios'
import { apiClient } from '@/shared/api'
import type { DomainItem, GroupCompanyItem } from '../components/user-permissions/constants'
import type {
  AccessConfig,
  EditableField,
  UserDirectoryItem,
  UserPermissionRow,
} from '../components/user-permissions/types'

// ----------------------------------------------------------------------------
// Shared API envelope
// ----------------------------------------------------------------------------

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
// Request / Response types
// ----------------------------------------------------------------------------

export interface CreateUserPermissionRequest {
  userId: string
  assignedRole: string[]
  assignedAccess: AccessConfig
}

export interface UpdateUserPermissionFieldRequest {
  field: EditableField
  value: string | string[]
}

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
// GET rows
// ----------------------------------------------------------------------------

export async function getUserPermissionRows(): Promise<UserPermissionRow[]> {
  try {
    const response = await apiClient.get<ApiResponse<UserPermissionRow[]>>('/api/user-permissions')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// GET users
// ----------------------------------------------------------------------------

export async function getUserDirectory(): Promise<UserDirectoryItem[]> {
  try {
    const response = await apiClient.get<ApiResponse<UserDirectoryItem[]>>('/api/users/directory')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// GET roles
// ----------------------------------------------------------------------------

export async function getUserPermissionRoles(): Promise<string[]> {
  try {
    const response = await apiClient.get<ApiResponse<string[]>>('/api/user-permissions/roles')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// GET group companies
// ----------------------------------------------------------------------------

export async function getUserPermissionGroupCompanies(): Promise<GroupCompanyItem[]> {
  try {
    const response = await apiClient.get<ApiResponse<GroupCompanyItem[]>>(
      '/api/user-permissions/group-companies',
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// GET domains
// ----------------------------------------------------------------------------

export async function getUserPermissionDomains(): Promise<DomainItem[]> {
  try {
    const response = await apiClient.get<ApiResponse<DomainItem[]>>('/api/user-permissions/domains')
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// POST create row
// ----------------------------------------------------------------------------

export async function createUserPermission(
  payload: CreateUserPermissionRequest,
): Promise<UserPermissionRow> {
  try {
    const response = await apiClient.post<ApiResponse<UserPermissionRow>>(
      '/api/user-permissions',
      payload,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// PATCH single-field edit
// ----------------------------------------------------------------------------

export async function updateUserPermissionField(
  id: string,
  payload: UpdateUserPermissionFieldRequest,
): Promise<UserPermissionRow> {
  try {
    const response = await apiClient.patch<ApiResponse<UserPermissionRow>>(
      `/api/user-permissions/${id}/field`,
      payload,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// PUT access config
// ----------------------------------------------------------------------------

export async function updateUserPermissionAccess(
  id: string,
  assignedAccess: AccessConfig,
): Promise<UserPermissionRow> {
  try {
    const response = await apiClient.put<ApiResponse<UserPermissionRow>>(
      `/api/user-permissions/${id}/access`,
      { assignedAccess },
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// POST deactivate
// ----------------------------------------------------------------------------

export async function deactivateUserPermission(id: string): Promise<UserPermissionRow> {
  try {
    const response = await apiClient.post<ApiResponse<UserPermissionRow>>(
      `/api/user-permissions/${id}/deactivate`,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ----------------------------------------------------------------------------
// POST activate
// ----------------------------------------------------------------------------

export async function activateUserPermission(id: string): Promise<UserPermissionRow> {
  try {
    const response = await apiClient.post<ApiResponse<UserPermissionRow>>(
      `/api/user-permissions/${id}/activate`,
    )
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
