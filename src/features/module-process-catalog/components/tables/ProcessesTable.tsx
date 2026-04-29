import type { RefObject } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/shared/components/data-table/DataTable'
import ProcessBulkActionBar, { type ProcessBulkAction } from '../ProcessBulkActionBar'
import type { ProcessItem } from '@features/module-process-catalog/types'

interface ProcessesTableProps {
  tableContainerRef: RefObject<HTMLDivElement | null>
  isBulkMode: boolean
  selectedCount: number
  onBulkAction: (action: ProcessBulkAction) => void
  onCancelBulkMode: () => void
  columns: ColumnDef<ProcessItem>[]
  data: ProcessItem[]
  rowSelection: RowSelectionState
  onRowSelectionChange: (
    updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => void
  isFullReport: boolean
  onUpdateDraftRow: (
    id: string,
    field: 'level1Name' | 'level2Name' | 'level3Name' | 'description',
    value: string,
  ) => void
  firstDraftRowId: string | undefined
  highlightedRowId: string | undefined
  draftValidationErrors: Record<string, string[]>
}

const ProcessesTable = ({
  tableContainerRef,
  isBulkMode,
  selectedCount,
  onBulkAction,
  onCancelBulkMode,
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
  isFullReport,
  onUpdateDraftRow,
  firstDraftRowId,
  highlightedRowId,
  draftValidationErrors,
}: ProcessesTableProps) => {
  return (
    <div ref={tableContainerRef} className="overflow-auto">
      {isBulkMode && selectedCount > 0 && (
        <ProcessBulkActionBar
          selectedCount={selectedCount}
          onAction={onBulkAction}
          onCancel={onCancelBulkMode}
        />
      )}
      <DataTable
        columns={columns}
        data={data}
        className="table-accent"
        density="compact"
        enableColumnDnd={false}
        enableSorting={false}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        getRowId={(row) => row.id}
        tableMeta={{
          isBulkMode,
          isFullReport,
          rowDividers: true,
          onUpdateDraftRow,
          firstDraftRowId,
          highlightedRowId,
          draftValidationErrors,
        }}
      />
    </div>
  )
}

export default ProcessesTable
