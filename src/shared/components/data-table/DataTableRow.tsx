import { Fragment, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { TableRow } from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'

import DataTableCell from './DataTableCell'
import type { DataTableRowProps } from './interfaces'

// DataTableRow is generic — we reach into row.original to detect Draft status.
// The cast to `unknown` keeps the generic TData contract intact.
function isDraftRow<TData>(row: { original: TData }): boolean {
  const orig = row.original as Record<string, unknown>
  return orig['level3Status'] === 'Draft'
}

const DataTableRow = <TData,>({
  row,
  level,
  density = 'compact',
  rowDividers = false,
  getRowActions,
  isHighlighted = false,
}: DataTableRowProps<TData>) => {
  const [expanded, setExpanded] = useState(false)

  const cells = row.getVisibleCells()
  const subRows = row.subRows
  const hasSubRows = subRows.length > 0
  const actions = getRowActions ? getRowActions(row) : []
  const isDraft = isDraftRow(row)
  return (
    <Fragment>
      <TableRow
        data-row-id={row.id}
        className={cn(
          level > 0 && 'border-0 [&>td]:!border-0',
          expanded && hasSubRows && 'border-b-0 [&>td]:!border-b-0',
          row.getIsSelected() ? 'ring-primary/30 bg-orange-50/50 ring-1 ring-inset' : undefined,
          isDraft ? 'bg-blue-50/30' : undefined,
          isHighlighted ? 'ring-primary/60 bg-primary/5 ring-2 ring-inset' : undefined,
        )}
      >
        {cells.map((cell, index) => (
          <DataTableCell
            key={cell.id}
            cell={cell}
            rowData={row.original}
            level={level}
            isFirstCell={index === 0}
            density={density}
            rowDividers={rowDividers}
            actions={actions}
            leading={
              index === 0 && hasSubRows ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setExpanded((current) => !current)}
                  aria-label={expanded ? 'Collapse row' : 'Expand row'}
                >
                  {expanded ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                </Button>
              ) : undefined
            }
          />
        ))}
      </TableRow>

      {expanded && hasSubRows
        ? subRows.map((subRow) => (
            <DataTableRow
              key={subRow.id}
              row={subRow}
              level={level + 1}
              density={density}
              rowDividers={false}
              getRowActions={getRowActions}
            />
          ))
        : null}
    </Fragment>
  )
}

export default DataTableRow
