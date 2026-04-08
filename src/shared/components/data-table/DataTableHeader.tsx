import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flexRender } from '@tanstack/react-table'
import { GripVertical } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { TableHead } from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'
import FilterIcon from '@/assets/icons/Shape.svg?react'
import ColumnFilter from './ColumnFilter'

import type { DataTableHeaderProps } from './interfaces'

const DataTableHeader = <TData, TValue>({
  header,
  enableSorting = true,
  enableColumnDnd = true,
}: DataTableHeaderProps<TData, TValue>) => {
  const column = header.column
  const isPinned = column.getIsPinned()
  const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left')
  const leftOffset = isPinned === 'left' ? column.getStart('left') : undefined

  // Group headers (colSpan > 1) don't carry a fixed width; their width is the
  // sum of their children's widths and is determined by colSpan rendering.
  const isGroupHeader = header.colSpan > 1
  const colSize = isGroupHeader ? undefined : header.getSize()

  // Empty wrapper groups (grp__domain etc.) have colSpan=1 since each wraps one leaf.
  // Entity groups have colSpan>1 (they wrap multiple site columns).
  // So: colSpan===1 group → silent spacer; colSpan>1 → entity group header.
  const isWrapperGroup = !isGroupHeader && column.columnDef.header === ''
  const isEmptyGroup = header.isPlaceholder || isWrapperGroup

  // Always call hooks unconditionally (React Rules of Hooks).
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    disabled: !enableColumnDnd || isPinned !== false || isGroupHeader,
  })

  const style: React.CSSProperties = {
    ...(colSize !== undefined ? { width: colSize, minWidth: colSize, maxWidth: colSize } : {}),
    ...(isPinned === 'left'
      ? { position: 'sticky', left: leftOffset, zIndex: 20 }
      : { transform: CSS.Transform.toString(transform), transition }),
      ...(column.columnDef?.meta?.pinnedCol ? { position: 'sticky', left: column.columnDef?.meta?.offset || 0, zIndex: 100 ,backgroundColor:'#F1F3F5'} : {}),

  }

  const headClassName = cn(
    'sticky top-0 border-b border-border',
    isPinned === 'left'
      ? 'z-20 bg-[#F1F3F5]'
      : 'z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-[#F1F3F5]',
    isLastLeftPinned && 'border-r-2 border-r-border/60 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.07)]',
    // Divider on the right of the Shared Service wrapper group (separates flat from matrix).
    !!(column.columnDef.meta as { isDivider?: boolean } | undefined)?.isDivider &&
      'border-r-2 border-r-border/60',
    isDragging && 'opacity-80',
  )

  // ── 1. Silent spacer — empty wrapper group cells (depth 0 for flat columns) ─
  if (isEmptyGroup) {
    return (
      <TableHead
        colSpan={header.colSpan > 1 ? header.colSpan : undefined}
        style={style}
        className={cn(headClassName, 'h-8 py-0')}
      />
    )
  }

  // ── 2. Entity group header (depth 0, colSpan > 1, has entity name) ──────────
  if (isGroupHeader) {
    return (
      <TableHead
        colSpan={header.colSpan}
        style={style}
        className={cn(
          headClassName,
          'border-border/60 h-8 border-b py-1 text-center text-xs font-semibold tracking-wide uppercase',
        )}
      >
        <div className="flex items-center justify-center gap-1 px-2">
          <span className="truncate">
            {flexRender(column.columnDef.header, header.getContext())}
          </span>
        </div>
      </TableHead>
    )
  }

  // ── 3. Leaf column header (depth 1 for all) — column name + optional sort ───
  const isMultiline = !!(column.columnDef.meta as { multiline?: boolean } | undefined)?.multiline

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn(
        headClassName,
        isMultiline ? 'py-1' : 'h-8 py-1',
        !!(column.columnDef.meta as { isDivider?: boolean } | undefined)?.isDivider &&
          'border-r-border/60 border-r-2',
      )}
    >
      <div className="flex items-center">
        {enableColumnDnd && isPinned === false && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Reorder ${column.id} column`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-3.5" />
          </Button>
        )}
        {isMultiline ? (
          <div className="text-muted-foreground w-full px-1.5 text-center text-xs leading-4 font-medium tracking-wide whitespace-normal uppercase">
            {flexRender(column.columnDef.header, header.getContext())}
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'px-1.5 text-xs font-normal tracking-wide uppercase',
              isMultiline ? 'h-auto min-h-7 whitespace-normal' : 'h-7',
            )}
            onClick={
              enableSorting && column.getCanSort() ? column.getToggleSortingHandler() : undefined
            }
            aria-label={enableSorting && column.getCanSort() ? `Sort by ${column.id}` : undefined}
          >
            <span
              className={isMultiline ? 'text-center leading-4 whitespace-normal' : 'truncate pr-1'}
            >
              {flexRender(column.columnDef.header, header.getContext())}
            </span>
            {column.getCanFilter() ? (
              <ColumnFilter column={column} />
            ) : (
              <FilterIcon className="size-3.5 opacity-70" />
            )}
          </Button>
        )}
      </div>
    </TableHead>
  )
}

export default DataTableHeader
