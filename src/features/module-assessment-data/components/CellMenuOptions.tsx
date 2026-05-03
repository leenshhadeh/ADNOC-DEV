import { Eye, ClipboardCopy, BadgeCheck, Upload, Archive, Trash2 ,ArrowLeftRight} from 'lucide-react'
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
import type { FlatAssessmentRow } from '../types/process'

type CellMenuOptionsProps = {
  item: FlatAssessmentRow
  onSwitchToDraft?: (item: FlatAssessmentRow) => void
}

const DRAFT_SWITCH_TOAST_MESSAGE =
  'A Draft was created from the Published version. The Published version remains unchanged. '

const CellMenuOptions = ({ item, onSwitchToDraft }: CellMenuOptionsProps) => {
  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState('')
  const [isToastOpen, setIsToastOpen] = useState(false)
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
    await switchProcessToDraftMutation.mutateAsync({ processId: item.id })
    onSwitchToDraft?.(item)
    showToast(DRAFT_SWITCH_TOAST_MESSAGE)
  }

  const handleMarkAsReviewed = async () => {
    const response = await markProcessAsReviewedMutation.mutateAsync({ processId: item.id })
    showToast(response.message)
  }

  const handleArchive = async () => {
    const response = await archiveProcessMutation.mutateAsync({ processId: item.id })
    showToast(response.message)
  }

  const actions = useMemo(
    () => [
      { label: 'View Details', icon: Eye, action: () => onViewItemDetails(item.id) },
      { label: 'Switch to Draft version', icon: ArrowLeftRight, action: handleSwitchToDraft },
      { label: 'Copy assessment data', icon: ClipboardCopy, action: () => {} },
      { label: 'Mark as reviewed', icon: BadgeCheck, action: handleMarkAsReviewed },
      // { label: 'Submit', icon: Upload, action: handleSubmit }, // submit action is only for Draft items, so it's moved to DraftActions
      { label: 'Archive', icon: Archive, action: handleArchive },
      { label: 'Discard', icon: Trash2, action: () => {}, destructive: true },
    ],
    [item, handleSwitchToDraft],
  )
  const DraftActions = useMemo(
    () => [
      { label: 'View Details', icon: Eye, action: () => onViewItemDetails(item.id) },
      { label: 'Copy assessment data', icon: ClipboardCopy, action: () => {} },
      { label: 'Mark as reviewed', icon: BadgeCheck, action: handleMarkAsReviewed },
      { label: 'Submit', icon: Upload, action: handleSubmit },
      { label: 'Archive', icon: Archive, action: handleArchive },
      { label: 'Discard', icon: Trash2, action: () => {}, destructive: true },
    ],
    [item],
  )


  const onViewItemDetails = (itemId: string) => {
    navigate(`/assessment-data/process/${itemId}`)
  }

  return (
    <>
      <RowActionsDropdown actions={item.status=='Draft'? DraftActions: actions} 
      />
      <SuccessToast
        open={isToastOpen}
        message={toastMessage}
        onClose={() => setIsToastOpen(false)}
      />
    </>
  )
}

export default CellMenuOptions
