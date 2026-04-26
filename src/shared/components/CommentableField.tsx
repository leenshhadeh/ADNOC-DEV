/**
 * Pure presentation component — no store dependency.
 * Each module wraps this with its own store connection.
 */
interface CommentableFieldProps {
  fieldId: string
  fieldName: string
  children: React.ReactNode
  isCommentMode: boolean
  isSelected: boolean
  onSelect: (fieldId: string, fieldName: string) => void
}

const CommentableField = ({
  fieldId,
  fieldName,
  children,
  isCommentMode,
  isSelected,
  onSelect,
}: CommentableFieldProps) => {
  if (!isCommentMode) return <>{children}</>

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(fieldId, fieldName)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(fieldId, fieldName)
        }
      }}
      className={`cursor-pointer rounded-2xl transition-all ${
        isSelected
          ? 'ring-brand-blue ring-2'
          : 'ring-dashed ring-brand-blue/40 hover:ring-brand-blue/70 ring-1'
      }`}
    >
      {children}
    </div>
  )
}

export default CommentableField
