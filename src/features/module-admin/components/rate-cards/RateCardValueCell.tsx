import { MoreHorizontal, Pencil } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

type Props = {
  rowId: string
  value: number | string
  isEditing?: boolean
  isBulkEditMode?: boolean
  onChange?: (rowId: string, value: string) => void
  onEdit?: (rowId: string) => void
}

const RateCardValueCell = ({
  rowId,
  value,
  isEditing = false,
  isBulkEditMode = false,
  onChange,
  onEdit,
}: Props) => {
  if (isEditing) {
    return (
      <input
        autoFocus
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          const nextValue = e.target.value

          if (nextValue === '') {
            onChange?.(rowId, '')
            return
          }

          const numericValue = Number(nextValue)

          if (Number.isNaN(numericValue)) return

          onChange?.(rowId, String(Math.max(0, numericValue)))
        }}
        className="w-full border-0 bg-transparent text-[16px] font-[500] text-[#151718] outline-none"
      />
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="block truncate text-[16px] font-[500] text-[#151718]">{value}</span>

      {!isBulkEditMode && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44 rounded-xl p-1">
            <DropdownMenuItem
              onClick={() => onEdit?.(rowId)}
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

export default RateCardValueCell
