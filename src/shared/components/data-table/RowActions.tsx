import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

import type { RowAction } from './interfaces'

interface RowActionsProps<TData> {
  rowData: TData
  actions: RowAction<TData>[]
}

const RowActions = <TData,>({ rowData, actions }: RowActionsProps<TData>) => {
  if (actions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Open row actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-56 rounded-2xl bg-[#F1F3F5] p-0 shadow-[0px_10px_30px_rgba(0,0,0,0.2)]"
      >
        {actions.map((action, index) => (
          <div key={action.id}>
            <DropdownMenuItem
              onSelect={() => action.onSelect(rowData)}
              disabled={action.disabled}
              variant={action.destructive ? 'destructive' : 'default'}
              className="gap-4 rounded-none px-4 py-2 text-base"
            >
              {action.icon}
              <span>{action.label}</span>
            </DropdownMenuItem>
            {index < actions.length - 1 && (
              <DropdownMenuSeparator className="mx-0 my-0 bg-[#DFE3E6]" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RowActions
