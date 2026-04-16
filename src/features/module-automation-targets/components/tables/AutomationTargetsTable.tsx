import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef, Row } from '@tanstack/react-table'

import DataTable from '@/shared/components/data-table/DataTable'

import type { RowAction } from '@/shared/components/data-table/interfaces'
import type { AutomationTargetRow } from '../../types'
import { automationTargetColumns } from '../../constants/automation-columns'

interface AutomationTargetsTableProps {
  data: AutomationTargetRow[]
  onSmeFeedbackClick: (row: AutomationTargetRow) => void
}

const AutomationTargetsTable = ({ data, onSmeFeedbackClick }: AutomationTargetsTableProps) => {
  const navigate = useNavigate()

  // ── Local editable state ────────────────────────────────────────────────
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({})

  const handleCellChange = useCallback((rowId: string, field: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value },
    }))
  }, [])

  /** Merge local edits into the data so the table reflects changes. */
  const mergedData = useMemo(
    () =>
      data.map((row) => {
        const patch = edits[row.id]
        return patch ? { ...row, ...patch } : row
      }),
    [data, edits],
  )

  const tableMeta = useMemo(
    () => ({ onCellChange: handleCellChange, onSmeFeedbackClick }),
    [handleCellChange, onSmeFeedbackClick],
  )

  // ── Row actions ─────────────────────────────────────────────────────────
  const getRowActions = (row: Row<AutomationTargetRow>): RowAction<AutomationTargetRow>[] => {
    if (row.original.isL3GroupHeader) return []
    return [
      {
        id: 'view-details',
        label: 'View Details',
        onSelect: () => navigate(`/automation-targets/process/${row.original.id}`),
      },
      {
        id: 'submit',
        label: 'Submit',
        onSelect: () => {},
      },
      {
        id: 'discard-draft',
        label: 'Discard Draft',
        onSelect: () => {},
        destructive: true,
      },
    ]
  }

  return (
    <DataTable
      data={mergedData}
      columns={automationTargetColumns as ColumnDef<AutomationTargetRow, unknown>[]}
      density="compact"
      enableSorting
      enableColumnDnd
      initialColumnPinning={{ left: ['domain'] }}
      getRowId={(row) => row.id}
      getRowActions={getRowActions}
      actionColumnIds={['level3', 'level4']}
      tableMeta={tableMeta}
    />
  )
}

export default AutomationTargetsTable
