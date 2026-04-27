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

interface CompanyFilterMenuProps {
  options: string[]
  value?: string
  onChange?: (value: string) => void
  label?: string
}

const CompanyFilterMenu = ({
  options,
  value,
  onChange,
  label = 'Select company',
}: CompanyFilterMenuProps) => {
  const [internal, setInternal] = useState<string>(options[0] ?? 'All')

  const selected = value ?? internal

  const handleSelect = (option: string) => {
    if (value === undefined) setInternal(option)
    onChange?.(option)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'variant-text inline-flex items-center gap-1.5',
            'bg-transparent text-[16px] text-[#0047BA] hover:bg-transparent',
            'border-none shadow-none outline-none',
            'focus:ring-0 focus:outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-none',
            'active:ring-0 active:outline-none',
          )}
        >
          {selected || label}
          <ChevronDown className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-64 overflow-hidden rounded-xl border p-0 shadow-md"
      >
        <div className="bg-[#F8FAFC] px-3 py-2 text-[13px] font-medium text-[#687076] uppercase">
          Filter by company
        </div>

        {options.map((option, index) => {
          const isSelected = selected === option

          return (
            <DropdownMenuItem
              key={option}
              onClick={() => handleSelect(option)}
              className={cn(
                'flex justify-between rounded-none px-4 py-3 text-[15px] text-[#1F2430]',
                'focus:text-[#1F2430]',
                isSelected ? 'bg-[#DCE5F9] focus:bg-[#DCE4F5]' : 'bg-white focus:bg-[#F2F4F7]',
                index !== options.length - 1 && 'border-b border-[#EAECF0]',
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

export default CompanyFilterMenu
