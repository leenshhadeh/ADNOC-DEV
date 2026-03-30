// ─── Roles ────────────────────────────────────────────────────────────────────
//
// BPA Program Manager              — Final approver for process catalog changes.
// BPA Process Catalog Custodian    — Creates/edits catalog changes; first-level
//                                    review/approve/reject/return of requests
//                                    from Business & Digital Focal Points.
// Business Focal Point (BFP)       — Can request adding/updating processes and submit.
// Digital Focal Point (DFP)        — Can request adding/updating processes and submit.
// Super Admin                      — Full access across all modules. Can apply
//                                    direct changes without approval, manage user
//                                    permissions, and configure group companies & sites.

export const ROLES = [
  'BPA Program Manager',
  'BPA Process Catalog Custodian',
  'Business Focal Point',
  'Digital Focal Point',
  'Super Admin',
] as const

export type Role = (typeof ROLES)[number]

// ─── Actions ─────────────────────────────────────────────────────────────────

export const ACTIONS = [
  // Catalog — data mutations
  'ADD_LEVEL_4',
  'EDIT_ROW',
  'DELETE_PROCESS',
  'RENAME_PROCESS',
  // Catalog — workflow
  'VIEW_CHANGES',
  'REQUEST_PROCESS_CHANGE', // BFP / DFP: raise a new request
  'SUBMIT_REQUEST', // BFP / DFP / Custodian: submit for review
  'APPROVE_REQUEST',
  'REJECT_REQUEST',
  'RETURN_REQUEST',
  // Administration (Super Admin only)
  'MANAGE_USER_PERMISSIONS',
  'MANAGE_GROUP_COMPANIES',
  'APPLY_DIRECT_CHANGES',
] as const

export type Action = (typeof ACTIONS)[number]

// ─── Central permissions map ──────────────────────────────────────────────────
// Single source of truth: maps each action to the roles that may perform it.
// Super Admin is granted every action via hasPermission() — no need to list
// it here explicitly.

export const PERMISSIONS: Record<Action, Role[]> = {
  // ── Catalog mutations ───────────────────────────────────────────────────────
  ADD_LEVEL_4: ['BPA Process Catalog Custodian'],
  EDIT_ROW: ['BPA Process Catalog Custodian'],
  DELETE_PROCESS: ['BPA Process Catalog Custodian'],
  RENAME_PROCESS: ['BPA Process Catalog Custodian'],
  // ── Workflow ────────────────────────────────────────────────────────────────
  VIEW_CHANGES: ['BPA Program Manager', 'BPA Process Catalog Custodian'],
  REQUEST_PROCESS_CHANGE: ['Business Focal Point', 'Digital Focal Point'],
  SUBMIT_REQUEST: ['Business Focal Point', 'Digital Focal Point', 'BPA Process Catalog Custodian'],
  APPROVE_REQUEST: ['BPA Program Manager', 'BPA Process Catalog Custodian'],
  REJECT_REQUEST: ['BPA Program Manager', 'BPA Process Catalog Custodian'],
  RETURN_REQUEST: ['BPA Program Manager', 'BPA Process Catalog Custodian'],
  // ── Administration (Super Admin wildcard covers these) ──────────────────────
  MANAGE_USER_PERMISSIONS: [],
  MANAGE_GROUP_COMPANIES: [],
  APPLY_DIRECT_CHANGES: [],
}

// ─── Permission check ─────────────────────────────────────────────────────────

/**
 * Returns true when `role` is permitted to perform `action`.
 * Super Admin always returns true regardless of the PERMISSIONS map.
 */
export function hasPermission(role: Role, action: Action): boolean {
  if (role === 'Super Admin') return true
  return PERMISSIONS[action].includes(role)
}
