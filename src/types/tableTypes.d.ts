import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  export interface ColumnMeta<TData extends RowData, TValue> {
    pinnedCol?: boolean
    offset?: number
    isDivider?: any
    filterByFirstChar?: any
    fixedFilterOptions?: any[]
    isEntityGroup?: boolean
  }
}
