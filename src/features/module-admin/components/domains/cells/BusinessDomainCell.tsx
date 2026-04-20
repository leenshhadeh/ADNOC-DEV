import { Archive, MoreHorizontal, Pencil, RotateCcw } from 'lucide-react'
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
  onChange?: (rowId: string, field: 'businessDomain', value: string) => void
  onFocusField?: (rowId: string, field: 'businessDomain') => void
  onEdit?: (row: DomainRow, field: 'businessDomain' | 'code' | 'sortingIndex') => void
  onArchive?: (row: DomainRow) => void
  onActivate?: (row: DomainRow) => void
}

const BusinessDomainCell = ({ row, onChange, onFocusField, onEdit, onArchive, onActivate }: Props) => {
  const isArchived = row.status === 'Archived'
  const isInlineEditable = row.isNew && row.isEditing
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        {isInlineEditable ? (
          <input
            autoFocus={row.editingField === 'businessDomain'}
            value={row.businessDomain}
            onFocus={() => onFocusField?.(row.id, 'businessDomain')}
            onChange={(e) => onChange?.(row.id, 'businessDomain', e.target.value)}
            className="h-9 w-full rounded-md border border-[#0047BB] bg-white px-3 text-[16px] font-[500] text-[#151718] ring-2 ring-[#B2DDFF] outline-none"
          />
        ) : (
          <span className="block truncate text-[16px] font-[500] text-[#151718]">
            {row.businessDomain}
          </span>
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
              onClick={() => onEdit?.(row, 'businessDomain')}
              className="flex cursor-pointer items-center gap-2 rounded-lg text-[#151718] data-[highlighted]:bg-[#DCE5F9] data-[highlighted]:text-[#151718]"
            >
              <Pencil className="h-4 w-4 text-[#151718]" />
              <span>Rename</span>
            </DropdownMenuItem>
            {isArchived ? (
              <DropdownMenuItem
                onClick={() => onActivate?.(row)}
                className="flex cursor-pointer items-center gap-2 rounded-lg text-green-600 data-[highlighted]:bg-[#DCE5F9] data-[highlighted]:text-green-600"
              >
                <RotateCcw className="h-4 w-4 text-green-600" />
                <span>Activate</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onArchive?.(row)}
                className="flex cursor-pointer items-center gap-2 rounded-lg text-red-600 data-[highlighted]:bg-[#DCE5F9] data-[highlighted]:text-red-600"
              >
                <Archive className="h-4 w-4 text-red-600" />
                <span>Archive</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default BusinessDomainCell
