import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ArrowRight, Check, ChevronDown, Eye } from 'lucide-react'

import { StatusBadgeCell } from '@/shared/components/cells'
import type { CatalogStatus } from '@/shared/components/cells'
import ProcessSheetShell from '@/shared/components/sheets/ProcessSheetShell'
import { Accordion, AccordionContent, AccordionItem } from '@/shared/components/ui/accordion'
import { Separator } from '@/shared/components/ui/separator'
import type { WorkflowHistoryEntry } from '@/shared/components/WorkflowHistoryPanel'
import { cn } from '@/shared/lib/utils'

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

function ChangeAccordionItem({ change }: { change: ChangeItem }) {
  const truncate = (str: string, n = 18) => (str.length > n ? str.slice(0, n) + '…' : str)

  return (
    <AccordionItem value={change.id} className="border-border border-b">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'group/ch flex flex-1 items-start gap-2 py-3 text-start outline-none',
            'focus-visible:ring-ring focus-visible:rounded focus-visible:ring-2',
          )}
        >
          <ChevronDown className="text-muted-foreground mt-0.5 size-5 shrink-0 transition-transform duration-200 group-data-[state=open]/ch:rotate-180" />
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-base font-medium">{change.label}</p>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm font-light group-data-[state=open]/ch:hidden">
              <span>Old: {truncate(change.oldValue || '—')}</span>
              <ArrowRight className="size-3 shrink-0" />
              <span>New: {truncate(change.newValue || '—')}</span>
            </p>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionContent className="ps-7">
        <div className="flex flex-col gap-6 pb-4">
          <div>
            <p className="text-muted-foreground mb-2 text-base font-normal">Old Value</p>
            <div className="bg-accent text-muted-foreground border-border min-h-10 rounded-2xl border px-6 py-3 text-base font-medium">
              {change.oldValue || '—'}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-base font-normal">New Value</p>
            <div className="bg-accent text-muted-foreground border-border min-h-10 rounded-2xl border px-6 py-4 text-base leading-6 font-medium">
              {change.newValue || '—'}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
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
              className="[&>*:first-child]:border-border mt-3 w-full [&>*:first-child]:border-t"
            >
              {changes.map((change) => (
                <ChangeAccordionItem key={change.id} change={change} />
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
