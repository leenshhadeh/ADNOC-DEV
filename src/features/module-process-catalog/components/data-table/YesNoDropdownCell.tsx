import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'

const YES_NO_OPTIONS = ['Yes', 'No'] as const

export type YesNoValue = (typeof YES_NO_OPTIONS)[number]

interface YesNoDropdownCellProps {
  defaultValue: YesNoValue
  onValueChange?: (value: YesNoValue) => void
}

const YesNoDropdownCell = ({ defaultValue, onValueChange }: YesNoDropdownCellProps) => {
  const [value, setValue] = useState<YesNoValue>(defaultValue)

  const handleValueChange = (nextValue: YesNoValue) => {
    setValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 min-w-16 items-center justify-between gap-2 rounded-md ps-2 pe-2 text-base text-foreground outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Selected value: ${value}`}
        >
          <span>{value}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="w-40 overflow-hidden rounded-2xl border p-0 shadow-lg">
        {YES_NO_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option}
            onSelect={() => handleValueChange(option)}
            className={cn('rounded-none px-4 py-2.5 text-base font-normal', value === option && 'bg-accent text-accent-foreground')}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default YesNoDropdownCell