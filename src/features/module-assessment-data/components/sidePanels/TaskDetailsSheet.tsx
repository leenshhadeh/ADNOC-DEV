import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { Accordion } from '@/shared/components/ui/accordion'
import { Separator } from '@/shared/components/ui/separator'
import { hasPermission } from '@/shared/lib/permissions'
import { useUserStore } from '@/shared/auth/useUserStore'
import WorkflowStepper from '@/shared/components/WorkFlowStepper'
import { StatusBadgeCell, type CatalogStatus } from '@/shared/components/cells'
import TaskActionFooter from '@/shared/components/TaskActionFooter'
import ProcessSheetShell from '@/shared/components/sheets/ProcessSheetShell'
import ChangeAccordionItem from '@/shared/components/ChangeAccordionItem'

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

// ── TaskChangeItem (thin wrapper that fetches per-field comments) ──────────────────────────────────

function TaskChangeItem({
  change,
  itemId,
  taskId,
  canComment,
}: {
  change: ChangeRecord
  itemId: string
  taskId: string
  canComment: boolean
}) {
  const changeId = change.id ?? itemId
  const { data: comments = [] } = useFieldComments(taskId, changeId)
  const { mutate: addComment, isPending: isAddingComment } = useAddFieldComment()

  return (
    <ChangeAccordionItem
      id={itemId}
      label={change.name ?? change.label ?? '—'}
      oldValue={change.oldValue}
      newValue={change.newValue}
      comments={comments}
      canComment={canComment}
      isAddingComment={isAddingComment}
      onAddComment={(_, text) => addComment({ taskId, fieldName: changeId, text })}
    />
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
      setWorkflowHistory([])
      setActionLoading(false)
    }
    onOpenChange(isOpen)
  }

  const handleWorkflowHistoryOpen = () => {
    if (task && workflowHistory.length === 0) {
      getTaskWorkflowHistory(task.id)
        .then(setWorkflowHistory)
        .catch(() => {})
    }
  }

  return (
    <>
      <ProcessSheetShell
        title={task?.processName ?? ''}
        open={open}
        onOpenChange={handleOpenChange}
        large
        primaryLink={
          <button
            type="button"
            className="text-brand-blue inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            onClick={() => {
              if (task?.processId) {
                onOpenChange(false)
                navigate(`/assessment-data/process/${task.processId}`)
              }
            }}
          >
            <ExternalLink className="size-4" />
            View full card
          </button>
        }
        stageCurrent={task?.stageCurrent}
        stageTotal={task?.stageTotal}
        stageBadge={task ? <StatusBadgeCell status={task.status as CatalogStatus} /> : undefined}
        stepper={<WorkflowStepper steps={WORKFLOW_STEPS} />}
        expandedContent={
          task ? (
            <>
              <section>
                <p className="text-muted-foreground mb-3 text-sm font-medium">Process details</p>
                <div className="grid grid-cols-2">
                  <div className="border-border border-r border-b pe-4 pb-3">
                    <p className="text-muted-foreground text-xs">Domain</p>
                    <p className="text-foreground mt-0.5 font-semibold">
                      {DOMAINS_DATA.find((d) => d.id === task.domain)?.name ?? task.domain ?? '—'}
                    </p>
                  </div>
                  <div className="border-border border-b ps-4 pb-3">
                    <p className="text-muted-foreground text-xs">Process Level</p>
                    <p className="text-foreground mt-0.5 font-semibold">{task.level ?? '—'}</p>
                  </div>
                  <div className="border-border border-r pe-4 pt-3">
                    <p className="text-muted-foreground text-xs">Level 1</p>
                    <p className="text-foreground mt-0.5 font-semibold">{task.level1 ?? '—'}</p>
                  </div>
                  <div className="ps-4 pt-3">
                    <p className="text-muted-foreground text-xs">Level 2</p>
                    <p className="text-foreground mt-0.5 font-semibold">{task.level2 ?? '—'}</p>
                  </div>
                </div>
              </section>
              <Separator className="my-4" />
              <section>
                <p className="text-muted-foreground mb-3 text-sm font-medium">People involved</p>
                <div className="grid grid-cols-2">
                  <div className="border-border border-r border-b pe-4 pb-3">
                    <p className="text-muted-foreground text-xs">Requester</p>
                    <p className="text-foreground mt-0.5 font-semibold">{task.requester ?? '—'}</p>
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
          ) : null
        }
        changeSection={
          task?.changes && task.changes.length > 0 ? (
            <section className="mt-6">
              <div className="flex items-center gap-3">
                <h3 className="text-foreground shrink-0 text-xl font-semibold">Change details</h3>
                <Separator className="flex-1" />
              </div>
              {task.returnComment && (
                <div className="mt-4 rounded-xl border border-[#F9D4E0] bg-[#FFF5F7] px-4 py-3">
                  <p className="text-muted-foreground mb-1 text-xs font-medium">
                    Reason for return
                  </p>
                  <p className="text-foreground text-sm">{task.returnComment}</p>
                </div>
              )}
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
                  <TaskChangeItem
                    key={change.id ?? `change-${index}`}
                    itemId={change.id ?? `change-${index}`}
                    change={change}
                    taskId={task.id}
                    canComment={isApprover}
                  />
                ))}
              </Accordion>
            </section>
          ) : undefined
        }
        workflowHistory={workflowHistory}
        onWorkflowHistoryOpen={handleWorkflowHistoryOpen}
        footer={
          isApprover ? (
            <div className="border-border bg-background absolute right-0 bottom-0 left-0 border-t p-6">
              <TaskActionFooter
                disabled={actionLoading}
                onCancel={() => onOpenChange(false)}
                onReturn={() => setReturnOpen(true)}
                onReject={() => setRejectOpen(true)}
                onApprove={() => setApproveOpen(true)}
              />
            </div>
          ) : undefined
        }
      />

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
