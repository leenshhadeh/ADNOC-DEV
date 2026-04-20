// ─── Roles ────────────────────────────────────────────────────────────────────
//
// BPA Program Manager              — Final approver for process catalog changes.
// BPA Process Catalog Custodian    — Creates/edits catalog changes; first-level
//                                    review/approve/reject/return of requests
//                                    from Business & Digital Focal Points.
// Business Focal Point (BFP)       — Can request adding/updating processes and submit.
// Digital Focal Point (DFP)        — Can request adding/updating processes and submit.
// SME Expert                       — Subject-matter expert. Can save, validate,
//                                    and submit automation target data.
// Super Admin                      — Full access across all modules. Can apply
//                                    direct changes without approval, manage user
//                                    permissions, and configure group companies & sites.
export const ROLES = {
  QualityManager : 'Quality Manager',
  BusinessFocalPoint : 'Business Focal Point',
  DigitalFocalPoint : 'Digital Focal Point',
  BPA_ProgramManager : 'BPA Program Manager',
  BPA_ProcessCatalogCustodian : 'BPA Process Catalog Custodian',
  SuperAdmin:'Super Admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]



// ─── Actions ─────────────────────────────────────────────────────────────────

export const ACTIONS = [
  // Catalog — data mutations
  'ADD_LEVEL_4',
  'EDIT_ROW',
  'DELETE_PROCESS',
  'RENAME_PROCESS',
  // Catalog — workflow
  'VIEW_CHANGES',
  'VIEW_SUBMITTED_REQUESTS',
  'REQUEST_PROCESS_CHANGE', // BFP / DFP: raise a new request
  'SUBMIT_REQUEST', // BFP / DFP / Custodian: submit for review
  'APPROVE_REQUEST',
  'REJECT_REQUEST',
  'RETURN_REQUEST',
  // Automation Targets — process detail actions
  'AT_SAVE',
  'AT_VALIDATE',
  'AT_SUBMIT',
  'AT_APPROVE',
  'AT_REJECT',
  'AT_RETURN',
  'AT_DISCARD_DRAFT',
  'AT_COMMENT_ON_FIELD',
  // Administration (Super Admin only)
  'MANAGE_USER_PERMISSIONS',
  'MANAGE_GROUP_COMPANIES',
  'APPLY_DIRECT_CHANGES',
  'COMMENT_ON_FIELD',
] as const

export type Action = (typeof ACTIONS)[number]

// ─── Central permissions map ──────────────────────────────────────────────────
// Single source of truth: maps each action to the roles that may perform it.
// Super Admin is granted every action via hasPermission() — no need to list
// it here explicitly.

export const PERMISSIONS: Record<Action, Role[]> = {
  // ── Catalog mutations ───────────────────────────────────────────────────────
  ADD_LEVEL_4: [ROLES.BPA_ProcessCatalogCustodian],
  EDIT_ROW: [ROLES.BPA_ProcessCatalogCustodian],
  DELETE_PROCESS: [ROLES.BPA_ProcessCatalogCustodian],
  RENAME_PROCESS: [ROLES.BPA_ProcessCatalogCustodian],
  // ── Workflow ────────────────────────────────────────────────────────────────
  VIEW_CHANGES: [ROLES.BPA_ProgramManager, ROLES.BPA_ProcessCatalogCustodian],
  VIEW_SUBMITTED_REQUESTS: [
    ROLES.BPA_ProcessCatalogCustodian,
    ROLES.BusinessFocalPoint,
    ROLES.DigitalFocalPoint,
  ],
  REQUEST_PROCESS_CHANGE: [ROLES.BusinessFocalPoint, ROLES.DigitalFocalPoint],
  SUBMIT_REQUEST: [ROLES.BusinessFocalPoint, ROLES.DigitalFocalPoint, ROLES.BPA_ProcessCatalogCustodian],
  APPROVE_REQUEST: [ROLES.BPA_ProgramManager, ROLES.BPA_ProcessCatalogCustodian, ROLES.QualityManager],
  REJECT_REQUEST: [ROLES.BPA_ProgramManager, ROLES.BPA_ProcessCatalogCustodian, ROLES.QualityManager],
  RETURN_REQUEST: [ROLES.BPA_ProgramManager, ROLES.BPA_ProcessCatalogCustodian, ROLES.QualityManager],
  // ── Automation Targets — process detail actions ─────────────────────────────
  AT_SAVE: ['SME Expert'],
  AT_VALIDATE: ['SME Expert'],
  AT_SUBMIT: ['SME Expert'],
  AT_APPROVE: ['BPA Program Manager', 'Quality Manager'],
  AT_REJECT: ['BPA Program Manager', 'Quality Manager'],
  AT_RETURN: ['BPA Program Manager', 'Quality Manager'],
  AT_DISCARD_DRAFT: ['SME Expert'],
  AT_COMMENT_ON_FIELD: ['BPA Program Manager', 'Quality Manager'],
  // ── Administration (Super Admin wildcard covers these) ──────────────────────
  MANAGE_USER_PERMISSIONS: [],
  MANAGE_GROUP_COMPANIES: [],
  APPLY_DIRECT_CHANGES: [],
  COMMENT_ON_FIELD: [ROLES.QualityManager],
}

// ─── Permission check ─────────────────────────────────────────────────────────

/**
 * Returns true when `role` is permitted to perform `action`.
 * Super Admin always returns true regardless of the PERMISSIONS map.
 */
export function hasPermission(role: Role, action: Action): boolean {
  if (role === ROLES.SuperAdmin) return true
  return PERMISSIONS[action].includes(role)
}
