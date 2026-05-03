import { RowActionsDropdown } from '@/shared/components/RowActionsDropdown'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

interface OpportunityNameCellProps {
  id: string
  name: string
  code: string
}

const OpportunityNameCell = ({ id: _id, name, code }: OpportunityNameCellProps) => {
  const actions = useMemo(
    () => [
      { label: 'View Details', icon: Eye, action: () => {} },
      { label: 'Edit', icon: Pencil, action: () => {} },
      { label: 'Delete', icon: Trash2, action: () => {}, destructive: true },
    ],
    [],
  )

  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-foreground truncate text-sm font-medium">{name}</span>
        <span className="text-muted-foreground text-xs">{code}</span>
      </div>
      <RowActionsDropdown actions={actions} />
    </div>
  )
}

export default OpportunityNameCell
