import { MessageSquareText } from 'lucide-react'

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
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-brand-blue ring-2' : ''}`}
    >
      {children}
      {isSelected && (
        <div className="absolute top-0 right-0 rounded-full border border-[#DADDE0] bg-[#EDEDED] p-2">
          <MessageSquareText size={16} className="text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

export default CommentableField
