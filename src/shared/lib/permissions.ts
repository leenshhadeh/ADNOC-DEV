// ─── Roles ────────────────────────────────────────────────────────────────────

export const ROLES = ['BPA Program Manager', 'Opportunity Manager'] as const
export type Role = (typeof ROLES)[number]

// ─── Actions ─────────────────────────────────────────────────────────────────

export const ACTIONS = [
  'ADD_LEVEL_4',
  'EDIT_ROW',
  'VIEW_CHANGES',
  'DELETE_PROCESS',
  'RENAME_PROCESS',
] as const

export type Action = (typeof ACTIONS)[number]

// ─── Central permissions map ──────────────────────────────────────────────────
// Single source of truth: maps each action to the roles that may perform it.

export const PERMISSIONS: Record<Action, Role[]> = {
  ADD_LEVEL_4: ['BPA Program Manager'],
  EDIT_ROW: ['BPA Program Manager', 'Opportunity Manager'],
  VIEW_CHANGES: ['BPA Program Manager', 'Opportunity Manager'],
  DELETE_PROCESS: ['BPA Program Manager'],
  RENAME_PROCESS: ['BPA Program Manager'],
}

/** Returns true when `role` is permitted to perform `action`. */
export function hasPermission(role: Role, action: Action): boolean {
  return PERMISSIONS[action].includes(role)
}
