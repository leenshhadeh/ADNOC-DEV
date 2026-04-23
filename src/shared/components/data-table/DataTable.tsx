import { useEffect, useMemo, useState } from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type Row,
  type SortingState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/shared/components/ui/table'
import { TableShell } from '@/shared/components/table-primitives'

import DataTableHeader from './DataTableHeader'
import DataTableRow from './DataTableRow'
import type { DataTableProps } from './interfaces'
import LoadingTable from './LoadingTable'

/** Recursively collect leaf column IDs so columnOrder only contains sortable leaves. */
function getLeafColumnIds<TData>(cols: ColumnDef<TData, unknown>[], offset = 0): string[] {
  return cols.flatMap((col, i) => {
    const subCols = (col as { columns?: ColumnDef<TData, unknown>[] }).columns
    if (subCols?.length) return getLeafColumnIds(subCols, offset + i)
    if (col.id) return [col.id]
    const ak = (col as { accessorKey?: string }).accessorKey
    if (typeof ak === 'string') return [ak]
    return [`column_${offset + i}`]
  })
}

const DataTable = <TData,>({
  data,
  columns,
  className,
  density = 'compact',
  getSubRows,
  getRowActions,
  initialColumnPinning,
  enableColumnDnd = true,
  enableSorting = true,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  tableMeta,
  actionColumnIds,
  columnVisibility,
  onColumnVisibilityChange,
  columnOrder: columnOrderProp,
  onColumnOrderChange,
  isLoading,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialColumnPinning ?? {})
  const [selectedCellIds, setSelectedCellIds] = useState<Set<string>>(new Set())

  const handleCellSelect = (cellId: string) => {
    setSelectedCellIds((prev) => {
      const next = new Set(prev)
      if (next.has(cellId)) {
        next.delete(cellId)
      } else {
        next.add(cellId)
      }
      return next
    })
  }

  const initialColumnOrder = useMemo(() => getLeafColumnIds(columns), [columns])
  const [columnOrder, setColumnOrder] = useState(initialColumnOrder)

  useEffect(() => {
    setColumnOrder(initialColumnOrder)
  }, [initialColumnOrder])

  // Sync externally controlled column order into internal state
  useEffect(() => {
    if (columnOrderProp && columnOrderProp.length > 0) {
      setColumnOrder(columnOrderProp)
    }
  }, [columnOrderProp])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const table = useReactTable({
    data,
    columns,
    meta: tableMeta,
    defaultColumn: { size: 250, minSize: 50 },
    state: {
      sorting,
      columnFilters,
      columnOrder,
      columnPinning,
      ...(rowSelection !== undefined ? { rowSelection } : {}),
      ...(columnVisibility !== undefined ? { columnVisibility } : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    ...(onRowSelectionChange
      ? {
          onRowSelectionChange: (updater) => {
            onRowSelectionChange(
              typeof updater === 'function' ? updater(rowSelection ?? {}) : updater,
            )
          },
        }
      : {}),
    ...(onColumnVisibilityChange
      ? {
          onColumnVisibilityChange: (updater: Updater<VisibilityState>) => {
            const next = typeof updater === 'function' ? updater(columnVisibility ?? {}) : updater
            onColumnVisibilityChange(next)
          },
        }
      : {}),
    enableColumnPinning: true,
    enableRowSelection: rowSelection !== undefined,
    getRowId,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  })

  const hasPinnedLeft = (columnPinning.left?.length ?? 0) > 0

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setColumnOrder((currentOrder) => {
      const oldIndex = currentOrder.indexOf(String(active.id))
      const newIndex = currentOrder.indexOf(String(over.id))
      if (oldIndex < 0 || newIndex < 0) return currentOrder
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex)
      onColumnOrderChange?.(newOrder)
      return newOrder
    })
  }

  if (isLoading) return <LoadingTable />

  return (
    <TableShell className={className}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Table
          className="border-separate border-spacing-0"
          style={hasPinnedLeft ? { minWidth: 'max-content' } : undefined}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <SortableContext
                key={headerGroup.id}
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                <TableRow key={headerGroup.id} className="border-0 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <DataTableHeader
                      key={header.id}
                      header={header}
                      enableSorting={enableSorting}
                      enableColumnDnd={enableColumnDnd}
                    />
                  ))}
                </TableRow>
              </SortableContext>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table
                .getRowModel()
                .rows.map((row: Row<TData>) => (
                  <DataTableRow
                    key={row.id}
                    row={row}
                    level={0}
                    density={density}
                    rowDividers={!!tableMeta?.rowDividers}
                    getRowActions={getRowActions}
                    isHighlighted={row.id === (tableMeta?.highlightedRowId ?? null)}
                    actionColumnIds={actionColumnIds}
                    selectedCellIds={selectedCellIds}
                    onCellSelect={handleCellSelect}
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
    </TableShell>
  )
}

export default DataTable
