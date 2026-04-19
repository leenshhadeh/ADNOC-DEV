import { MoreHorizontal, Pencil } from 'lucide-react'
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
  onFocusField?: (rowId: string, field: 'code') => void
  onEdit?: (row: DomainRow, field: 'businessDomain' | 'code' | 'sortingIndex') => void
}

const DomainCodeCell = ({ row, onChange, onFocusField, onEdit }: Props) => {
  const isInlineEditable = row.isNew && row.isEditing

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        {isInlineEditable ? (
          <input
            autoFocus={row.editingField === 'code'}
            value={row.code}
            onFocus={() => onFocusField?.(row.id, 'code')}
            onChange={(e) => onChange?.(row.id, 'code', e.target.value.toUpperCase())}
            className="h-9 w-full rounded-md border border-[#0047BB] bg-white px-3 text-[16px] font-[500] text-[#151718] ring-2 ring-[#B2DDFF] outline-none"
          />
        ) : (
          <span className="block truncate text-[16px] font-[500] text-[#151718]">{row.code}</span>
        )}
      </div>

      {!isInlineEditable && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44 rounded-xl p-1">
            <DropdownMenuItem
              onClick={() => onEdit?.(row, 'code')}
              className="flex cursor-pointer items-center gap-2 rounded-lg text-[#151718] data-[highlighted]:bg-[#DCE5F9] data-[highlighted]:text-[#151718]"
            >
              <Pencil className="h-4 w-4 text-[#151718]" />
              <span>Rename</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default DomainCodeCell
