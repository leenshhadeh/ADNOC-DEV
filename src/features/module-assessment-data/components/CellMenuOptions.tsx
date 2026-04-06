import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'

const CellMenuOptions = (props:any) => {
    const navigate = useNavigate()
    const { item } = props  /// use item id to perform actions on the specific item
const options = [
    { label: 'View Details', action: () => onViewItemDetails(item) },
    { label: 'Switch to Draft version', action: () => console.log('Add sub-process', item) },
    { label: 'Copy assessment data', action: () => console.log('Delete', item)},
    { label: 'Mark as reviewed', action: () => console.log('Delete', item) },
    { label: 'Submit', action: () => console.log('Delete', item)},
    { label: 'Archive', action: () => console.log('Delete', item)},
    { label: 'Discard', action: () => console.log('Delete', item), destructive: true },
  ]

const onViewItemDetails = (item:any) => {
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
    className="shrink-0 text-muted-foreground"
    // aria-label={`Actions for ${item.id}`}
  >
    <MoreHorizontal className="size-4" />
  </Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end" sideOffset={4} className="w-44 overflow-hidden rounded-xl border p-0 shadow-md">
<DropdownMenuContent align="end" sideOffset={4} className="w-60 overflow-hidden rounded-xl border p-0 shadow-md bg-[#F1F3F5]">
    {options.map((option) => (
        <DropdownMenuItem
        key={option.label}
        className={`rounded-none px-3 py-2 text-sm border  first:border-t-0 ${
            option.destructive ? 'text-destructive focus:text-destructive' : ''
        }`}
        onSelect={option.action}
        >
          <div className='flex'>
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