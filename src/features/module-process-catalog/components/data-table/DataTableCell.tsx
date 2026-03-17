import { flexRender } from '@tanstack/react-table'

import { TableCell } from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'

import RowActions from './RowActions'
import type { DataTableCellProps } from './interfaces'

const DataTableCell = <TData, TValue>({
  cell,
  rowData,
  level = 0,
  isFirstCell = false,
  density = 'compact',
  leading,
  actions = [],
}: DataTableCellProps<TData, TValue>) => {
  const startPadding = isFirstCell && level > 0 ? `${level * 1.25 + 0.75}rem` : undefined

  return (
    <TableCell
      style={startPadding ? { paddingInlineStart: startPadding } : undefined}
      className={cn(
        'max-w-0 ps-3 pe-3 align-middle',
        density === 'compact' ? 'py-1.5 text-sm' : 'py-2.5 text-sm',
        'text-foreground'
      )}
    >
      <div className="group/cell flex items-center gap-2 overflow-hidden">
        {leading}
        <span className="truncate">{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
        {actions.length > 0 ? (
          <div className="ms-auto opacity-0 transition-opacity group-hover/cell:opacity-100">
            <RowActions rowData={rowData} actions={actions} />
          </div>
        ) : null}
      </div>
    </TableCell>
  )
}

export default DataTableCell
