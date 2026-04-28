/**
 * FieldCommentSheet — thin wrapper around the shared FieldCommentPanel.
 * Wires automation-targets hooks (processId + fieldId) and passes data down.
 */
import FieldCommentPanel from '@/shared/components/FieldCommentPanel'
import { useUserStore } from '@/shared/auth/useUserStore'
import { useFieldComments, useAddFieldComment } from '../../hooks/useFieldComments'

interface FieldCommentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldName: string
  processId: string | undefined
  fieldId: string | undefined
}

const FieldCommentSheet = ({ open, onOpenChange, processId, fieldId }: FieldCommentSheetProps) => {
  const userName = useUserStore((s) => s.user.name)
  const { data: comments = [], isLoading } = useFieldComments(processId, fieldId)
  const { mutate: addComment, isPending: isAdding } = useAddFieldComment()

  if (!open) return null

  return (
    <FieldCommentPanel
      comments={comments}
      isLoading={isLoading}
      isAdding={isAdding}
      userName={userName}
      noFieldSelected={!fieldId}
      onSubmit={(text) => addComment({ processId: processId!, fieldId: fieldId!, text })}
      onClose={() => onOpenChange(false)}
    />
  )
}

export default FieldCommentSheet
