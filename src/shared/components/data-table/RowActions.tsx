import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
      <DropdownMenuContent align="end" className="min-w-48 rounded-2xl">
        {actions.map(action => (
          <DropdownMenuItem
            key={action.id}
            onSelect={() => action.onSelect(rowData)}
            disabled={action.disabled}
            variant={action.destructive ? 'destructive' : 'default'}
          >
            {action.icon}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RowActions
