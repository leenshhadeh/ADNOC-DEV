import { useState } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ArrowRight, ChevronRight, Loader2, MessageSquare, SendHorizontal } from 'lucide-react'

import { AccordionContent, AccordionItem } from '@/shared/components/ui/accordion'
import { Separator } from '@/shared/components/ui/separator'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import type { CommentEntry } from '@features/module-assessment-data/types/my-tasks'

export interface ChangeAccordionItemProps {
  id: string
  label: string
  oldValue: string
  newValue: string
  /** Pass the shared comment list, fetched by the parent wrapper */
  comments?: CommentEntry[]
  /** Whether the current user may post comments */
  canComment?: boolean
  /** Whether a comment submission is in-flight */
  isAddingComment?: boolean
  /** Called when the user submits a comment. Receives the item id and trimmed text. */
  onAddComment?: (fieldId: string, text: string) => void
  className?: string
}

export function ChangeAccordionItem({
  id,
  label,
  oldValue,
  newValue,
  comments = [],
  canComment = false,
  isAddingComment = false,
  onAddComment,
  className,
}: ChangeAccordionItemProps) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleSubmitComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    onAddComment?.(id, trimmed)
    setCommentText('')
    setShowCommentInput(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  return (
    <AccordionItem value={id} className={cn('border-border border-b', className)}>
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'group/ch flex flex-1 items-start gap-2 py-3 text-start outline-none',
            'focus-visible:ring-ring focus-visible:rounded focus-visible:ring-2',
          )}
        >
          <ChevronRight className="text-muted-foreground mt-0.5 size-5 shrink-0 transition-transform duration-200 group-data-[state=open]/ch:rotate-270" />
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-base font-medium">{label}</p>
            <div className="text-muted-foreground mt-0.5 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 text-sm font-light group-data-[state=open]/ch:hidden">
              <div className="text-left break-words">
                <span className="opacity-70">Old:</span> {oldValue || '—'}
              </div>
              <ArrowRight className="size-3 shrink-0" />
              <div className="break-words">
                <span className="opacity-70">New:</span> {newValue || '—'}
              </div>
            </div>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionContent className="ps-7">
        <div className="flex flex-col gap-6 pb-4">
          <div>
            <p className="text-muted-foreground mb-2 text-base font-normal">Old Value</p>
            <div className="bg-accent text-muted-foreground border-border min-h-10 rounded-2xl border px-6 py-3 text-base font-medium">
              {oldValue || '—'}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-base font-normal">New Value</p>
            <div className="bg-accent text-muted-foreground border-border min-h-10 rounded-2xl border px-6 py-3 text-base leading-6 font-medium">
              {newValue || '—'}
            </div>
          </div>

          {/* ── Existing comments ─────────────────────────────────────── */}
          {comments.length > 0 && (
            <div className="flex flex-col gap-2">
              <Separator />
              <p className="text-muted-foreground text-sm font-medium">Comments</p>
              {comments.map((c) => (
                <div key={c.id} className="border-border bg-card rounded-xl border px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground text-sm font-semibold">{c.author}</p>
                    <p className="text-muted-foreground text-xs">{c.timestamp}</p>
                  </div>
                  <p className="text-foreground mt-1 text-sm">{c.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Add comment ───────────────────────────────────────────── */}
          {canComment && (
            <>
              <Separator />
              {!showCommentInput ? (
                <button
                  type="button"
                  className="text-brand-blue inline-flex items-center gap-1.5 self-start text-sm font-medium hover:underline"
                  onClick={() => setShowCommentInput(true)}
                >
                  <MessageSquare className="size-4" />
                  Add comment
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-sm">Add your comment</p>
                  <div className="flex gap-4">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add your comment"
                      disabled={isAddingComment}
                      rows={3}
                      className="border-input bg-background text-foreground placeholder:text-muted-foreground flex-1 resize-none rounded-2xl px-6 py-4 text-base font-medium outline-none"
                    />
                    <button
                      type="button"
                      disabled={!commentText.trim() || isAddingComment}
                      onClick={handleSubmitComment}
                      className="text-muted-foreground hover:text-foreground shrink-0 self-end transition-colors disabled:opacity-40"
                      aria-label="Send comment"
                    >
                      {isAddingComment ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <SendHorizontal className="size-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default ChangeAccordionItem
