// Connects the shared presentation component to the Assessment Data store instance
import CommentableFieldBase from '@/shared/components/CommentableField'
import { useProcessDetailActionsStore } from '../../store/processDetailActionsStore'

interface CommentableFieldProps {
  fieldId: string
  fieldName: string
  children: React.ReactNode
}

const CommentableField = ({ fieldId, fieldName, children }: CommentableFieldProps) => {
  const { isCommentMode, selectField, selectedField } = useProcessDetailActionsStore()
  return (
    <CommentableFieldBase
      fieldId={fieldId}
      fieldName={fieldName}
      isCommentMode={isCommentMode}
      isSelected={selectedField?.fieldId === fieldId}
      onSelect={selectField}
    >
      {children}
    </CommentableFieldBase>
  )
}

export default CommentableField
