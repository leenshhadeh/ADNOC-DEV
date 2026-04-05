import type { LucideProps } from 'lucide-react'
import { Search } from 'lucide-react'

import { Button } from '../../../shared/components/ui/button'
import { Input } from '../../../shared/components/ui/input'
import { Separator } from '../../../shared/components/ui/separator'

export interface AdminToolbarAction {
  id: string
  label: string
  icon: React.ComponentType<LucideProps>
  onClick?: () => void
  disabled?: boolean
}

export interface AdminToolbarProps {
  title: string

  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showSearch?: boolean

  actions?: AdminToolbarAction[]
}

const AdminToolbar = ({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search',
  showSearch = true,
  actions = [],
}: AdminToolbarProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[16px] text-[#4A5565]">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {showSearch && (
            <div className="relative w-full sm:max-w-[435px]">
              <Search className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="h-11 rounded-[10px] ps-9 pe-3"
              />
            </div>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex shrink-0 items-center">
            {actions.map((action, index) => (
              <div key={action.id} className="flex items-center">
                {index > 0 && <Separator orientation="vertical" className="h-8!" />}
                <Button
                  type="button"
                  className="h-9 cursor-pointer bg-transparent px-3 text-[#0047BA]"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  aria-label={action.label}
                >
                  <action.icon className="size-4" />
                  <span className="hidden sm:inline">{action.label}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminToolbar
