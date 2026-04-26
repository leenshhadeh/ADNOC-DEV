import { useState } from 'react'

import { PermissionGuard } from '@/shared/components/PermissionGuard'
import TaskActionFooter from '@/shared/components/TaskActionFooter'
import { ApproveModal } from '@/shared/components/modals/ApproveModal'
import { ReturnModal } from '@/shared/components/modals/ReturnModal'
import { RejectModal } from '@/shared/components/modals/RejectModal'
import { Separator } from '@/shared/components/ui/separator'
import type { WorkflowHistoryEntry } from '@/shared/components/WorkflowHistoryPanel'

import type { TaskItem } from '@features/module-process-catalog/types/my-tasks'

import ProcessDetailsSheet, { type ChangeItem } from './ProcessDetailsSheet'

// ── Types ─────────────────────────────────────────────────────────────────────

type TaskAction = 'approve' | 'reject' | 'return'

interface TaskDetailsSheetProps {
  task: TaskItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction?: (taskId: string, action: TaskAction, reason?: string) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

const TaskDetailsSheet = ({ task, open, onOpenChange, onAction }: TaskDetailsSheetProps) => {
  const [approveOpen, setApproveOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const handleClose = () => {
    setActionLoading(false)
    onOpenChange(false)
  }

  const handleAction = (action: TaskAction, reason?: string) => {
    if (!task || !onAction) return
    setActionLoading(true)
    onAction(task.id, action, reason)
    setActionLoading(false)
    handleClose()
  }

  // Build a minimal workflow history from task data
  const workflowHistory: WorkflowHistoryEntry[] = task?.submittedOn
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

  if (!task) return null

  const changes: ChangeItem[] = (task.changes ?? []).map((c, i) => ({
    id: `change-${i}`,
    label: c.name,
    oldValue: c.oldValue,
    newValue: c.newValue,
  }))

  const detailsGrid = (
    <>
      {/* Task details */}
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
            <p className="text-foreground mt-0.5 font-semibold">{task.requestId ?? '—'}</p>
          </div>
          <div className="ps-4 pt-3">
            <p className="text-muted-foreground text-xs">Submitted On</p>
            <p className="text-foreground mt-0.5 font-semibold">{task.submittedOn ?? '—'}</p>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      {/* People involved */}
      <section>
        <p className="text-muted-foreground mb-3 text-sm font-medium">People involved</p>
        <div className="grid grid-cols-2">
          <div className="border-border border-r pe-4">
            <p className="text-muted-foreground text-xs">Requester</p>
            <p className="text-foreground mt-0.5 font-semibold">{task.requester}</p>
          </div>
          <div className="ps-4">
            <p className="text-muted-foreground text-xs">Action Required</p>
            <p className="text-foreground mt-0.5 font-semibold">{task.actionRequired ?? '—'}</p>
          </div>
        </div>
      </section>

      {/* Return details (conditional) */}
      {task.returnComment && (
        <>
          <Separator className="my-4" />
          <section>
            <p className="text-muted-foreground mb-3 text-sm font-medium">Return details</p>
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
  )

  const footer = (
    <PermissionGuard action="APPROVE_REQUEST">
      <div className="border-border shrink-0 border-t px-6 py-6">
        <TaskActionFooter
          disabled={actionLoading}
          onCancel={handleClose}
          onReturn={() => setReturnOpen(true)}
          onReject={() => setRejectOpen(true)}
          onApprove={() => setApproveOpen(true)}
        />
      </div>
    </PermissionGuard>
  )

  return (
    <>
      <ProcessDetailsSheet
        title={task.processName}
        open={open}
        onOpenChange={onOpenChange}
        processId={task.processId}
        stageCurrent={task.stageCurrent}
        stageTotal={task.stageTotal}
        stageText={task.stageText}
        detailsGrid={detailsGrid}
        changes={changes}
        workflowHistory={workflowHistory}
        footer={footer}
      />

      {/* Modals — rendered outside the sheet to avoid stacking context issues */}
      <ApproveModal
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title={`Approve: ${task.processName}`}
        description="The request will be forwarded for Quality Manager Review. Are you sure you want to approve it?"
        onConfirm={() => {
          handleAction('approve')
          setApproveOpen(false)
        }}
      />
      <ReturnModal
        open={returnOpen}
        onOpenChange={setReturnOpen}
        title={`Return: ${task.processName}`}
        description="The request will be marked as Returned. Please add the return reason below."
        onConfirm={(reason) => {
          handleAction('return', reason)
          setReturnOpen(false)
        }}
      />
      <RejectModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={`Reject: ${task.processName}`}
        description="The request will be rejected. Are you sure you want to reject it?"
        requireReason
        onConfirm={(reason) => {
          handleAction('reject', reason)
          setRejectOpen(false)
        }}
      />
    </>
  )
}

export default TaskDetailsSheet
