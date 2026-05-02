import { useMemo } from 'react'
import DataTable from '@/shared/components/data-table/DataTable'
import type { RowSelectionState } from '@tanstack/react-table'
import { getOpportunityTableColumns } from './opportunity-table-columns'
import type { Opportunity } from '../../types'

interface OpportunitiesTableProps {
  data: Opportunity[]
  isLoading: boolean
  search: string
  rowSelection: RowSelectionState
  onRowSelectionChange: (
    updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => void
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: (visibility: Record<string, boolean>) => void
  columnOrder: string[]
  onColumnOrderChange: (order: string[]) => void
  isBulkMode: boolean
}

const toSearchableText = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const OpportunitiesTable = ({
  data,
  isLoading,
  search,
  rowSelection,
  onRowSelectionChange,
  columnVisibility,
  onColumnVisibilityChange,
  columnOrder,
  onColumnOrderChange,
  isBulkMode,
}: OpportunitiesTableProps) => {
  const columns = useMemo(() => getOpportunityTableColumns(), [])

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return data
    return data.filter((row) =>
      Object.values(row).some((value) => toSearchableText(value).toLowerCase().includes(query)),
    )
  }, [data, search])

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      isLoading={isLoading}
      initialColumnPinning={{ left: ['name'] }}
      rowSelection={isBulkMode ? rowSelection : undefined}
      onRowSelectionChange={isBulkMode ? onRowSelectionChange : undefined}
      getRowId={(row) => row.id}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      columnOrder={columnOrder.length > 0 ? columnOrder : undefined}
      onColumnOrderChange={onColumnOrderChange}
      actionColumnIds={['name']}
      density="compact"
      enableColumnDnd={false}
    />
  )
}

export default OpportunitiesTable
