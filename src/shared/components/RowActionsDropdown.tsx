import type { LucideIcon } from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export interface RowAction {
  label: string
  icon: LucideIcon
  action: () => void
  destructive?: boolean
}

interface RowActionsDropdownProps {
  actions: RowAction[]
  triggerClassName?: string
}

export function RowActionsDropdown({ actions, triggerClassName }: RowActionsDropdownProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className={triggerClassName ?? 'text-muted-foreground shrink-0'}
          aria-label="Row actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-56 overflow-hidden rounded-2xl border p-0 shadow-lg"
      >
        {actions.map((item, index) => (
          <DropdownMenuItem
            key={item.label}
            onSelect={item.action}
            className={[
              'flex items-center gap-3 rounded-none px-4 py-2.5 text-sm font-normal transition-colors',
              index < actions.length - 1 ? 'border-border border-b' : '',
              item.destructive ? 'text-destructive focus:text-destructive' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
