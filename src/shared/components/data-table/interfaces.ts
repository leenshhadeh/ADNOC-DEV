import type {
  ColumnDef,
  ColumnPinningState,
  Header,
  Row,
  Cell,
  RowSelectionState,
} from '@tanstack/react-table'
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
  rowDividers?: boolean
  leading?: ReactNode
  actions?: RowAction<TData>[]
}

export interface DataTableRowProps<TData> {
  row: Row<TData>
  level: number
  density?: 'compact' | 'comfortable'
  rowDividers?: boolean
  getRowActions?: (row: Row<TData>) => RowAction<TData>[]
  isHighlighted?: boolean
  /** When provided, the row actions dropdown is only shown inside cells whose column id is in this list. */
  actionColumnIds?: string[]
}

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  className?: string
  density?: 'compact' | 'comfortable'
  getSubRows?: (row: TData) => TData[] | undefined
  getRowActions?: (row: Row<TData>) => RowAction<TData>[]
  /** Column IDs to pin to the left on mount. Enables horizontal scrolling + sticky columns. */
  initialColumnPinning?: ColumnPinningState
  /** Set to false to hide drag handles and disable column reordering. Default: true. */
  enableColumnDnd?: boolean
  /** Set to false to hide sort controls on all columns. Default: true. */
  enableSorting?: boolean
  /** Controlled row selection state for bulk-action mode. */
  rowSelection?: RowSelectionState
  /** Called when the user toggles a row's selection. */
  onRowSelectionChange?: (
    updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => void
  /** Returns a stable string ID for each row. Required when rowSelection is used. */
  getRowId?: (
    row: TData,
  ) => string /** Arbitrary metadata forwarded to table.options.meta (e.g. { isBulkMode }). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableMeta?: Record<string, any>
  /** When provided, the row actions dropdown only appears in cells whose column id is in this list. */
  actionColumnIds?: string[]
  /** Controlled column visibility state. */
  columnVisibility?: Record<string, boolean>
  /** Called when visibility changes via the table internals. */
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void
  /** Controlled column order. When provided, syncs the internal order state. */
  columnOrder?: string[]
  /** Called when the user reorders columns via drag-and-drop in the header. */
  onColumnOrderChange?: (newOrder: string[]) => void
}
