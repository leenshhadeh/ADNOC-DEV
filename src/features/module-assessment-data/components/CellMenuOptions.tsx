import { Eye, RotateCcw, ClipboardCopy, BadgeCheck, Upload, Archive, Trash2 } from 'lucide-react'
import { SuccessToast } from '@/shared/components/SuccessToast'
import { RowActionsDropdown } from '@/shared/components/RowActionsDropdown'
import { useState } from 'react'
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
    const response = await submitProcessMutation.mutateAsync({ processId: item.id, process: item })
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

  const actions = [
    { label: 'View Details', icon: Eye, action: () => onViewItemDetails(item.id) },
    { label: 'Switch to Draft version', icon: RotateCcw, action: handleSwitchToDraft },
    { label: 'Copy assessment data', icon: ClipboardCopy, action: () => {} },
    { label: 'Mark as reviewed', icon: BadgeCheck, action: handleMarkAsReviewed },
    { label: 'Submit', icon: Upload, action: handleSubmit },
    { label: 'Archive', icon: Archive, action: handleArchive },
    { label: 'Discard', icon: Trash2, action: () => {}, destructive: true },
  ]

  const onViewItemDetails = (itemId: string) => {
    navigate(`/assessment-data/process/${itemId}`)
  }

  return (
    <>
      <RowActionsDropdown actions={actions} />
      <SuccessToast
        open={isToastOpen}
        message={toastMessage}
        onClose={() => setIsToastOpen(false)}
      />
    </>
  )
}

export default CellMenuOptions
