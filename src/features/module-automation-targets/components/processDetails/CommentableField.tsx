import { useProcessDetailActionsStore } from '../../store/processDetailActionsStore'

interface CommentableFieldProps {
  fieldId: string
  fieldName: string
  children: React.ReactNode
}

const CommentableField = ({ fieldId, fieldName, children }: CommentableFieldProps) => {
  const { isCommentMode, selectField, selectedField } = useProcessDetailActionsStore()

  if (!isCommentMode) return <>{children}</>

  const isSelected = selectedField?.fieldId === fieldId

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => selectField(fieldId, fieldName)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          selectField(fieldId, fieldName)
        }
      }}
      className={`cursor-pointer rounded-2xl transition-all ${
        isSelected
          ? 'ring-2 ring-brand-blue'
          : 'ring-dashed ring-1 ring-brand-blue/40 hover:ring-brand-blue/70'
      }`}
    >
      {children}
    </div>
  )
}

export default CommentableField
