import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import type { DomainRow } from '../types'

type Props = {
  row: DomainRow
  onChange?: (rowId: string, field: 'code', value: string) => void
  onEdit?: (row: DomainRow, field: 'businessDomain' | 'code' | 'sortingIndex') => void
}

const DomainCodeCell = ({ row, onChange, onEdit }: Props) => {
  const isEditing = row.isEditing && (row.isNew || row.editingField === 'code')

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            autoFocus
            value={row.code}
            onChange={(e) => onChange?.(row.id, 'code', e.target.value)}
            className="h-9 w-full rounded-md border border-[#0047BB] bg-white px-3 text-[16px] font-[500] text-[#151718] ring-2 ring-[#B2DDFF] outline-none"
          />
        ) : (
          <span className="block truncate text-[16px] font-[500] text-[#151718]">{row.code}</span>
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
            <DropdownMenuItem onClick={() => onEdit?.(row, 'code')}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default DomainCodeCell
