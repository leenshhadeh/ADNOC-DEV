import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import type { GroupCompanyRow } from '../types'

type Props = {
  row: GroupCompanyRow
  onChange?: (rowId: string, field: 'groupCompany', value: string) => void
  onEdit?: (row: GroupCompanyRow, field: 'groupCompany' | 'code') => void
  onArchive?: (row: GroupCompanyRow) => void
}

const GroupCompanyNameCell = ({ row, onChange, onEdit, onArchive }: Props) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        {row.isEditing && (row.editingField === 'groupCompany' || row.editingField === null) ? (
          <input
            autoFocus
            value={row.groupCompany}
            onChange={(e) => onChange?.(row.id, 'groupCompany', e.target.value)}
            className="h-9 w-full rounded-md border border-[#0047BB] bg-white px-3 text-[16px] font-[500] text-[#151718] ring-2 ring-[#B2DDFF] outline-none"
          />
        ) : (
          <span className="block truncate text-[16px] font-[500] text-[#151718]">
            {row.groupCompany}
          </span>
        )}
      </div>

      {!row.isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(row, 'groupCompany')}>Edit</DropdownMenuItem>
            {row.status !== 'Archived' && (
              <DropdownMenuItem onClick={() => onArchive?.(row)}>Archive</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default GroupCompanyNameCell
