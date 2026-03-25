import { useState } from 'react'

import { TableBody } from '@/shared/components/ui/table'
import {
  ColHead,
  EditableCell,
  HierarchyTd,
  TableShell,
} from '@/shared/components/table-primitives'

import Level4Cell from './cells/Level4Cell'
import {
  buildAssessmentColumns,
  buildEntityLeafColumns,
  HIERARCHY_COLUMNS,
} from '../constants/assessment-columns'
import type { AssessmentDomain, EntityConfig, Level4Row } from '../types'

// ── Main component ────────────────────────────────────────────────────────────

interface AssessmentDataTableProps {
  data: AssessmentDomain[]
  entityConfig: EntityConfig[]
}

// ── Flatten helper ────────────────────────────────────────────────────────────
// Converts the hierarchical domain tree into a flat list of rendered rows.
// Each column cell carries an optional descriptor — present only on the first
// row that should render it (the remaining rows in the span omit it entirely).

interface CellDesc<T> {
  data: T
  rowSpan: number
}

interface FlatRow {
  key: string
  l4Item: Level4Row | null
  l3Id: string
  domainCell?: CellDesc<{ value: string }>
  level1Cell?: CellDesc<{ name: string; code: string }>
  level2Cell?: CellDesc<{ name: string; code: string }>
  level3Cell?: CellDesc<{ name: string; code: string }>
}

function flattenDomains(domains: AssessmentDomain[]): FlatRow[] {
  const rows: FlatRow[] = []

  for (const domain of domains) {
    const domainSpan = domain.level1Items.reduce(
      (s, l1) =>
        s +
        l1.level2Items.reduce(
          (s2, l2) =>
            s2 + l2.level3Items.reduce((s3, l3) => s3 + Math.max(1, l3.level4Items.length), 0),
          0,
        ),
      0,
    )
    let domainFirst = true

    for (const l1 of domain.level1Items) {
      const l1Span = l1.level2Items.reduce(
        (s, l2) =>
          s + l2.level3Items.reduce((s2, l3) => s2 + Math.max(1, l3.level4Items.length), 0),
        0,
      )
      let l1First = true

      for (const l2 of l1.level2Items) {
        const l2Span = l2.level3Items.reduce((s, l3) => s + Math.max(1, l3.level4Items.length), 0)
        let l2First = true

        for (const l3 of l2.level3Items) {
          const l3Span = Math.max(1, l3.level4Items.length)
          const l4List: (Level4Row | null)[] = l3.level4Items.length > 0 ? l3.level4Items : [null]
          let l3First = true

          for (const l4 of l4List) {
            const row: FlatRow = {
              key: l4 ? l4.id : `${l3.id}__empty`,
              l4Item: l4,
              l3Id: l3.id,
            }
            if (domainFirst) {
              row.domainCell = { data: { value: domain.domain }, rowSpan: domainSpan }
              domainFirst = false
            }
            if (l1First) {
              row.level1Cell = {
                data: { name: l1.level1Name, code: l1.level1Code },
                rowSpan: l1Span,
              }
              l1First = false
            }
            if (l2First) {
              row.level2Cell = {
                data: { name: l2.level2Name, code: l2.level2Code },
                rowSpan: l2Span,
              }
              l2First = false
            }
            if (l3First) {
              row.level3Cell = {
                data: { name: l3.level3Name, code: l3.level3Code },
                rowSpan: l3Span,
              }
              l3First = false
            }
            rows.push(row)
          }
        }
      }
    }
  }

  return rows
}

/** Mutable cell state: keyed by `${l4Id}__${entityName}__${site}` */
type CellState = Record<string, string>

const AssessmentDataTable = ({ data, entityConfig }: AssessmentDataTableProps) => {
  const columns = buildAssessmentColumns(entityConfig)
  const entityLeafs = buildEntityLeafColumns(entityConfig)

  // Compute left offsets for sticky hierarchy columns
  const stickyOffsets = HIERARCHY_COLUMNS.filter((c) => c.pinned).reduce<Record<string, number>>(
    (acc, col, i, arr) => {
      acc[col.id] = arr.slice(0, i).reduce((sum, c) => sum + c.size, 0)
      return acc
    },
    {},
  )

  const flatRows = flattenDomains(data)

  // Local mutable state for all editable entity/site cells
  const [cellValues, setCellValues] = useState<CellState>(() => {
    const init: CellState = {}
    for (const domain of data) {
      for (const l1 of domain.level1Items) {
        for (const l2 of l1.level2Items) {
          for (const l3 of l2.level3Items) {
            for (const l4 of l3.level4Items) {
              for (const entity of entityConfig) {
                for (const site of entity.sites) {
                  const key = `${l4.id}__${entity.name}__${site}`
                  init[key] = l4.entities[entity.name]?.[site] ?? ''
                }
              }
            }
          }
        }
      }
    }
    return init
  })

  const getCellValue = (l4Id: string, entityName: string, site: string) =>
    cellValues[`${l4Id}__${entityName}__${site}`] ?? ''

  const setCellValue = (l4Id: string, entityName: string, site: string, val: string) =>
    setCellValues((prev) => ({ ...prev, [`${l4Id}__${entityName}__${site}`]: val }))

  return (
    <TableShell>
      <div className="relative w-full overflow-auto">
        <table
          className="w-full caption-bottom border-separate border-spacing-0 text-sm"
          style={{ minWidth: 'max-content' }}
        >
          <thead>
            {/* Row 1 — actual column labels with sort icons */}
            <tr>
              {HIERARCHY_COLUMNS.filter((c) => c.pinned).map((col) => (
                <ColHead
                  key={col.id}
                  label={col.label}
                  size={col.size}
                  isSticky
                  leftOffset={stickyOffsets[col.id]}
                  className={col.id === 'level3' ? 'border-r-0 bg-white' : 'bg-white'}
                />
              ))}
              {/* Level 4 column header (last pinned-looking col, not actually sticky) */}
              <ColHead label="Level 4" size={250} className="border-r-border/60 border-r-2 bg-white" />
              {/* Site sub-headers */}
              {entityLeafs.map((col) => (
                <ColHead key={col.id} label={col.siteName} size={col.size}  className='bg-white'/>
              ))}
            </tr>
          </thead>

          {/* ── Body with rowSpan ────────────────────────────────────────── */}
          <TableBody>
            {flatRows.map((row) => (
              <tr
                key={row.key}
                className="group/row border-border hover:bg-muted/20 border-b transition-colors"
              >
                {/* Domain — rendered only on its first row */}
                {row.domainCell && (
                  <HierarchyTd
                    rowSpan={row.domainCell.rowSpan}
                    size={HIERARCHY_COLUMNS[0].size}
                    leftOffset={stickyOffsets['domain']}
                  >
                    <span className="text-foreground text-sm font-medium">
                      {row.domainCell.data.value}
                    </span>
                  </HierarchyTd>
                )}

                {/* Level 1 — rendered only on its first row */}
                {row.level1Cell && (
                  <HierarchyTd
                    rowSpan={row.level1Cell.rowSpan}
                    size={HIERARCHY_COLUMNS[1].size}
                    leftOffset={stickyOffsets['level1']}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground text-sm font-medium">
                        {row.level1Cell.data.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {row.level1Cell.data.code}
                      </span>
                    </div>
                  </HierarchyTd>
                )}

                {/* Level 2 — rendered only on its first row */}
                {row.level2Cell && (
                  <HierarchyTd
                    rowSpan={row.level2Cell.rowSpan}
                    size={HIERARCHY_COLUMNS[2].size}
                    leftOffset={stickyOffsets['level2']}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground text-sm font-medium">
                        {row.level2Cell.data.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {row.level2Cell.data.code}
                      </span>
                    </div>
                  </HierarchyTd>
                )}

                {/* Level 3 — rendered only on its first row */}
                {row.level3Cell && (
                  <HierarchyTd
                    rowSpan={row.level3Cell.rowSpan}
                    size={HIERARCHY_COLUMNS[3].size}
                    leftOffset={stickyOffsets['level3']}
                    isLast
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground text-sm font-medium">
                        {row.level3Cell.data.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {row.level3Cell.data.code}
                      </span>
                    </div>
                  </HierarchyTd>
                )}

                {/* ── Level 4 cell ─────────────────────────────────── */}
                <td
                  className="border-r-border/60 border-border border-r-2 border-b px-3 py-2 align-middle"
                  style={{ width: 250, minWidth: 250 }}
                >
                  <Level4Cell item={row.l4Item} />
                </td>

                {/* ── Entity/site editable cells ────────────────────── */}
                {entityLeafs.map((col) => (
                  <td
                    key={col.id}
                    className="border-border border-b px-1 py-1 align-middle"
                    style={{ width: col.size, minWidth: col.size }}
                  >
                    {row.l4Item ? (
                      <EditableCell
                        value={getCellValue(row.l4Item.id, col.entityName, col.siteName)}
                        onChange={(v) =>
                          setCellValue(row.l4Item!.id, col.entityName, col.siteName, v)
                        }
                      />
                    ) : (
                      <div className="text-muted-foreground px-2 py-1 text-sm">—</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </TableBody>
        </table>
      </div>
    </TableShell>
  )
}

export default AssessmentDataTable
