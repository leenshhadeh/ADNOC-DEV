import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Check } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'

interface PorcessMarnuTypes{
    options:string[]
}

const ProcessesMenu = (props:PorcessMarnuTypes) => {
  const [selected, setSelected] = useState('Published processes')
    const {
        options= [
        'Published processes', 
        'Latest processes', 
        'Archived processes'
    ]} = props

return(
    <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        className={cn(
          'inline-flex items-center gap-2',
          'bg-[transparent] text-primary ',
          'outline-none',
        )}
      >
        {selected}
        <ChevronDown className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      sideOffset={4}
      className="w-65 overflow-hidden rounded-xl border p-0 shadow-md"
    >
      <div className="bg-[#F1F8FF] px-3 py-2 font-medium text-[#687076] text-[14px] uppercase">
        SWITCH VIEW TO
      </div>
      {options.map((option, index) => {
        const isSelected = selected === option

        return (
          <DropdownMenuItem
            key={option}
            onClick={() => setSelected(option)}
            className={cn(
              'flex text-[#1F2430] text-[16px] px-4',
              'rounded-none',
              'focus:text-[#1F2430]',
              'justify-between',
              isSelected ? 'bg-[#DCE5F9] focus:bg-[#DCE4F5]' : 'bg-[#F1F3F5] focus:bg-[#ECEFF2]',
              index !== options.length - 1 && 'border-b border-[#D9DEE3]',
            )}
          >
            <span>{option}</span>
            {isSelected && <Check className="h-9 w-9 text-[#0047BA]" />}
          </DropdownMenuItem>
        )
      })}
    </DropdownMenuContent>
  </DropdownMenu>
)
}

export default ProcessesMenu