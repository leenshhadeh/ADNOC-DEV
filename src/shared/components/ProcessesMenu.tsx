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

export type ProcessViewOption = 'Published processes' | 'Latest processes' | 'Archived processes'

export const PROCESS_VIEW_OPTIONS: ProcessViewOption[] = [
  'Published processes',
  'Latest processes',
  'Archived processes',
]

interface ProcessesMenuProps {
  options?: ProcessViewOption[]
  /** Controlled selected value. Falls back to internal state when omitted. */
  value?: ProcessViewOption
  onChange?: (value: ProcessViewOption) => void
}

const ProcessesMenu = ({ options = PROCESS_VIEW_OPTIONS, value, onChange }: ProcessesMenuProps) => {
  const [internal, setInternal] = useState<ProcessViewOption>('Published processes')

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
            'bg-transparent text-[#0047BA] hover:bg-transparent',
            'shadow-none outline-none',
          )}
        >
          {selected}
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
          const isSelected = selected === option
          return (
            <DropdownMenuItem
              key={option}
              onClick={() => handleSelect(option)}
              className={cn(
                'flex justify-between rounded-none px-4 text-[15px] text-[#1F2430]',
                'focus:text-[#1F2430]',
                isSelected ? 'bg-[#DCE5F9] focus:bg-[#DCE4F5]' : 'bg-[#F1F3F5] focus:bg-[#ECEFF2]',
                index !== options.length - 1 && 'border-b border-[#D9DEE3]',
              )}
            >
              <span>{option}</span>
              {isSelected && <Check className="size-4 text-[#0047BA]" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProcessesMenu
