import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import type { Level4Row } from '../../types'

interface Level4CellProps {
  item: Level4Row | null
}

/**
 * Renders an individual Level 4 process item (title + code + action menu),
 * or a "No Level 4 processes" placeholder when item is null.
 */
const Level4Cell = ({ item }: Level4CellProps) => {
  if (!item) {
    return (
      <span className="text-sm italic text-muted-foreground">No Level 4 processes</span>
    )
  }

  return (
    <div className="group/l4 flex w-full items-center gap-2">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground leading-tight">
          {item.level4Name}
        </span>
        <span className="text-xs text-muted-foreground">{item.level4Code}</span>
      </div>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="shrink-0 opacity-0 transition-opacity group-hover/l4:opacity-100 text-muted-foreground"
            aria-label={`Actions for ${item.level4Name}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={4} className="w-44 overflow-hidden rounded-xl border p-0 shadow-md">
          <DropdownMenuItem className="rounded-none px-3 py-2 text-sm">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-none px-3 py-2 text-sm">
            Add sub-process
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-none px-3 py-2 text-sm text-destructive focus:text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Level4Cell
