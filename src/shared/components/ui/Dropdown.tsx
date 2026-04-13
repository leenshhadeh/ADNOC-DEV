import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'

export interface Item {
  value: string
  label: string
}
interface DropdownProps {
  defaultValue: string
  onValueChange?: (value: string) => void
  options?: Item[]
  className?: string
  activeTab?: string
}

const Dropdown = (props: DropdownProps) => {
  const { defaultValue, onValueChange, options = [], activeTab } = props
  const [value, setValue] = useState<string>(defaultValue)

  const handleValueChange = (nextValue: any) => {
    setValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'text-muted-foreground focus-visible:ring-ring inline-flex h-8 items-center justify-center rounded-xl px-4 py-1.5 text-sm font-light whitespace-nowrap transition-all outline-none focus-visible:ring-2',
            activeTab == value &&
              'text-foreground bg-[linear-gradient(135deg,#E5E9ED_0%,#F0F0F0_32%,#C8E5FF_100%)] font-medium',
          )}
          aria-label={`Selected value: ${value}`}
        >
          <span className="whitespace-normal">{value}</span>
          <ChevronDown className="text-muted-foreground size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-60 overflow-hidden rounded-2xl border p-0 shadow-lg"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleValueChange(option.value)}
            className={cn(
              'rounded-none px-4 py-2.5 text-base text-sm font-normal',
              value === option.value && 'bg-accent text-accent-foreground',
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Dropdown
