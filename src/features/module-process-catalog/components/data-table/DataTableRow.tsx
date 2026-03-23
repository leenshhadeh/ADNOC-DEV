import { Fragment, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { TableRow } from '@/shared/components/ui/table'

import DataTableCell from './DataTableCell'
import type { DataTableRowProps } from './interfaces'

const DataTableRow = <TData,>({
  row,
  level,
  density = 'compact',
  getRowActions,
}: DataTableRowProps<TData>) => {
  const [expanded, setExpanded] = useState(true)

  const cells = row.getVisibleCells()
  const subRows = row.subRows
  const hasSubRows = subRows.length > 0
  const actions = getRowActions ? getRowActions(row) : []

  return (
    <Fragment>
      <TableRow className={row.getIsSelected() ? 'bg-orange-50/50 ring-1 ring-inset ring-primary/30' : undefined}>
        {cells.map((cell, index) => (
          <DataTableCell
            key={cell.id}
            cell={cell}
            rowData={row.original}
            level={level}
            isFirstCell={index === 0}
            density={density}
            actions={actions}
            leading={
              index === 0 && hasSubRows ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setExpanded(current => !current)}
                  aria-label={expanded ? 'Collapse row' : 'Expand row'}
                >
                  {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                </Button>
              ) : undefined
            }
          />
        ))}
      </TableRow>

      {expanded && hasSubRows
        ? subRows.map(subRow => (
            <DataTableRow
              key={subRow.id}
              row={subRow}
              level={level + 1}
              density={density}
              getRowActions={getRowActions}
            />
          ))
        : null}
    </Fragment>
  )
}

export default DataTableRow
