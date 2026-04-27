import { useState } from 'react'
import { Loader2, SendHorizontal, X } from 'lucide-react'

export interface CommentEntry {
  id: string
  author: string
  text: string
  timestamp: string
}

interface FieldCommentPanelProps {
  comments: CommentEntry[]
  isLoading: boolean
  isAdding: boolean
  userName: string
  /** Subtitle shown next to "Comments" heading — e.g. the field name */
  fieldLabel?: string
  /** When true, render the "select a field" placeholder state instead of the full panel */
  noFieldSelected?: boolean
  onSubmit: (text: string) => void
  onClose: () => void
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const FieldCommentPanel = ({
  comments,
  isLoading,
  isAdding,
  userName,
  fieldLabel,
  noFieldSelected = false,
  onSubmit,
  onClose,
}: FieldCommentPanelProps) => {
  const [newComment, setNewComment] = useState('')

  const handleSubmit = () => {
    const trimmed = newComment.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setNewComment('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (noFieldSelected) {
    return (
      <div className="bg-accent flex w-[400px] shrink-0 flex-col rounded-3xl p-4">
        <div className="flex justify-between">
          <h2 className="text-foreground text-[18px] leading-[18px] font-medium tracking-[-0.45px]">
            Comments
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 rounded-full transition-colors"
            aria-label="Close comments"
          >
            <X className="text-muted-foreground size-5" />
          </button>
        </div>
        <p className="text-muted-foreground mt-8 text-center text-sm">
          Select a field on the left to view or add comments.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-accent flex w-[400px] shrink-0 flex-col rounded-3xl p-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {/* Header */}
        <div className="mt-auto flex justify-between">
          <h2 className="text-foreground text-[18px] leading-[18px] font-medium tracking-[-0.45px]">
            Comments
          </h2>
          {fieldLabel && <p className="text-muted-foreground text-sm">{fieldLabel}</p>}
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 rounded-full transition-colors"
            aria-label="Close comments"
          >
            <X className="text-muted-foreground size-5" />
          </button>
        </div>

        {/* Add comment card */}
        <div className="border-border flex flex-col gap-4 rounded-2xl border bg-white p-3">
          {/* Avatar + name */}
          <div className="flex items-center gap-2">
            <div className="bg-brand-blue flex size-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-[0px_1.5px_14px_0px_rgba(0,0,0,0.2)]">
              {getInitials(userName)}
            </div>
            <span className="text-foreground text-base font-normal">{userName}</span>
          </div>

          {/* Input pill */}
          <div className="bg-muted flex items-center gap-4 rounded-[36px] px-6 py-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment…"
              disabled={isAdding}
              className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-base font-normal outline-none"
            />
            <button
              type="button"
              disabled={!newComment.trim() || isAdding}
              onClick={handleSubmit}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors disabled:opacity-40"
              aria-label="Send comment"
            >
              {isAdding ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <SendHorizontal className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-muted-foreground size-5 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No comments yet. Be the first to add one.
            </p>
          ) : (
            comments.map((entry) => (
              <div
                key={entry.id}
                className="border-border flex flex-col gap-2 rounded-2xl border bg-white p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="bg-brand-blue flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-[0px_1.5px_14px_0px_rgba(0,0,0,0.2)]">
                    {getInitials(entry.author)}
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <span className="text-foreground text-base font-normal">{entry.author}</span>
                    <p className="text-foreground text-base leading-5 font-light">{entry.text}</p>
                    <span className="text-muted-foreground text-sm font-light">
                      {entry.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FieldCommentPanel
