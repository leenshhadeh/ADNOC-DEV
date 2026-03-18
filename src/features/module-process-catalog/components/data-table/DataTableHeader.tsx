import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flexRender } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { TableHead } from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'

import type { DataTableHeaderProps } from './interfaces'

const DataTableHeader = <TData, TValue>({
  header,
  enableSorting = true,
  enableColumnDnd = true,
}: DataTableHeaderProps<TData, TValue>) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.column.id,
    disabled: !enableColumnDnd || header.isPlaceholder,
  })

  const sortedState = header.column.getIsSorted()

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableHead
      ref={setNodeRef}
      style={dragStyle}
      className={cn(
        'sticky top-0 z-10 border-b border-border bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        isDragging && 'opacity-80'
      )}
    >
      {header.isPlaceholder ? null : (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-1.5 text-xs font-semibold uppercase tracking-wide"
            onClick={enableSorting ? header.column.getToggleSortingHandler() : undefined}
            aria-label={enableSorting ? `Sort by ${header.column.id}` : undefined}
          >
            <span className="truncate">{flexRender(header.column.columnDef.header, header.getContext())}</span>
            {enableSorting && sortedState === 'asc' && <ArrowUp className="size-3.5" />}
            {enableSorting && sortedState === 'desc' && <ArrowDown className="size-3.5" />}
            {enableSorting && !sortedState && <ArrowUpDown className="size-3.5 opacity-70" />}
          </Button>

          {enableColumnDnd && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Reorder ${header.column.id} column`}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </TableHead>
  )
}

export default DataTableHeader
