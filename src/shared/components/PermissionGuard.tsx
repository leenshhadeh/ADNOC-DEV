import type { ReactNode } from 'react'
import { useCurrentUser } from '@/shared/auth/useUserStore'
import { hasPermission, type Action, type Role } from '@/shared/lib/permissions'

// ─── Props ────────────────────────────────────────────────────────────────────

type PermissionGuardProps = {
  children: ReactNode
  /** Rendered when access is denied. Defaults to null. */
  fallback?: ReactNode
} & ({ action: Action; allowedRoles?: never } | { allowedRoles: Role[]; action?: never })

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders `children` only when the current user is permitted.
 *
 * Usage (via central permissions map):
 *   <PermissionGuard action="ADD_LEVEL_4">…</PermissionGuard>
 *
 * Usage (inline role list, for one-off cases):
 *   <PermissionGuard allowedRoles={['BPA Program Manager']}>…</PermissionGuard>
 */
export function PermissionGuard({
  action,
  allowedRoles,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { role } = useCurrentUser()

  const permitted =
    action !== undefined ? hasPermission(role, action) : (allowedRoles ?? []).includes(role)

  return permitted ? <>{children}</> : <>{fallback}</>
}
