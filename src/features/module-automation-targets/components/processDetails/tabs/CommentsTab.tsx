import { useState, useRef } from 'react'
import { SendHorizontal, Loader2 } from 'lucide-react'
import { useGetComments } from '../../../hooks/useGetComments'
import { usePostComment } from '../../../hooks/usePostComment'
import type { CommentEntry } from '../../../types'
import Avatar from '@/shared/components/ui/Avatar'

interface CommentsTabProps {
  processId: string
}

/* ── Status badge colours ────────────────────────────────────────────────────── */

const STATUS_STYLES: Record<string, string> = {
  Draft: 'bg-[#E0E0E0] text-[#151718]',
  Published: 'bg-[#DFEBFF] text-[#151718]',
  'In Progress': 'bg-[#FFF3CD] text-[#151718]',
  Reviewed: 'bg-[#D4EDDA] text-[#151718]',
}

/* ── Single comment card ─────────────────────────────────────────────────────── */

const CommentCard = ({ comment }: { comment: CommentEntry }) => {
  const badgeStyle = comment.statusLabel
    ? (STATUS_STYLES[comment.statusLabel] ?? 'bg-[#E0E0E0] text-[#151718]')
    : null

  return (
    <div className="flex gap-4 py-4">
      <Avatar name={comment.author} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Name */}
        <span className="text-base font-normal text-[#151718]">{comment.author}</span>
        {/* Comment text */}
        <p className="text-base leading-5 font-light text-[#151718]">{comment.text}</p>
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-light text-[#687076]">{comment.timestamp}</span>
          {comment.actionNote && (
            <span className="text-xs font-light text-[#687076]">— {comment.actionNote}</span>
          )}
          {badgeStyle && (
            <span className={`rounded-full px-2.5 py-1 text-xs font-normal ${badgeStyle}`}>
              {comment.statusLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const CommentsTab = ({ processId }: CommentsTabProps) => {
  const { data: comments = [], isLoading } = useGetComments(processId)
  const { mutate: postComment, isPending } = usePostComment()
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!draft.trim() || isPending) return
    postComment(
      { processId, text: draft.trim(), author: 'Current User', role: 'Reviewer' },
      {
        onSuccess: () => {
          setDraft('')
          inputRef.current?.focus()
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Comment list ───────────────────────────────────────────── */}
      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-[#889096]" />
          </div>
        ) : comments.length === 0 ? (
          <p className="py-6 text-sm text-[#889096]">No comments yet.</p>
        ) : (
          comments.map((comment, idx) => (
            <div key={comment.id}>
              <CommentCard comment={comment} />
              {idx < comments.length - 1 && <div className="h-px w-full bg-[#DFE3E6]" />}
            </div>
          ))
        )}
      </div>

      {/* ── Add comment input bar ───────────────────────────────────── */}
      <div className="flex items-center gap-4 rounded-[36px] bg-[#ECEDED] px-6 py-3">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type your comment here"
          className="flex-1 bg-transparent text-base font-normal text-[#151718] outline-none placeholder:text-[#151718]"
          disabled={isPending}
        />
        <button
          onClick={handleSubmit}
          disabled={!draft.trim() || isPending}
          className="flex-shrink-0 text-[#687076] transition-colors hover:text-[#151718] disabled:opacity-40"
          aria-label="Send comment"
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <SendHorizontal className="size-5" />
          )}
        </button>
      </div>
    </div>
  )
}

export default CommentsTab
