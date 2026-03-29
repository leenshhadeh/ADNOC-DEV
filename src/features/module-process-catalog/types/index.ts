export type YesNo = 'Yes' | 'No'

export type ProcessStatus =
  | 'Published'
  | 'Pending approval'
  | 'Draft'
  | 'Ready for Submission'
  | 'Quality Review'
  | 'Digital VP Review'
  | 'Returned'
  | 'Rejected'

export interface ProcessItem {
  id: string
  domain: string
  level1Name: string
  level1Code: string
  level2Name: string
  level2Code: string
  level3Name: string
  level3Code: string
  level3Status: ProcessStatus
  description: string
  isSharedService: boolean
  entities: Record<string, Record<string, YesNo>>
}

// ── Level 4 ───────────────────────────────────────────────────────────────────

export interface Level4Item {
  id: string
  /** Auto-generated code, e.g. "EXP.1.1.1.1" */
  processCode: string
  name: string
  description: string
  status: ProcessStatus
  /** FK to the parent Level 3 record */
  parentId: string
}

// ── Group Company ─────────────────────────────────────────────────────────────

/**
 * Represents a group company / subsidiary entity.
 * The full list is fetched from the API as a lookup (getGroupCompanies).
 * Each user sees only the companies they have access to.
 */
export interface GroupCompany {
  id: string
  name: string
  sites: string[]
}
