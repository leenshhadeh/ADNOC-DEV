/**
 * FieldCommentSheet — inline right panel showing a comment thread for a
 * specific field (ChangeRecord). Quality Manager can view past comments and
 * add new ones.
 *
 * Figma nodes 6206-271371 (empty) / 6206-274649 (with comments).
 */
import { useState } from 'react'
import { Loader2, SendHorizontal, X } from 'lucide-react'

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

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const FieldCommentSheet = ({ open, onOpenChange, taskId, fieldName }: FieldCommentSheetProps) => {
  const [newComment, setNewComment] = useState('')
  const userName = useUserStore((s) => s.user.name)

  const { data: comments = [], isLoading } = useFieldComments(taskId, fieldName)
  const { mutate: addComment, isPending: isAdding } = useAddFieldComment()

  if (!open) return null

  const close = () => {
    setNewComment('')
    onOpenChange(false)
  }

  const handleSubmit = () => {
    const trimmed = newComment.trim()
    if (!trimmed || !taskId || !fieldName) return
    addComment({ taskId, fieldName, text: trimmed })
    setNewComment('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="bg-accent flex w-[400px] shrink-0 flex-col rounded-3xl p-4">
      {/* ── Title ────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {/* ── Close button ─────────────────────────────────────────────── */}
        <div className="mt-auto flex justify-between">
          <h2 className="text-[18px] leading-[18px] font-medium tracking-[-0.45px] text-[#151718]">
            Comments
          </h2>
          <p className="text-sm text-[#687076]">{fieldName}</p>
          <button
            type="button"
            onClick={close}
            className="flex size-10 rounded-full transition-colors"
            aria-label="Close comments"
          >
            <X className="size-5 text-[#687076]" />
          </button>
        </div>

        {/* ── Add comment card ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#DFE3E6] bg-white p-3">
          {/* Avatar + name */}
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white shadow-[0px_1.5px_14px_0px_rgba(0,0,0,0.2)]">
              {getInitials(userName)}
            </div>
            <span className="text-base font-normal text-[#151718]">{userName}</span>
          </div>

          {/* Input pill */}
          <div className="flex items-center gap-4 rounded-[36px] bg-[#ECEDED] px-6 py-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment…"
              disabled={isAdding}
              className="flex-1 bg-transparent text-base font-normal text-[#151718] outline-none placeholder:text-[#687076]"
            />
            <button
              type="button"
              disabled={!newComment.trim() || isAdding}
              onClick={handleSubmit}
              className="shrink-0 text-[#687076] transition-colors hover:text-[#151718] disabled:opacity-40"
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

        {/* ── Comments list ──────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-[#687076]" />
            </div>
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#687076]">
              No comments yet. Be the first to add one.
            </p>
          ) : (
            comments.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 rounded-2xl border border-[#DFE3E6] bg-white p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white shadow-[0px_1.5px_14px_0px_rgba(0,0,0,0.2)]">
                    {getInitials(entry.author)}
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <span className="text-base font-normal text-[#151718]">{entry.author}</span>
                    <p className="text-base leading-5 font-light text-[#151718]">{entry.text}</p>
                    <span className="text-sm font-light text-[#687076]">{entry.timestamp}</span>
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

export default FieldCommentSheet
