import { useEffect, useMemo, useState } from 'react'
import { closestCenter, DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type SortingState,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/shared/components/ui/table'
import { cn } from '@/shared/lib/utils'

import DataTableHeader from './DataTableHeader'
import DataTableRow from './DataTableRow'
import type { DataTableProps } from './interfaces'

const getColumnDefId = <TData,>(column: ColumnDef<TData, unknown>, index: number): string => {
  if (column.id) {
    return column.id
  }

  const accessorKey = (column as { accessorKey?: string }).accessorKey

  if (typeof accessorKey === 'string') {
    return accessorKey
  }

  return `column_${index}`
}

const DataTable = <TData,>({
  data,
  columns,
  className,
  density = 'compact',
  getSubRows,
  getRowActions,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const initialColumnOrder = useMemo(() => columns.map(getColumnDefId), [columns])
  const [columnOrder, setColumnOrder] = useState(initialColumnOrder)

  useEffect(() => {
    setColumnOrder(initialColumnOrder)
  }, [initialColumnOrder])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setColumnOrder(currentOrder => {
      const oldIndex = currentOrder.indexOf(String(active.id))
      const newIndex = currentOrder.indexOf(String(over.id))

      if (oldIndex < 0 || newIndex < 0) {
        return currentOrder
      }

      return arrayMove(currentOrder, oldIndex, newIndex)
    })
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-card', className)}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <SortableContext key={headerGroup.id} items={columnOrder} strategy={horizontalListSortingStrategy}>
                <TableRow key={headerGroup.id} className="border-0 hover:bg-transparent">
                  {headerGroup.headers.map(header => (
                    <DataTableHeader key={header.id} header={header} enableSorting enableColumnDnd />
                  ))}
                </TableRow>
              </SortableContext>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row: Row<TData>) => (
                <DataTableRow
                  key={row.id}
                  row={row}
                  level={0}
                  density={density}
                  getRowActions={getRowActions}
                />
              ))
            ) : (
              <TableRow>
                <TableCell className="h-14 text-center" colSpan={columns.length}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}

export default DataTable
