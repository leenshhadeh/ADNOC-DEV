import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { SuccessToast } from '@/shared/components/SuccessToast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useArchiveProcess,
  useMarkProcessAsReviewed,
  useSubmitProcess,
  useSwitchProcessToDraft,
} from '../hooks/useProcessRowActions'

const CellMenuOptions = (props: any) => {
  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState('')
  const [isToastOpen, setIsToastOpen] = useState(false)
  const { item } = props /// use item id to perform actions on the specific item
  const submitProcessMutation = useSubmitProcess()
  const switchProcessToDraftMutation = useSwitchProcessToDraft()
  const markProcessAsReviewedMutation = useMarkProcessAsReviewed()
  const archiveProcessMutation = useArchiveProcess()

  const showToast = (message: string) => {
    setToastMessage(message)
    setIsToastOpen(true)
  }

  const handleSubmit = async () => {
    const response = await submitProcessMutation.mutateAsync({ processId: item.id ,process:item})
    showToast(response.message)
  }

  const handleSwitchToDraft = async () => {
    const response = await switchProcessToDraftMutation.mutateAsync({ processId: item.id })
    showToast(response.message)
  }

  const handleMarkAsReviewed = async () => {
    const response = await markProcessAsReviewedMutation.mutateAsync({ processId: item.id })
    showToast(response.message)
  }

  const handleArchive = async () => {
    const response = await archiveProcessMutation.mutateAsync({ processId: item.id })
    showToast(response.message)
  }

  const options = useMemo(
    () => [
      { label: 'View Details', action: () => onViewItemDetails(item.id) },
      { label: 'Switch to Draft version', action: handleSwitchToDraft },
      { label: 'Copy assessment data', action: () => {} },
      { label: 'Mark as reviewed', action: handleMarkAsReviewed },
      { label: 'Submit', action: handleSubmit },
      { label: 'Archive', action: handleArchive },
      { label: 'Discard', action: () => {}, destructive: true },
    ],
    [item],
  )

  const onViewItemDetails = (itemId: string) => {
    navigate(`/assessment-data/process/${itemId}`)
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground shrink-0"
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
              <div className="flex">{option.label}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <SuccessToast
        open={isToastOpen}
        message={toastMessage}
        onClose={() => setIsToastOpen(false)}
      />
    </>
  )
}

export default CellMenuOptions
