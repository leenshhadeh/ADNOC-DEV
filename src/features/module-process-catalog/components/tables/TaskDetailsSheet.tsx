import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, ChevronUp, Clock, Eye, FileText, X } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

import ActionSheet from '@/shared/components/ActionSheet'
import { Accordion, AccordionContent, AccordionItem } from '@/shared/components/ui/accordion'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { PermissionGuard } from '@/shared/components/PermissionGuard'
import { cn } from '@/shared/lib/utils'

import type { TaskItem, ChangeRecord } from '@features/module-process-catalog/types/my-tasks'

// ── Workflow steps (same as RequestDetailsSheet) ──────────────────────────────

const WORKFLOW_STEPS = ['Draft updates', 'Custodian approval', 'Program manager signoff']

// ── WorkflowStepper ───────────────────────────────────────────────────────────

function WorkflowStepper({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = WORKFLOW_STEPS.slice(0, totalSteps)
  return (
    <div className="flex items-start">
      {steps.map((title, i) => {
        const stepIndex = i + 1
        const isCompleted = stepIndex < currentStep
        const isActive = stepIndex === currentStep
        const isLast = i === steps.length - 1
        const lineBlue = isCompleted

        return (
          <div key={stepIndex} className={cn('flex flex-col', isLast ? '' : 'flex-1')}>
            <div className="flex items-center">
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full',
                  isCompleted || isActive
                    ? 'bg-gradient-to-b from-[rgba(76,195,255,0.2)] to-[rgba(25,62,117,0.2)]'
                    : 'bg-gradient-to-b from-[rgba(76,195,255,0.2)] to-[rgba(25,62,117,0.2)] opacity-50',
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5 text-[#0047BA]" strokeWidth={2.5} />
                ) : isActive ? (
                  <div className="size-3 rounded-full bg-[#0047BA]" />
                ) : (
                  <div className="size-3 rounded-full bg-gradient-to-b from-[rgba(76,195,255,0.2)] to-[rgba(25,62,117,0.2)]" />
                )}
              </div>
              {!isLast && (
                <div className={cn('h-0.5 flex-1', lineBlue ? 'bg-[#0047BA]' : 'bg-[#CCC]')} />
              )}
            </div>
            <div className="mt-2 max-w-[90px]">
              <p className="text-[8px] font-normal tracking-wide text-[#687076]">
                STEP {stepIndex}/{steps.length}
              </p>
              <p
                className={cn(
                  'text-xs leading-4 font-medium',
                  isActive ? 'text-[#151718]' : 'text-[#687076]',
                )}
              >
                {title}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── WorkflowHistoryPanel ──────────────────────────────────────────────────────

function WorkflowHistoryPanel({
  items,
  onClose,
}: {
  items: Array<{
    id: string
    action: string
    date: string
    userName: string
    userRole: string
    reason?: string
  }>
  onClose: () => void
}) {
  return (
    <div className="bg-background absolute inset-0 z-20 flex flex-col">
      <div className="border-border flex shrink-0 items-center justify-between border-b px-6 py-4">
        <h3 className="text-foreground text-lg font-semibold">Workflow History</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Close workflow history"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No workflow history available.</p>
        ) : (
          <ol>
            {items.map((item, i) => (
              <li key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="mt-1 size-3.5 shrink-0 rounded-full bg-[#0047BB]" />
                  {i < items.length - 1 && <div className="bg-border mt-1 w-0.5 flex-1" />}
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-foreground font-semibold">{item.action}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{item.date}</p>
                  <p className="mt-0.5 text-sm">
                    <span className="text-foreground font-semibold">{item.userName}</span>
                    <span className="text-muted-foreground"> – {item.userRole}</span>
                  </p>
                  {item.reason && (
                    <div className="border-border bg-muted/30 mt-3 rounded-xl border px-4 py-3">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">Reason:</p>
                      <p className="text-foreground text-sm">{item.reason}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

// ── ChangeAccordionItem ───────────────────────────────────────────────────────

function ChangeAccordionItem({ change, index }: { change: ChangeRecord; index: number }) {
  const id = `change-${index}`

  return (
    <AccordionItem value={id} className="border-b border-[#DFE3E6]">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'group/ch flex flex-1 items-start gap-2 py-3 text-start outline-none',
            'focus-visible:ring-ring focus-visible:rounded focus-visible:ring-2',
          )}
        >
          <FileText className="mt-0.5 size-4 shrink-0 text-[#151718]" />
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium text-[#151718]">{change.name}</p>
            <div className="mt-0.5 flex items-center gap-8 text-sm font-light text-[#687076] group-data-[state=open]/ch:hidden">
              <span className="flex-1">Old Value: {change.oldValue || '—'}</span>
              <ArrowRight className="size-3.5 shrink-0 text-[#687076]" />
              <span className="flex-1">New Value: {change.newValue || '—'}</span>
            </div>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionContent className="ps-6">
        <div className="flex flex-col gap-3 pb-4">
          <div>
            <p className="mb-1.5 text-sm text-[#687076]">Old Value</p>
            <div className="min-h-10 rounded-xl bg-slate-100 px-3 py-2.5 text-sm text-[#151718]">
              {change.oldValue || '—'}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-[#687076]">New Value</p>
            <div className="min-h-10 rounded-xl bg-slate-100 px-3 py-2.5 text-sm text-[#151718]">
              {change.newValue || '—'}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

// ── Return reason dialog (inline in sheet) ────────────────────────────────────

function ReturnReasonForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (reason: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState('')

  return (
    <div className="space-y-3">
      <label htmlFor="return-reason" className="text-foreground text-sm font-medium">
        Return reason <span className="text-destructive">*</span>
      </label>
      <textarea
        id="return-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Explain why this request is being returned..."
        rows={3}
        className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
      />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={reason.trim().length === 0}
          onClick={() => onSubmit(reason.trim())}
          className="flex-1 bg-amber-600 text-white hover:bg-amber-700"
        >
          Confirm Return
        </Button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type TaskAction = 'approve' | 'reject' | 'return'

interface TaskDetailsSheetProps {
  task: TaskItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction?: (taskId: string, action: TaskAction, reason?: string) => void
}

const TaskDetailsSheet = ({ task, open, onOpenChange, onAction }: TaskDetailsSheetProps) => {
  const [showMore, setShowMore] = useState(false)
  const [showWorkflowHistory, setShowWorkflowHistory] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowMore(false)
      setShowWorkflowHistory(false)
      setShowReturnForm(false)
    }
    onOpenChange(isOpen)
  }

  const handleAction = (action: TaskAction, reason?: string) => {
    if (!task || !onAction) return
    onAction(task.id, action, reason)
    handleOpenChange(false)
  }

  // Build a minimal workflow history from task data (tasks don't carry full history)
  const workflowHistory = task?.submittedOn
    ? [
        {
          id: 'wh-submitted',
          action: 'Submitted',
          date: task.submittedOn,
          userName: task.requester,
          userRole: 'Requester',
        },
        ...(task.returnedBy
          ? [
              {
                id: 'wh-returned',
                action: 'Returned',
                date: '',
                userName: task.returnedBy,
                userRole: 'Reviewer',
                reason: task.returnComment ?? undefined,
              },
            ]
          : []),
      ]
    : []

  return (
    <ActionSheet title={task?.processName ?? ''} open={open} onOpenChange={handleOpenChange}>
      {task ? (
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* ── Scrollable body ──────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Action links */}
            <div className="space-y-3 pe-2">
              <div className="grid grid-cols-2">
                <button
                  type="button"
                  className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  disabled={!task.processId}
                >
                  <Eye className="size-4" />
                  Go to affected record
                </button>
                <button
                  type="button"
                  className="text-primary inline-flex items-center justify-end gap-1.5 text-sm font-medium hover:underline"
                  onClick={() => setShowWorkflowHistory(true)}
                >
                  <Clock className="size-4" />
                  View workflow history
                </button>
              </div>
            </div>

            {/* Stage card */}
            <div className="mt-6 rounded-2xl bg-gradient-to-b from-[#E9EFFF] to-white p-3 px-4 shadow-[7px_8px_28px_0px_rgba(0,0,0,0.2)]">
              <div className="mb-4 flex items-center gap-2">
                <p className="text-base font-medium text-[#151718]">
                  Stage {task.stageCurrent}/{task.stageTotal}
                </p>
                <span className="inline-flex items-center rounded-full bg-[#FEE5D3] px-1.5 text-xs font-normal text-[#151718]">
                  {task.stageText}
                </span>
              </div>

              <WorkflowStepper currentStep={task.stageCurrent} totalSteps={task.stageTotal} />

              <div className="mt-4 flex flex-col">
                <Separator className="bg-[#DFE3E6]" />
                <button
                  type="button"
                  className="mx-auto flex w-full items-center justify-center gap-1 py-2 text-sm font-medium text-[#0047BA]"
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
              </div>

              {showMore && (
                <>
                  <Separator className="bg-[#DFE3E6]" />

                  {/* Task details grid */}
                  <section className="pt-4">
                    <p className="text-muted-foreground mb-3 text-sm font-medium">Task details</p>
                    <div className="grid grid-cols-2">
                      <div className="border-border border-r border-b pe-4 pb-3">
                        <p className="text-muted-foreground text-xs">Domain</p>
                        <p className="text-foreground mt-0.5 font-semibold">{task.domain ?? '—'}</p>
                      </div>
                      <div className="border-border border-b ps-4 pb-3">
                        <p className="text-muted-foreground text-xs">Level</p>
                        <p className="text-foreground mt-0.5 font-semibold">{task.level ?? '—'}</p>
                      </div>
                      <div className="border-border border-r pe-4 pt-3">
                        <p className="text-muted-foreground text-xs">Request ID</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {task.requestId ?? '—'}
                        </p>
                      </div>
                      <div className="ps-4 pt-3">
                        <p className="text-muted-foreground text-xs">Submitted On</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {task.submittedOn ?? '—'}
                        </p>
                      </div>
                    </div>
                  </section>

                  <Separator className="my-4" />

                  {/* People involved */}
                  <section>
                    <p className="text-muted-foreground mb-3 text-sm font-medium">
                      People involved
                    </p>
                    <div className="grid grid-cols-2">
                      <div className="border-border border-r pe-4">
                        <p className="text-muted-foreground text-xs">Requester</p>
                        <p className="text-foreground mt-0.5 font-semibold">{task.requester}</p>
                      </div>
                      <div className="ps-4">
                        <p className="text-muted-foreground text-xs">Action Required</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {task.actionRequired ?? '—'}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Return info (if returned) */}
                  {task.returnComment && (
                    <>
                      <Separator className="my-4" />
                      <section>
                        <p className="text-muted-foreground mb-3 text-sm font-medium">
                          Return details
                        </p>
                        <div className="border-border bg-muted/30 rounded-xl border px-4 py-3">
                          <p className="text-muted-foreground mb-1 text-xs font-medium">
                            Returned by: {task.returnedBy ?? '—'}
                          </p>
                          <p className="text-foreground text-sm">{task.returnComment}</p>
                        </div>
                      </section>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Change details */}
            {task.changes && task.changes.length > 0 && (
              <section className="mt-6">
                <div className="flex items-center gap-2">
                  <h3 className="shrink-0 text-base font-medium text-[#151718]">Change details</h3>
                  <Separator className="flex-1 bg-[#DFE3E6]" />
                </div>
                <Accordion
                  type="single"
                  collapsible
                  className="mt-3 w-full [&>*:first-child]:border-t [&>*:first-child]:border-[#DFE3E6]"
                >
                  {task.changes.map((change, i) => (
                    <ChangeAccordionItem key={i} change={change} index={i} />
                  ))}
                </Accordion>
              </section>
            )}
          </div>

          {/* ── Workflow history overlay ──────────────────────────────────── */}
          {showWorkflowHistory && (
            <WorkflowHistoryPanel
              items={workflowHistory}
              onClose={() => setShowWorkflowHistory(false)}
            />
          )}

          {/* ── Action footer (Custodian / Program Manager only) ─────────── */}
          <PermissionGuard action="APPROVE_REQUEST">
            <div className="shrink-0 border-t border-[#DFE3E6] px-6 py-6">
              {showReturnForm ? (
                <ReturnReasonForm
                  onSubmit={(reason) => handleAction('return', reason)}
                  onCancel={() => setShowReturnForm(false)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="shrink-0 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-sm font-medium text-[#151718] shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
                    onClick={() => setShowReturnForm(true)}
                  >
                    Return
                  </button>
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#EB3865] to-[#B12A4C] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
                    onClick={() => handleAction('reject')}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
                    onClick={() => handleAction('approve')}
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </PermissionGuard>
        </div>
      ) : null}
    </ActionSheet>
  )
}

export default TaskDetailsSheet
