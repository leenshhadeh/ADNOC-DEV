import { useState } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  ExternalLink,
  Loader2,
  MessageSquare,
  SendHorizontal,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import ActionSheet from '@/shared/components/ActionSheet'
import { Accordion, AccordionContent, AccordionItem } from '@/shared/components/ui/accordion'
import { Separator } from '@/shared/components/ui/separator'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import { hasPermission } from '@/shared/lib/permissions'
import { useUserStore } from '@/shared/auth/useUserStore'
import WorkflowStepper from '@/shared/components/WorkFlowStepper'
import { StatusBadgeCell } from '@/shared/components/cells'
import TaskActionFooter from '@/shared/components/TaskActionFooter'
import WorkflowHistoryPanel from '@/shared/components/WorkflowHistoryPanel'

import type { WorkflowHistoryItem } from '@features/module-process-catalog/types/submitted-requests'
import { ApproveModal } from '@/shared/components/modals/ApproveModal'
import { ReturnModal } from '@/shared/components/modals/ReturnModal'
import { RejectModal } from '@/shared/components/modals/RejectModal'

import type { ChangeRecord, TaskItem } from '@features/module-assessment-data/types/my-tasks'
import {
  approveTask,
  getTaskWorkflowHistory,
  rejectTask,
  returnTask,
} from '@features/module-assessment-data/api/processAssesmentService'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'
import {
  useFieldComments,
  useAddFieldComment,
} from '@features/module-assessment-data/hooks/useFieldComments'

const WORKFLOW_STEPS = [
  { id: 'step1', title: 'Draft updates', status: 'completed', owner: 'Business FP' },
  { id: 'step2', title: 'Draft Submit', status: 'active', owner: 'Digital FP', progress: '40%' },
  { id: 'step3', title: 'Quality review', status: '' },
  { id: 'step4', title: 'Digital VP signoff', status: '' },
]

// ── WorkflowHistoryPanel ──────────────────────────────────────────────────────

// ── ChangeAccordionItem ───────────────────────────────────────────────────────

interface ChangeAccordionItemProps {
  change: ChangeRecord
  itemId: string
  taskId: string
  canComment: boolean
}

function ChangeAccordionItem({ change, itemId, taskId, canComment }: ChangeAccordionItemProps) {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const truncate = (str: string, n = 18) => (str.length > n ? str.slice(0, n) + '…' : str)

  const changeId = change.id ?? itemId
  const { data: comments = [] } = useFieldComments(taskId, changeId)
  const { mutate: addComment, isPending: isAdding } = useAddFieldComment()

  const handleSubmitComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    addComment({ taskId, changeId, text: trimmed })
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
    <AccordionItem value={itemId}>
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'group/ch flex flex-1 items-start gap-2 py-3 text-start outline-none',
            'focus-visible:ring-ring focus-visible:rounded focus-visible:ring-2',
          )}
        >
          <ChevronRight className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/ch:-rotate-90" />

          <div className="min-w-0 flex-1">
            <p className="text-foreground font-semibold">{change.name ?? change.label ?? '—'}</p>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm group-data-[state=open]/ch:hidden">
              <span>Old Value: {truncate(change.oldValue)}</span>
              <ArrowRight className="size-3 shrink-0" />
              <span>New Value: {truncate(change.newValue)}</span>
            </p>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionContent className="ps-6">
        <div className="flex flex-col gap-3 pb-4">
          <div>
            <p className="text-muted-foreground mb-1.5 text-sm">Old Value</p>
            <div className="text-foreground min-h-10 rounded-xl bg-slate-100 px-3 py-2.5 text-sm">
              {change.oldValue}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1.5 text-sm">New Value</p>
            <div className="text-foreground min-h-10 rounded-xl bg-slate-100 px-3 py-2.5 text-sm">
              {change.newValue}
            </div>
          </div>

          {/* ── Existing comments ─────────────────────────────────────── */}
          {comments.length > 0 && (
            <div className="flex flex-col gap-2">
              <Separator />
              <p className="text-muted-foreground text-sm font-medium">Comments</p>
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-[#DFE3E6] bg-white px-3 py-2.5">
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
                  className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[#0047BB] hover:underline"
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
                      disabled={isAdding}
                      rows={3}
                      className="border-input bg-background text-foreground placeholder:text-muted-foreground flex-1 resize-none rounded-2xl px-6 py-4 text-base font-medium outline-none"
                    />
                    <button
                      type="button"
                      disabled={!commentText.trim() || isAdding}
                      onClick={handleSubmitComment}
                      className="shrink-0 self-end text-[#687076] transition-colors hover:text-[#151718] disabled:opacity-40"
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
              )}
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface TaskDetailsSheetProps {
  task: TaskItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TaskDetailsSheet = ({ task, open, onOpenChange }: TaskDetailsSheetProps) => {
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)
  const [showWorkflowHistory, setShowWorkflowHistory] = useState(false)
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistoryItem[]>([])
  const [approveOpen, setApproveOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const userRole = useUserStore((s) => s.user.role)
  const canApprove = hasPermission(userRole, 'APPROVE_REQUEST')
  const canReturn = hasPermission(userRole, 'RETURN_REQUEST')
  const isApprover = canApprove || canReturn

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowMore(false)
      setShowWorkflowHistory(false)
      setWorkflowHistory([])
      setActionLoading(false)
    }
    onOpenChange(isOpen)
  }

  const handleViewWorkflowHistory = () => {
    setShowWorkflowHistory(true)
    if (task && workflowHistory.length === 0) {
      getTaskWorkflowHistory(task.id)
        .then(setWorkflowHistory)
        .catch(() => {})
    }
  }

  return (
    <>
      <ActionSheet
        title={task?.processName ?? ''}
        open={open}
        onOpenChange={handleOpenChange}
        large
      >
        {task ? (
          <div className="relative flex-1 overflow-hidden">
            {/* ── Main scrollable body ──────────────────────────────────────── */}
            <div className={cn('h-full overflow-y-auto p-6', isApprover ? 'pb-28' : '')}>
              {/* Action links */}
              <div className="grid grid-cols-2 pe-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0047BB] hover:underline"
                  onClick={() => {
                    if (task.processId) {
                      onOpenChange(false)
                      navigate(`/assessment-data/process/${task.processId}`)
                    }
                  }}
                >
                  <ExternalLink className="size-4" />
                  View full card
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-end gap-1.5 text-sm font-medium text-[#0047BB] hover:underline"
                  onClick={handleViewWorkflowHistory}
                >
                  <Clock className="size-4" />
                  View workflow history
                </button>
              </div>

              {/* Stage card */}
              <div className="mt-6 rounded-2xl border border-transparent bg-gradient-to-br from-[#E9EFFF] to-white p-4 shadow-[0_4px_8px_0_#d1d5df80]">
                <div className="mb-4 flex items-center gap-2">
                  <p className="text-foreground text-lg font-semibold">
                    Stage {task.stageCurrent}/{task.stageTotal}
                  </p>
                  <StatusBadgeCell status={task.status} />
                </div>

                <WorkflowStepper steps={WORKFLOW_STEPS} />

                <Separator className="my-4" />

                <button
                  type="button"
                  className="text-primary mx-auto flex w-full items-center justify-center gap-1 text-sm font-medium"
                  onClick={() => setShowMore((v) => !v)}
                >
                  {showMore ? (
                    <>
                      Hide <ChevronUp className="size-4" />
                    </>
                  ) : (
                    <>
                      More <ChevronDown className="size-4" />
                    </>
                  )}
                </button>

                {showMore && (
                  <>
                    <Separator className="my-4" />
                    <section>
                      <p className="text-muted-foreground mb-3 text-sm font-medium">
                        Process details
                      </p>
                      <div className="grid grid-cols-2">
                        <div className="border-border border-r border-b pe-4 pb-3">
                          <p className="text-muted-foreground text-xs">Domain</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {DOMAINS_DATA.find((d) => d.id === task.domain)?.name ??
                              task.domain ??
                              '—'}
                          </p>
                        </div>
                        <div className="border-border border-b ps-4 pb-3">
                          <p className="text-muted-foreground text-xs">Process Level</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {task.level ?? '—'}
                          </p>
                        </div>
                        <div className="border-border border-r pe-4 pt-3">
                          <p className="text-muted-foreground text-xs">Level 1</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {task.level1 ?? '—'}
                          </p>
                        </div>
                        <div className="ps-4 pt-3">
                          <p className="text-muted-foreground text-xs">Level 2</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {task.level2 ?? '—'}
                          </p>
                        </div>
                      </div>
                    </section>

                    <Separator className="my-4" />
                    <section>
                      <p className="text-muted-foreground mb-3 text-sm font-medium">
                        People involved
                      </p>
                      <div className="grid grid-cols-2">
                        <div className="border-border border-r border-b pe-4 pb-3">
                          <p className="text-muted-foreground text-xs">Requester</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {task.requester ?? '—'}
                          </p>
                        </div>
                        <div className="border-border border-b ps-4 pb-3">
                          <p className="text-muted-foreground text-xs">Business Focal Point</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {task.businessFocalPoint ?? '—'}
                          </p>
                        </div>
                        <div className="border-border border-r pe-4 pt-3">
                          <p className="text-muted-foreground text-xs">Submitted On</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {task.submittedOn ?? '—'}
                          </p>
                        </div>
                        <div className="ps-4 pt-3">
                          <p className="text-muted-foreground text-xs">Digital Focal Point</p>
                          <p className="text-foreground mt-0.5 font-semibold">
                            {task.digitalFocalPoint ?? '—'}
                          </p>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </div>

              {/* Change details section */}
              {task.changes && task.changes.length > 0 && (
                <section className="mt-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-foreground shrink-0 text-xl font-semibold">
                      Change details
                    </h3>
                    <Separator className="flex-1" />
                  </div>
                  {/* Return reason box */}
                  {task.returnComment && (
                    <div className="mt-4 rounded-xl border border-[#F9D4E0] bg-[#FFF5F7] px-4 py-3">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">
                        Reason for return
                      </p>
                      <p className="text-foreground text-sm">{task.returnComment}</p>
                    </div>
                  )}

                  {/* Reject reason box */}
                  {task.rejectComment && (
                    <div className="mt-4 rounded-xl border border-[#F9D4E0] bg-[#FFF5F7] px-4 py-3">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">
                        Reason for rejection
                      </p>
                      <p className="text-foreground text-sm">{task.rejectComment}</p>
                    </div>
                  )}

                  <Accordion type="single" collapsible className="mt-3 w-full">
                    {task.changes.map((change, index) => (
                      <ChangeAccordionItem
                        key={change.id ?? `change-${index}`}
                        itemId={change.id ?? `change-${index}`}
                        change={change}
                        taskId={task.id}
                        canComment={isApprover}
                      />
                    ))}
                  </Accordion>
                </section>
              )}
            </div>

            {/* ── Approver sticky footer ────────────────────────────────────── */}
            {isApprover && (
              <div className="border-border bg-background absolute right-0 bottom-0 left-0 border-t p-6">
                <TaskActionFooter
                  disabled={actionLoading}
                  onCancel={() => onOpenChange(false)}
                  onReturn={() => setReturnOpen(true)}
                  onReject={() => setRejectOpen(true)}
                  onApprove={() => setApproveOpen(true)}
                />
              </div>
            )}

            {/* ── Workflow history overlay ──────────────────────────────────── */}
            {showWorkflowHistory && (
              <WorkflowHistoryPanel
                items={workflowHistory}
                onClose={() => setShowWorkflowHistory(false)}
              />
            )}
          </div>
        ) : null}
      </ActionSheet>

      {/* Modals — rendered outside the sheet to avoid stacking context issues */}
      <ApproveModal
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title={`Approve: ${task?.processName ?? ''}`}
        onConfirm={() => {
          if (!task) return
          setActionLoading(true)
          approveTask(task.id)
            .then(() => {
              setApproveOpen(false)
              onOpenChange(false)
            })
            .catch(() => {})
            .finally(() => setActionLoading(false))
        }}
      />
      <ReturnModal
        open={returnOpen}
        onOpenChange={setReturnOpen}
        title={`Return: ${task?.processName ?? ''}`}
        onConfirm={(reason) => {
          if (!task) return
          setActionLoading(true)
          returnTask(task.id, reason)
            .then(() => {
              setReturnOpen(false)
              onOpenChange(false)
            })
            .catch(() => {})
            .finally(() => setActionLoading(false))
        }}
      />
      <RejectModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={`Reject: ${task?.processName ?? ''}`}
        requireReason
        onConfirm={(reason) => {
          if (!task) return
          setActionLoading(true)
          rejectTask(task.id, reason)
            .then(() => {
              setRejectOpen(false)
              onOpenChange(false)
            })
            .catch(() => {})
            .finally(() => setActionLoading(false))
        }}
      />
    </>
  )
}

export default TaskDetailsSheet
