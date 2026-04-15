import { useNavigate } from 'react-router-dom'
import type { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import DataTable from '@/shared/components/data-table/DataTable'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import type { RowAction } from '@/shared/components/data-table/interfaces'
import type { AutomationTargetRow } from '../../types'
import { automationTargetColumns } from '../../constants/automation-columns'

interface AutomationTargetsTableProps {
  data: AutomationTargetRow[]
  onSmeFeedbackClick: (row: AutomationTargetRow) => void
}

const AutomationTargetsTable = ({ data, onSmeFeedbackClick }: AutomationTargetsTableProps) => {
  const navigate = useNavigate()

  const getRowActions = (row: Row<AutomationTargetRow>): RowAction<AutomationTargetRow>[] => [
    {
      id: 'view-details',
      label: 'View Details',
      onSelect: () => navigate(`/automation-targets/process/${row.original.id}`),
    },
    {
      id: 'sme-feedback',
      label: 'Add SME Feedback',
      onSelect: () => onSmeFeedbackClick(row.original),
    },
    {
      id: 'submit',
      label: 'Submit',
      onSelect: () => {},
    },
  ]

  return (
    <DataTable
      data={data}
      columns={automationTargetColumns}
      density="compact"
      enableSorting
      enableColumnDnd
      initialColumnPinning={{ left: ['domain'] }}
      getRowId={(row) => row.id}
      getRowActions={getRowActions}
    />
  )
}

export default AutomationTargetsTable
