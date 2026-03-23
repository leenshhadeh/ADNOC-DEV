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

  const isPinned = cell.column.getIsPinned()
  const isLastLeftPinned = isPinned === 'left' && cell.column.getIsLastColumn('left')
  const leftOffset = isPinned === 'left' ? cell.column.getStart('left') : undefined
  const colSize = cell.column.getSize()
  const isDivider = !!(cell.column.columnDef.meta as { isDivider?: boolean } | undefined)?.isDivider

  const cellStyle: React.CSSProperties = {
    width: colSize,
    minWidth: colSize,
    maxWidth: colSize,
    ...(isPinned === 'left' ? { position: 'sticky', left: leftOffset, zIndex: 10 } : {}),
    ...(startPadding ? { paddingInlineStart: startPadding } : {}),
  }

  return (
    <TableCell
      style={cellStyle}
      className={cn(
        'ps-3 pe-3 align-middle overflow-hidden',
        density === 'compact' ? 'py-1.5 text-sm' : 'py-2.5 text-sm',
        'text-foreground',
        isPinned === 'left' && 'bg-card',
        isLastLeftPinned && 'border-r-2 border-r-border/60 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.07)]',
        isDivider && 'border-r-2 border-r-border/60',
      )}
    >
      <div className="group/cell flex items-center gap-2 overflow-hidden">
        {leading}
        {/* Flexible wrapper — lets cell renderers flow naturally (multi-line, custom layouts) */}
        <div className="min-w-0 flex-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
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
