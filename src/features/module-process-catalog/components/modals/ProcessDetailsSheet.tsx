import { Check, Eye } from 'lucide-react'

import { StatusBadgeCell } from '@/shared/components/cells'
import type { CatalogStatus } from '@/shared/components/cells'
import ProcessSheetShell from '@/shared/components/sheets/ProcessSheetShell'
import { Accordion } from '@/shared/components/ui/accordion'
import { Separator } from '@/shared/components/ui/separator'
import type { WorkflowHistoryEntry } from '@/shared/components/WorkflowHistoryPanel'
import { cn } from '@/shared/lib/utils'
import ChangeAccordionItem from '@/shared/components/ChangeAccordionItem'

// ── Step definitions ──────────────────────────────────────────────────────────

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

        return (
          <div key={stepIndex} className={cn('flex flex-col', isLast ? '' : 'flex-1')}>
            {/* Node + connector row */}
            <div className="flex items-center">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full border-2',
                  isCompleted || isActive
                    ? 'border-brand-blue bg-[#EFF6FF]'
                    : 'border-border bg-background',
                )}
              >
                {isCompleted ? (
                  <Check className="text-brand-blue size-4" strokeWidth={2.5} />
                ) : isActive ? (
                  <div className="bg-brand-blue/30 size-4 rounded-full" />
                ) : (
                  <div className="bg-muted size-4 rounded-full" />
                )}
              </div>
              {!isLast && (
                <div className={cn('h-0.5 flex-1', isCompleted ? 'bg-brand-blue' : 'bg-border')} />
              )}
            </div>
            {/* Labels */}
            <div className="mt-2 max-w-[100px]">
              <p className="text-muted-foreground text-[8px] font-normal tracking-wide uppercase">
                STEP {stepIndex}/{steps.length}
              </p>
              <p
                className={cn(
                  'text-xs leading-4 font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
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

// ── ChangeAccordionItem ───────────────────────────────────────────────────────

/**
 * Normalized change item — both wrappers map their domain types to this shape
 * before passing to ProcessDetailsSheet.
 */
export interface ChangeItem {
  id: string
  label: string
  oldValue: string
  newValue: string
}

// ── ProcessDetailsSheet ───────────────────────────────────────────────────────

export interface ProcessDetailsSheetProps {
  // ── Shell ──────────────────────────────────────────────────────────────────
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void

  // ── Navigation ─────────────────────────────────────────────────────────────
  /** ID of the linked catalog process — enables the "Go to affected record" button. */
  processId?: string
  /** Called when "Go to affected record" is clicked (sheet closes automatically). */
  onGoToRecord?: () => void

  // ── Stage ──────────────────────────────────────────────────────────────────
  stageCurrent: number
  stageTotal: number
  stageText: string

  // ── Content slots ──────────────────────────────────────────────────────────
  /**
   * Content rendered inside the "More" expanded section of the stage card.
   * Each wrapper provides its own domain/level/people grid here.
   */
  detailsGrid: React.ReactNode

  changes: ChangeItem[]
  workflowHistory: WorkflowHistoryEntry[]

  /** Optional badge rendered above the action links (e.g. processCategory). */
  headerBadge?: React.ReactNode
  /** Label for the primary nav button. Defaults to "Go to affected record". */
  primaryLinkLabel?: string
  /** Content rendered between the "Change details" heading and the accordion. */
  changesPreamble?: React.ReactNode

  /**
   * Optional sticky footer rendered below the scrollable body.
   * Pass `<PermissionGuard><TaskActionFooter /></PermissionGuard>` for task sheets.
   * Omit for read-only request sheets.
   */
  footer?: React.ReactNode
}

const ProcessDetailsSheet = ({
  title,
  open,
  onOpenChange,
  processId,
  onGoToRecord,
  stageCurrent,
  stageTotal,
  stageText,
  detailsGrid,
  changes,
  workflowHistory,
  headerBadge,
  primaryLinkLabel = 'Go to affected record',
  changesPreamble,
  footer,
}: ProcessDetailsSheetProps) => (
  <ProcessSheetShell
    title={title}
    open={open}
    onOpenChange={onOpenChange}
    headerBadge={headerBadge}
    primaryLink={
      <button
        type="button"
        className="text-brand-blue inline-flex items-center gap-1.5 text-sm font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!processId}
        onClick={() => {
          onGoToRecord?.()
          onOpenChange(false)
        }}
      >
        <Eye className="size-4" />
        {primaryLinkLabel}
      </button>
    }
    stageCurrent={stageCurrent}
    stageTotal={stageTotal}
    stageBadge={<StatusBadgeCell status={stageText as CatalogStatus} />}
    stepper={<WorkflowStepper currentStep={stageCurrent} totalSteps={stageTotal} />}
    expandedContent={detailsGrid}
    changeSection={
      changes.length > 0 || changesPreamble ? (
        <section className="mt-6">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground shrink-0 text-base font-medium">Change details</h3>
            <Separator className="flex-1" />
          </div>
          {changesPreamble}
          {changes.length > 0 && (
            <Accordion
              type="single"
              collapsible
              className="[&>*:first-child]:border-border mt-3 w-full"
            >
              {changes.map((change) => (
                <ChangeAccordionItem
                  key={change.id}
                  id={change.id}
                  label={change.label}
                  oldValue={change.oldValue}
                  newValue={change.newValue}
                />
              ))}
            </Accordion>
          )}
        </section>
      ) : undefined
    }
    workflowHistory={workflowHistory}
    footer={footer}
  />
)

export default ProcessDetailsSheet
