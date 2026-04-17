import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Archive, Eye, RefreshCcw, SquareCheckBig, Trash2 } from 'lucide-react'

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
    // L3 group header (has L4 children) — all edits happen at L4 level
    if (row.original.isL3GroupHeader) return []

    // Leaf L3 (no L4 children) — only view details is available
    if (!row.original.level4Code) {
      return [
        {
          id: 'view-details',
          label: 'View details',
          icon: <Eye className="size-5" />,
          onSelect: () => navigate(`/automation-targets/process/${row.original.id}`),
        },
      ]
    }

    // L4 row — full action set
    return [
      {
        id: 'view-details',
        label: 'View details',
        icon: <Eye className="size-5" />,
        onSelect: () => navigate(`/automation-targets/process/${row.original.id}`),
      },
      {
        id: 'switch-to-draft',
        label: 'Switch to Draft version',
        icon: <RefreshCcw className="size-5" />,
        onSelect: () => {},
      },
      {
        id: 'submit',
        label: 'Submit',
        icon: <SquareCheckBig className="size-5" />,
        onSelect: () => {},
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: <Archive className="size-5" />,
        onSelect: () => {},
      },
      {
        id: 'discard',
        label: 'Discard',
        icon: <Trash2 className="size-5" />,
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
      enableColumnDnd={false}
      initialColumnPinning={{ left: ['domain'] }}
      getRowId={(row) => row.id}
      getRowActions={getRowActions}
      actionColumnIds={['level3', 'level4']}
      tableMeta={tableMeta}
    />
  )
}

export default AutomationTargetsTable
