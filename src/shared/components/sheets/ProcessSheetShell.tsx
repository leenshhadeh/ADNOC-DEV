import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'

import ActionSheet from '@/shared/components/ActionSheet'
import { Separator } from '@/shared/components/ui/separator'
import WorkflowHistoryPanel from '@/shared/components/WorkflowHistoryPanel'
import type { WorkflowHistoryEntry } from '@/shared/components/WorkflowHistoryPanel'
import { cn } from '@/shared/lib/utils'

export interface ProcessSheetShellProps {
  // ActionSheet
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  large?: boolean

  // Left action link (right is always "View workflow history")
  primaryLink: React.ReactNode

  // Optional badge rendered above the action links row (e.g. processCategory)
  headerBadge?: React.ReactNode

  // Stage card — rendered above the stepper inside the card
  stageCurrent?: number
  stageTotal?: number
  stageBadge?: React.ReactNode
  stepper: React.ReactNode
  expandedContent: React.ReactNode

  // Below the stage card
  changeSection?: React.ReactNode

  // Workflow history
  workflowHistory: WorkflowHistoryEntry[]
  onWorkflowHistoryOpen?: () => void

  // Optional sticky footer (rendered outside scrollable area)
  footer?: React.ReactNode
}

const ProcessSheetShell = ({
  title,
  open,
  onOpenChange,
  large,
  primaryLink,
  headerBadge,
  stageCurrent,
  stageTotal,
  stageBadge,
  stepper,
  expandedContent,
  changeSection,
  workflowHistory,
  onWorkflowHistoryOpen,
  footer,
}: ProcessSheetShellProps) => {
  const [showMore, setShowMore] = useState(false)
  const [showWorkflowHistory, setShowWorkflowHistory] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setShowMore(false)
      setShowWorkflowHistory(false)
    }
    onOpenChange(nextOpen)
  }

  const handleViewWorkflowHistory = () => {
    setShowWorkflowHistory(true)
    onWorkflowHistoryOpen?.()
  }

  return (
    <ActionSheet title={title} open={open} onOpenChange={handleOpenChange} large={large}>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className={cn('flex-1 overflow-y-auto p-3 sm:p-4', footer ? 'pb-28' : '')}>
          {/* Action links */}
          {headerBadge && <div className="mb-3">{headerBadge}</div>}
          <div className="flex flex-col gap-2 pe-2 sm:grid sm:grid-cols-2">
            {primaryLink}
            <button
              type="button"
              className="text-brand-blue inline-flex items-center gap-1.5 text-sm font-medium hover:underline sm:justify-end"
              onClick={handleViewWorkflowHistory}
            >
              <Clock className="size-4" />
              View workflow history
            </button>
          </div>

          {stageCurrent !== undefined && stageTotal !== undefined && (
            <div className="mt-4 flex items-center gap-2">
              <p className="text-foreground text-md font-medium">
                Stage {stageCurrent}/{stageTotal}
              </p>
              {stageBadge}
            </div>
          )}

          {/* Stage card */}
          <div className="mt-2 rounded-2xl p-3 px-3 shadow-[7px_8px_28px_0px_rgba(0,0,0,0.2)] sm:px-4">
            {stepper}
            <div className="mt-4 flex flex-col">
              <Separator />
              <button
                type="button"
                className="text-brand-blue mx-auto flex w-full items-center justify-center gap-1 py-2 text-sm font-medium"
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
                <Separator />
                {expandedContent}
              </>
            )}
          </div>

          {changeSection}
        </div>

        {/* ── Optional sticky footer ───────────────────────────────────────── */}
        {footer}

        {/* ── Workflow history overlay ──────────────────────────────────────── */}
        {showWorkflowHistory && (
          <WorkflowHistoryPanel
            items={workflowHistory}
            onClose={() => setShowWorkflowHistory(false)}
          />
        )}
      </div>
    </ActionSheet>
  )
}

export default ProcessSheetShell
