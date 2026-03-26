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
  /** Top-tier entity name (e.g. "ADNOC HQ") */
  entityName: string
  /** Bottom-tier site name (e.g. "General") */
  siteName: string
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

// ── Entity matrix columns (flat list of all entity×site combinations) ────────

export function buildEntityLeafColumns(config: EntityConfig[]): EntityColumnConfig[] {
  return config.flatMap(entity =>
    entity.sites.map(site => ({
      kind: 'entity' as const,
      id: `entity__${entity.name}__${site}`,
      entityName: entity.name,
      siteName: site,
      size: 160,
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

/**
 * Returns unique entity names in order — used to render the top-tier grouped
 * header row (entity names spanning their site children).
 */
export function getEntityGroups(
  columns: AssessmentColumnConfig[],
): Array<{ entityName: string; colSpan: number }> {
  const entityColumns = columns.filter((c): c is EntityColumnConfig => c.kind === 'entity')
  const groups: Array<{ entityName: string; colSpan: number }> = []
  for (const col of entityColumns) {
    const last = groups[groups.length - 1]
    if (last && last.entityName === col.entityName) {
      last.colSpan++
    } else {
      groups.push({ entityName: col.entityName, colSpan: 1 })
    }
  }
  return groups
}
