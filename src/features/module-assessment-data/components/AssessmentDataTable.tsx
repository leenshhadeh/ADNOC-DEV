import React from 'react'

import { TableBody } from '@/shared/components/ui/table'
import {
  ColHead,
  EditableCell,
  HierarchyTd,
  RadioCell,
  TableShell,
} from '@/shared/components/table-primitives'
import Level4Cell from './cells/Level4Cell'
import { buildEntityLeafColumns, HIERARCHY_COLUMNS } from '../constants/assessment-columns'
import type { AssessmentDomain, EntityConfig, Level4Row } from '../types'
import { cn } from '@/shared/lib/utils'
import { StatusBadgeCell } from '@/features/module-process-catalog/components/cells'
import { Maximize2 ,Tally1} from 'lucide-react'


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
  //level3Cell?: CellDesc<{ name: string; code: string; groupCompany?: string; status?: string }>
  level3Cell?: any;
}

function flattenDomains(domains: AssessmentDomain[]): FlatRow[] {
  //TODO:  calculate the row span for each level and create a flat list of rows to render
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

          // rows for level 4 items (or a single row with empty L4 if none exist)
          for (const l4 of l4List) {
            const row: FlatRow = {
              key: l4 ? l4.id : `${l3.id}__empty`,
              l4Item:  l4 && {...l4, 
                id:l4.id ,
                status: l4?.status || l3.status,
                site: l4?.site || l3.site,
                description: l4?.description || l3.description,
              
              
              } ,
              l3Id: l3.id,
            }
            if (domainFirst) {
              row.domainCell = { data: { value: domain.domain }, rowSpan: domainSpan }
              domainFirst = false
            }
            // level1Cell
            if (l1First) {
              row.level1Cell = {
                data: { name: l1.level1Name, code: l1.level1Code },
                rowSpan: l1Span,
              }
              l1First = false
            }
            // level2Cell
            if (l2First) {
              row.level2Cell = {
                data: { name: l2.level2Name, code: l2.level2Code },
                rowSpan: l2Span,
              }
              l2First = false
            }
            // level3Cell
            if (l3First) {
              row.level3Cell = { 
                data: {
                  name: l3.level3Name,
                  code: l3.level3Code,
                  groupCompany: l3.groupCompany,
                  status: l3.status,
                  site: l3.site,
                  description: l3.description,
                  centrallyGovernedProcess: l3.centrallyGovernedProcess,
                  sharedService: l3.sharedService,
                  businessUnit: l3.businessUnit,
                  ResponsibleDigitalTeam : l3.ResponsibleDigitalTeam,
                  processCriticality: l3.processCriticality,

                },
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




const AssessmentDataTable = ({ data, entityConfig }: AssessmentDataTableProps) => {
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

  const getSharedCellValue = (item:any) => {
    let parsedValue: any
    try {
      parsedValue = {
        services: item?.services ?? 0,
        shared: item?.shared ?? 0,
      }
    } catch {
      parsedValue = {}
    }
    if (parsedValue.services && parsedValue.shared) {
      return (
        <div className="flex justify-between items-center">
          <span className='pe-[7px]'>{parsedValue.services}</span>
          <Tally1  className='rotate-[25deg] text-[#DFE3E6] mt-[7px]'/>
          <span className="text-muted-foreground pe-[7px]">{parsedValue.shared} Shared</span>
          <Tally1 className='text-[#DFE3E6]' />
          <Maximize2 className="size-4" strokeWidth={2} />
        </div>
      )
    }
    return <></>
  }

  // const setCellValue = (l4Id: string, entityName: string, site: string, val: string) =>
  //  setCellValues((prev) => ({ ...prev, [`${l4Id}__${entityName}__${site}`]: val }))

  // entities columns data - render and configration
  const entityCells = (row: any) => [
    {
      key: 'site',
      content: (
        <td style={{ width: entityLeafs[0].size, minWidth: entityLeafs[0].size }}>
          <EditableCell
            value={ row.l4Item?.site|| row.level3Cell?.data.site ||''}//{getCellValue(row.l4Item?.id, entityLeafs[0].entityName, entityLeafs[0].siteName)}
            onChange={()=>{}}
          />
        </td>
      ),
    },
    {
      key: 'status',
      content: (
        <td style={{ width: entityLeafs[1].size, minWidth: entityLeafs[1].size }}>
          <StatusBadgeCell
            status={ row.l4Item?.status || row.level3Cell?.data.status || ''}//{getCellValue(row.l4Item?.id, entityLeafs[1].entityName, entityLeafs[1].siteName, row.level3Cell?.data.status)}
          />
        </td>
      ),
    },
    {
      key: 'desc',
      content: (
        <td style={{ width: entityLeafs[2].size, minWidth: entityLeafs[2].size }}>
          <EditableCell
            value={row.l4Item?.description || row.level3Cell?.data.description || ''}//{getCellValue(row.l4Item?.id, entityLeafs[2].entityName, entityLeafs[2].siteName)}
            onChange={()=>{}}
          />
        </td>
      ),
    },
    {
      key: 'centrallyGovernedProcess',
      content: (
        <td style={{ width: entityLeafs[3].size, minWidth: entityLeafs[3].size }}>
          <RadioCell
            name={`${row.l4Item?.id}__${entityLeafs[3].entityName}__${entityLeafs[3].siteName}`}
            value={row.l4Item?.centrallyGovernedProcess || row.level3Cell?.data.centrallyGovernedProcess || ''}//{getCellValue(row.l4Item?.id, entityLeafs[3].entityName, entityLeafs[3].siteName)}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            onChange={()=>{}}
          />
        </td>
      ),
    },
    {
      key: 'sharedService',
      content: (
        <td style={{ width: 190 }}>
          {getSharedCellValue(row.l4Item?.sharedService || row.level3Cell?.data.sharedService)}
        </td>
      ),
    },
    {
      key: 'businessUnit',
      content: (
        <td style={{ width: entityLeafs[5].size, minWidth: entityLeafs[5].size }}>
          <EditableCell
            value={row.l4Item?.businessUnit?.join(', ') || row.level3Cell?.data.businessUnit?.join(', ') || ''}
            onChange={()=>{}}
          />
        </td>
      ),
    },
    {
      key: 'ResponsibleDigitalTeam',
      content: (
        <td style={{ width: entityLeafs[6].size, minWidth: entityLeafs[6].size }}>
          <EditableCell
            value={row.l4Item?.ResponsibleDigitalTeam?.join(', ') || row.level3Cell?.data.ResponsibleDigitalTeam?.join(', ') || ''}
            onChange={()=>{}}
          />
        </td>
      ),
    },
    {
      key: 'processCriticality',
      content: (
        <td style={{ width: entityLeafs[7].size, minWidth: entityLeafs[7].size }}>
          <EditableCell
            value={row.l4Item?.processCriticality || row.level3Cell?.data.processCriticality || ''}
            onChange={()=>{}}
          />
        </td>
      ),
    }
  ]

  let lastGroupCompany = ''

console.log('Flat rows:', flatRows)

  return (
    <TableShell>
      <div className="relative w-full overflow-auto">
        <table
          className="w-full caption-bottom border-separate border-spacing-0 text-sm"
          style={{ minWidth: 'max-content' }}
        >
          {/* Columns ─────────────────────────────────────────────────────── */}

          <thead>
            {/* Row 1 — actual column labels with sort icons */}
            <tr>
              {HIERARCHY_COLUMNS.map((col) => (
                <ColHead
                  key={col.id}
                  label={col.label}
                  size={col.size}
                  isSticky
                  leftOffset={stickyOffsets[col.id]}
                  className={col.id === 'level3' ? 'border-r-0 bg-white' : 'bg-white'}
                />
              ))}
              {/* Group Company */}
              <ColHead label="Group Company" size={250} className="bg-white" />

              {/* Site sub-headers */}
              {entityLeafs.map((col) => (
                <ColHead key={col.id} label={col.siteName} size={col.size} className="bg-white" />
              ))}
            </tr>
          </thead>

          {/* ── Body with rowSpan ────────────────────────────────────────── */}
          <TableBody>
            {flatRows.map((row) => {
              const currentGroupCompany = row.level3Cell?.data.groupCompany

              if (currentGroupCompany) {
                lastGroupCompany = currentGroupCompany
              }
           

              return (
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

                  {/* Level 3 — ((pinned col))*/}
                  {row.level3Cell && (
                    <HierarchyTd
                      rowSpan={row.level3Cell.rowSpan}
                      size={HIERARCHY_COLUMNS[3].size}
                      leftOffset={stickyOffsets['level3']}
                      isLast={false}
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

                  {/* ── Level 4 cell ((pinned col))───────────────────────────────── */}
                  <td
                    style={{
                      width: HIERARCHY_COLUMNS[4].size,
                      minWidth: HIERARCHY_COLUMNS[4].size,
                      position: 'sticky',
                      left: stickyOffsets['level4'],
                      zIndex: 10,
                    }}
                    className={cn(
                      'bg-card border-border border-b px-3 py-2 align-top text-sm',
                      'border-r-border/60 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.07)]',
                    )}
                  >
                    <Level4Cell item={row.l4Item} />
                  </td>

                  {/* groupCompany */}
                  <td
                    className="border-r-border/60 border-border border-b px-3 py-2 align-middle"
                    style={{ width: 250, minWidth: 250 }}
                  >
                    <span className="text-muted-foreground text-xs">
                      {row.level3Cell?.data.groupCompany || lastGroupCompany}
                      {/* if there is no data , then bring the last one aded  */}
                    </span>
                  </td>

                  {
                    /* Entity cells — rendered on every row, but with values based on L4 ID + entity/site */
                    entityCells(row).map((cell) => (
                      <React.Fragment key={cell.key}>{cell.content}</React.Fragment>
                    ))
                  }

                  {/*  end  */}
                </tr>
              )
            })}
          </TableBody>
        </table>
      </div>
    </TableShell>
  )
}

export default AssessmentDataTable
