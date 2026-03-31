/**
 * Column configuration for the Assessment Data Processes table.
 *
 * Since this table uses custom rowSpan rendering (incompatible with TanStack's
 * flat row model), column definitions are plain config objects rather than
 * TanStack ColumnDef instances. The AssessmentDataTable component consumes
 * these to render <th> headers and determine sizing.
 */

import type { EntityConfig } from '../types'

export interface HierarchyColumnConfig {
  kind: 'hierarchy'
  id: string
  label: string
  /** px width for inline style */
  size: number
  /** First 4 hierarchy columns are pinned left and use rowSpan */
  pinned?: boolean
}

export interface EntityColumnConfig {
  kind: 'entity'
  id: string
  entityName: string
  siteName: any
  size: number
}

export type AssessmentColumnConfig = HierarchyColumnConfig | EntityColumnConfig

// ── Hierarchy columns ────────────────────────────────────────────────────────

export const HIERARCHY_COLUMNS: HierarchyColumnConfig[] = [
  { kind: 'hierarchy', id: 'domain',  label: 'Domain',   size: 180},
  { kind: 'hierarchy', id: 'level1',  label: 'Level 1',  size: 200},
  { kind: 'hierarchy', id: 'level2',  label: 'Level 2',  size: 200},
  { kind: 'hierarchy', id: 'level3',  label: 'Level 3',  size: 240, pinned: true },
  { kind: 'hierarchy', id: 'level4',  label: 'Level 4',  size: 250 , pinned: true },
]


export function buildEntityLeafColumns(config: EntityConfig[]): EntityColumnConfig[] {
  return config.flatMap(entity =>
    entity.assmntCol.map((colName:any) => ({
      kind: 'entity' as const,
      id: `entity__${colName}}`,
      entityName: colName,
      siteName: colName,
      size: colName=='description'?350: 160,
    })),
  )
}

/**
 * Returns the full flat column list used to drive both the header and body.
 * Hierarchy columns come first, then every entity×site leaf column.
 */
export function buildAssessmentColumns(entityConfig: EntityConfig[]): AssessmentColumnConfig[] {
  return [...HIERARCHY_COLUMNS, ...buildEntityLeafColumns(entityConfig)]
}


