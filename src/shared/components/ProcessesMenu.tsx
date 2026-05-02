import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'

export type ProcessViewOptionId = 'published' | 'latest' | 'archived'

export interface ProcessViewOption {
  id: ProcessViewOptionId
  name: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const PROCESS_VIEW_OPTIONS: ProcessViewOption[] = [
  { id: 'published', name: 'Published processes' },
  { id: 'latest', name: 'Latest processes' },
  { id: 'archived', name: 'Archived processes' },
]

interface ProcessesMenuProps {
  options?: ProcessViewOption[]
  /** Controlled selected value. Falls back to internal state when omitted. */
  value?: ProcessViewOption
  onChange?: (value: ProcessViewOption) => void
}

const ProcessesMenu = ({ options = PROCESS_VIEW_OPTIONS, value, onChange }: ProcessesMenuProps) => {
  const [internal, setInternal] = useState<ProcessViewOption>(PROCESS_VIEW_OPTIONS[0])

  const selected = value ?? internal
  const handleSelect = (opt: ProcessViewOption) => {
    if (!value) setInternal(opt)
    onChange?.(opt)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'inline-flex items-center gap-1.5',
            'text-brand-blue bg-transparent hover:bg-transparent',
            'shadow-none outline-none',
          )}
        >
          {selected.name}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="w-64 overflow-hidden rounded-xl border p-0 shadow-md"
      >
        <div className="bg-[#F1F8FF] px-3 py-2 text-[13px] font-medium text-[#687076] uppercase">
          Switch view to
        </div>
        {options.map((option, index) => {
          const isSelected = selected.id === option.id
          return (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleSelect(option)}
              className={cn(
                'flex justify-between rounded-none px-4 text-[15px] text-[#1F2430]',
                'focus:text-[#1F2430]',
                isSelected ? 'bg-[#DCE5F9] focus:bg-[#DCE4F5]' : 'bg-accent focus:bg-[#ECEFF2]',
                index !== options.length - 1 && 'border-b border-[#D9DEE3]',
              )}
            >
              <span>{option.name}</span>
              {isSelected && <Check className="text-brand-blue size-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProcessesMenu
