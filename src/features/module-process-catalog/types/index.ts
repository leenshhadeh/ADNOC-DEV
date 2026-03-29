export type YesNo = 'Yes' | 'No'

export type ProcessStatus = 'Published' | 'Pending approval' | 'Draft'

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

// ── Entity config ─────────────────────────────────────────────────────────────

export const ENTITY_CONFIG: Array<{ name: string; sites: string[] }> = [
  { name: 'ADNOC HQ', sites: ['General', 'Site A', 'Site B'] },
  { name: 'ADNOC AL DHAFRA AND AL YASAT', sites: ['General', 'Site A'] },
]
