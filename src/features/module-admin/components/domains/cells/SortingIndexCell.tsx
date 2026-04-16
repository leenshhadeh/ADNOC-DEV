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
  onChange?: (rowId: string, field: 'sortingIndex', value: string) => void
  onEdit?: (row: DomainRow, field: 'businessDomain' | 'code' | 'sortingIndex') => void
}

const SortingIndexCell = ({ row, onChange, onEdit }: Props) => {
  const isEditing = row.isEditing && (row.isNew || row.editingField === 'sortingIndex')

  const handleChange = (value: string) => {
    if (value === '') {
      onChange?.(row.id, 'sortingIndex', '')
      return
    }

    const numericValue = Number(value)

    if (Number.isNaN(numericValue)) return

    onChange?.(row.id, 'sortingIndex', String(Math.max(0, numericValue)))
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            autoFocus
            type="number"
            min={0}
            value={row.sortingIndex}
            onChange={(e) => handleChange(e.target.value)}
            className="h-9 w-full rounded-md border border-[#0047BB] bg-white px-3 text-[16px] font-[500] text-[#151718] ring-2 ring-[#B2DDFF] outline-none"
          />
        ) : (
          <span className="block truncate text-[16px] font-[500] text-[#151718]">
            {row.sortingIndex}
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
            <DropdownMenuItem onClick={() => onEdit?.(row, 'sortingIndex')}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default SortingIndexCell
