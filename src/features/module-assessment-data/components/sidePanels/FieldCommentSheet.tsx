/**
 * FieldCommentSheet — thin wrapper around the shared FieldCommentPanel.
 * Wires assessment-data hooks (taskId + fieldName) and passes data down.
 *
 * Figma nodes 6206-271371 (empty) / 6206-274649 (with comments).
 */
import FieldCommentPanel from '@/shared/components/FieldCommentPanel'
import { useUserStore } from '@/shared/auth/useUserStore'
import {
  useFieldComments,
  useAddFieldComment,
} from '@features/module-assessment-data/hooks/useFieldComments'

interface FieldCommentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldName: string
  taskId: string | undefined
}

const FieldCommentSheet = ({ open, onOpenChange, taskId, fieldName }: FieldCommentSheetProps) => {
  const userName = useUserStore((s) => s.user.name)
  const { data: comments = [], isLoading } = useFieldComments(taskId, fieldName)
  const { mutate: addComment, isPending: isAdding } = useAddFieldComment()

  if (!open) return null

  return (
    <FieldCommentPanel
      comments={comments}
      isLoading={isLoading}
      isAdding={isAdding}
      userName={userName}
      fieldLabel={fieldName}
      onSubmit={(text) => addComment({ taskId: taskId!, fieldName, text })}
      onClose={() => onOpenChange(false)}
    />
  )
}

export default FieldCommentSheet
