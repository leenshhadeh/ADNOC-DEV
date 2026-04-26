import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'

const CellMenuOptions = (props: any) => {
  const navigate = useNavigate()
  const { item } = props /// use item id to perform actions on the specific item
  const options = [
    { label: 'View Details', action: () => onViewItemDetails(item) },
    { label: 'Switch to Draft version', action: () => {} },
    { label: 'Copy assessment data', action: () => {} },
    { label: 'Mark as reviewed', action: () => {} },
    { label: 'Submit', action: () => {} },
    { label: 'Archive', action: () => {} },
    { label: 'Discard', action: () => {}, destructive: true },
  ]

  const onViewItemDetails = (item: any) => {
    // Implement the logic to view item details, e.g., navigate to a details page or open a modal
    navigate(`/assessment-data/process/${item.id}`)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground shrink-0"
          // aria-label={`Actions for ${item.id}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="bg-accent w-60 overflow-hidden rounded-xl border p-0 shadow-md"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.label}
            className={`rounded-none border px-3 py-2 text-sm first:border-t-0 ${
              option.destructive ? 'text-destructive focus:text-destructive' : ''
            }`}
            onSelect={option.action}
          >
            <div className="flex">
              {/* <img src={copyIcon} className='me-2'/> */}
              {option.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CellMenuOptions
