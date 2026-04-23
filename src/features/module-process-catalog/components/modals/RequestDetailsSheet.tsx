import { useState } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ArrowRight, Check, ChevronDown, ChevronUp, Clock, Eye, X } from 'lucide-react'

import ActionSheet from '@/shared/components/ActionSheet'
import { Accordion, AccordionContent, AccordionItem } from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'

import { useCatalogNavStore } from '@features/module-process-catalog/store/useCatalogNavStore'
import type {
  RequestItem,
  WorkflowHistoryItem,
} from '@features/module-process-catalog/types/submitted-requests'

// ── Step definitions (3-step standard workflow) ───────────────────────────────

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
        // Connector after this step is blue only if this step is already completed.
        const lineBlue = isCompleted

        return (
          <div key={stepIndex} className={cn('flex flex-col', isLast ? '' : 'flex-1')}>
            {/* Node + connector row */}
            <div className="flex items-center">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full border-2',
                  isCompleted || isActive
                    ? 'border-[#0047BB] bg-[#EFF6FF]'
                    : 'border-[#D1D5DB] bg-white',
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 text-[#0047BB]" strokeWidth={2.5} />
                ) : isActive ? (
                  <div className="size-4 rounded-full bg-[#c7dcf7]" />
                ) : (
                  <div className="size-4 rounded-full bg-[#F1F5F9]" />
                )}
              </div>
              {!isLast && (
                <div className={cn('h-0.5 flex-1', lineBlue ? 'bg-[#0047BB]' : 'bg-[#D1D5DB]')} />
              )}
            </div>
            {/* Labels */}
            <div className="mt-2 max-w-[100px]">
              <p className="text-muted-foreground text-[8px] font-normal tracking-wide uppercase">
                STEP {stepIndex}/{steps.length}
              </p>
              <p
                className={cn(
                  'text-xs leading-4',
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground font-medium',
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
// Rendered as absolute overlay within the sheet body — does not cover the sheet header.

function WorkflowHistoryPanel({
  items,
  onClose,
}: {
  items: WorkflowHistoryItem[]
  onClose: () => void
}) {
  return (
    <div className="bg-background absolute inset-0 z-20 flex flex-col">
      {/* Panel header */}
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

      {/* Scrollable timeline */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No workflow history available.</p>
        ) : (
          <ol>
            {items.map((item, i) => (
              <li key={item.id} className="flex gap-4">
                {/* Dot column — dot + vertical line below it */}
                <div className="flex flex-col items-center">
                  <div className="mt-1 size-3.5 shrink-0 rounded-full bg-[#0047BB]" />
                  {i < items.length - 1 && <div className="bg-border mt-1 w-0.5 flex-1" />}
                </div>
                {/* Event content */}
                <div className="flex-1 pb-6">
                  <p className="text-foreground font-semibold">{item.action}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{item.date}</p>
                  <p className="mt-0.5 text-sm">
                    <span className="text-foreground font-semibold">{item.userName}</span>
                    <span className="text-muted-foreground">– {item.userRole}</span>
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
// Custom trigger: chevron on LEFT, closed-state old→new preview, open-state value boxes.

function ChangeAccordionItem({ change }: { change: RequestItem['changes'][number] }) {
  const truncate = (str: string, n = 18) => (str.length > n ? str.slice(0, n) + '…' : str)

  return (
    <AccordionItem value={change.id}>
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'group/ch flex flex-1 items-start gap-2 py-3 text-start outline-none',
            'focus-visible:ring-ring focus-visible:rounded focus-visible:ring-2',
          )}
        >
          {/* Chevron — points down when collapsed, up when open */}
          <ChevronDown className="text-muted-foreground mt-0.5 size-5 shrink-0 transition-transform duration-200 group-data-[state=open]/ch:rotate-180" />

          <div className="min-w-0 flex-1">
            {/* Label — always visible */}
            <p className="text-foreground text-base font-medium">{change.label}</p>
            {/* Collapsed preview — hidden when open */}
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm font-light group-data-[state=open]/ch:hidden">
              <span>Old Value: {truncate(change.oldValue)}</span>
              <ArrowRight className="size-3 shrink-0" />
              <span>New Value: {truncate(change.newValue)}</span>
            </p>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* Expanded — two labeled value boxes */}
      <AccordionContent className="ps-7">
        <div className="flex flex-col gap-6 pb-4">
          <div>
            <p className="mb-2 text-base font-normal text-[#889096]">Old Value</p>
            <div className="bg-accent min-h-10 rounded-2xl border border-[#DFE3E6] px-6 py-3 text-base font-medium text-[#889096]">
              {change.oldValue}
            </div>
          </div>
          <div>
            <p className="mb-2 text-base font-normal text-[#889096]">New Value</p>
            <div className="bg-accent min-h-10 rounded-2xl border border-[#DFE3E6] px-6 py-4 text-base leading-6 font-medium text-[#889096]">
              {change.newValue}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface RequestDetailsSheetProps {
  request: RequestItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RequestDetailsSheet = ({ request, open, onOpenChange }: RequestDetailsSheetProps) => {
  const [showMore, setShowMore] = useState(false)
  const [showWorkflowHistory, setShowWorkflowHistory] = useState(false)
  const navigateToProcess = useCatalogNavStore((s) => s.navigateToProcess)

  // Reset sub-panel state when the sheet closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowMore(false)
      setShowWorkflowHistory(false)
    }
    onOpenChange(isOpen)
  }

  return (
    <ActionSheet title={request?.processName ?? ''} open={open} onOpenChange={handleOpenChange}>
      {request ? (
        // relative + overflow-hidden so the workflow-history overlay stays within the body
        <div className="relative flex-1 overflow-hidden">
          {/* ── Main scrollable body ──────────────────────────────────────── */}
          <div className="h-full overflow-y-auto p-6">
            {/* Badge + action links */}
            <div className="space-y-3 pe-2">
              {/* {request.processCategory && (
                <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm font-medium">
                  {request.processCategory}
                </Badge>
              )} */}
              <div className="grid grid-cols-2">
                <button
                  type="button"
                  className="text-sidebar-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!request.processId}
                  onClick={() => {
                    if (request.processId) {
                      navigateToProcess(request.processId)
                      onOpenChange(false)
                    }
                  }}
                >
                  <Eye className="size-4" />
                  Go to affected record
                </button>
                <button
                  type="button"
                  className="text-sidebar-primary inline-flex items-center justify-end gap-1.5 text-sm font-medium hover:underline"
                  onClick={() => setShowWorkflowHistory(true)}
                >
                  <Clock className="size-4" />
                  View workflow history
                </button>
              </div>
            </div>
            {/* Stage header */}
            <div className="mt-4 flex items-center gap-2">
              <p className="text-foreground text-md font-medium">
                Stage {request.stageCurrent}/{request.stageTotal}
              </p>
              <Badge className="h-6 rounded-full border-transparent bg-[#FEE5D3] px-1.5 text-xs font-normal text-[#151718]">
                {request.stageText}
              </Badge>
            </div>
            {/* Stage card */}
            <div
              className="mt-2 rounded-2xl p-3 px-4"
              style={{
                // background: 'linear-gradient(180deg, #E9EFFF 0%, #FFFFFF 92%)',
                boxShadow: '7px 8px 28px 0px rgba(0,0,0,0.2)',
              }}
            >
              {/* Horizontal stepper */}
              <WorkflowStepper currentStep={request.stageCurrent} totalSteps={request.stageTotal} />

              <Separator className="my-4" />

              {/* More / Hide toggle */}
              <button
                type="button"
                className="text-sidebar-primary mx-auto flex w-full items-center justify-center gap-1 text-sm font-medium"
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

              {/* Expanded process details */}
              {showMore && (
                <>
                  <Separator className="my-4" />

                  {/* Process details grid */}
                  <section>
                    <p className="text-muted-foreground mb-3 text-sm font-medium">
                      Process details
                    </p>
                    <div className="grid grid-cols-2">
                      <div className="border-border border-r border-b pe-4 pb-3">
                        <p className="text-muted-foreground text-sm font-light">Domain</p>
                        <p className="text-foreground mt-0.5 text-sm font-medium">
                          {request.domain ?? '—'}
                        </p>
                      </div>
                      <div className="border-border border-b ps-4 pb-3">
                        <p className="text-muted-foreground text-sm font-light">Process Level</p>
                        <p className="text-foreground mt-0.5 text-sm font-medium">
                          {request.processLevel ?? '—'}
                        </p>
                      </div>
                      <div className="border-border border-r pe-4 pt-3">
                        <p className="text-muted-foreground text-sm font-light">Level 1</p>
                        <p className="text-foreground mt-0.5 text-sm font-medium">
                          {request.level1 ?? '—'}
                        </p>
                      </div>
                      <div className="ps-4 pt-3">
                        <p className="text-muted-foreground text-sm font-light">Level 2</p>
                        <p className="text-foreground mt-0.5 text-sm font-medium">
                          {request.level2 ?? '—'}
                        </p>
                      </div>
                    </div>
                  </section>

                  <Separator className="my-4" />

                  {/* People involved grid */}
                  <section>
                    <p className="text-muted-foreground mb-3 text-sm font-medium">
                      People Involved
                    </p>
                    <div className="grid grid-cols-2">
                      <div className="border-border border-r pe-4">
                        <p className="text-muted-foreground text-sm font-light">Requester</p>
                        <p className="text-foreground mt-0.5 text-sm font-medium">
                          {request.requester}
                        </p>
                      </div>
                      <div className="ps-4">
                        <p className="text-muted-foreground text-sm font-light">
                          Business focal point
                        </p>
                        <p className="text-foreground mt-0.5 text-sm font-medium">
                          {request.businessFocalPoint ?? request.approver}
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Change details section */}
            <section className="mt-6">
              <div className="flex items-center gap-3">
                <h3 className="text-foreground shrink-0 text-base font-medium">Change details</h3>
                <Separator className="flex-1" />
              </div>

              <Accordion type="single" collapsible className="mt-3 w-full">
                {request.changes.map((change) => (
                  <ChangeAccordionItem key={change.id} change={change} />
                ))}
              </Accordion>
            </section>
          </div>

          {/* ── Workflow history overlay ──────────────────────────────────── */}
          {showWorkflowHistory && (
            <WorkflowHistoryPanel
              items={request.workflowHistory ?? []}
              onClose={() => setShowWorkflowHistory(false)}
            />
          )}
        </div>
      ) : null}
    </ActionSheet>
  )
}

export default RequestDetailsSheet
