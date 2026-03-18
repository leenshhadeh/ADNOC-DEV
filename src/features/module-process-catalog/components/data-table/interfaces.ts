import type { ColumnDef, Header, Row, Cell } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export interface RowAction<TData> {
  id: string
  label: string
  onSelect: (row: TData) => void
  icon?: ReactNode
  disabled?: boolean
  destructive?: boolean
}

export interface DataTableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>
  enableSorting?: boolean
  enableColumnDnd?: boolean
}

export interface DataTableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>
  rowData: TData
  level?: number
  isFirstCell?: boolean
  density?: 'compact' | 'comfortable'
  leading?: ReactNode
  actions?: RowAction<TData>[]
}

export interface DataTableRowProps<TData> {
  row: Row<TData>
  level: number
  density?: 'compact' | 'comfortable'
  getRowActions?: (row: Row<TData>) => RowAction<TData>[]
}

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  className?: string
  density?: 'compact' | 'comfortable'
  getSubRows?: (row: TData) => TData[] | undefined
  getRowActions?: (row: Row<TData>) => RowAction<TData>[]
}
