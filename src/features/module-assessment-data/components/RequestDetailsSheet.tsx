import { useState } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Eye,
  X,
} from 'lucide-react'

import ActionSheet from '@/shared/components/ActionSheet'
import { Accordion, AccordionContent, AccordionItem } from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'

import type {
  RequestItem,
  WorkflowHistoryItem,
} from '@features/module-process-catalog/types/submitted-requests'
import WorkflowStepper from '@/shared/components/WorkFlowStepper'

const WORKFLOW_STEPS = [
  { id: 'step1', title: 'Draft updates', status: 'completed', owner: 'Business FP' },
  { id: 'step2', title: 'Draft Submit', status: 'active', owner: 'Digital FP', progress: '40%' },
  { id: 'step3', title: 'Quality review', status: '' },
  { id: 'step4', title: 'Digital VP signoff', status: '' },
]

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
          {/* Chevron LEFT — rotates to ∧ when open */}
          <ChevronRight className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/ch:-rotate-90" />

          <div className="min-w-0 flex-1">
            {/* Label — always visible */}
            <p className="text-foreground font-semibold">{change.label}</p>
            {/* Collapsed preview — hidden when open */}
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm group-data-[state=open]/ch:hidden">
              <span>Old Value: {truncate(change.oldValue)}</span>
              <ArrowRight className="size-3 shrink-0" />
              <span>New Value: {truncate(change.newValue)}</span>
            </p>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* Expanded — two labeled value boxes */}
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
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface RequestDetailsSheetProps {
  // request: RequestItem | null
  request: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RequestDetailsSheet = ({ request, open, onOpenChange }: RequestDetailsSheetProps) => {
  const [showMore, setShowMore] = useState(false)
  const [showWorkflowHistory, setShowWorkflowHistory] = useState(false)

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
              {request.processCategory && (
                <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm font-medium">
                  {request.processCategory}
                </Badge>
              )}
              <div className="grid grid-cols-2">
                <button
                  type="button"
                  className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                >
                  <Eye className="size-4" />
                  View full card
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
            <div className="border-border bg-card mt-6 rounded-2xl border p-4 shadow-[0_4px_8px_0_#d1d5df80]">
              {/* Stage header */}
              <div className="mb-4 flex items-center gap-2">
                <p className="text-foreground text-lg font-semibold">
                  Stage {request.stageCurrent}/{request.stageTotal}
                </p>
                <Badge className="h-6 rounded-full border-transparent bg-[#F8E7DA] px-2.5 text-xs font-medium text-[#6E4C33]">
                  {request.stageText}
                </Badge>
              </div>

              {/* Horizontal stepper */}
              <WorkflowStepper steps={WORKFLOW_STEPS} />

              <Separator className="my-4" />

              {/* More / Hide toggle */}
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
                        <p className="text-muted-foreground text-xs">Domain</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {request.domain ?? '—'}
                        </p>
                      </div>
                      <div className="border-border border-b ps-4 pb-3">
                        <p className="text-muted-foreground text-xs">Process Level</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {request.processLevel ?? '—'}
                        </p>
                      </div>
                      <div className="border-border border-r pe-4 pt-3">
                        <p className="text-muted-foreground text-xs">Level 1</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {request.level1 ?? '—'}
                        </p>
                      </div>
                      <div className="ps-4 pt-3">
                        <p className="text-muted-foreground text-xs">Level 2</p>
                        <p className="text-foreground mt-0.5 font-semibold">
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
                        <p className="text-muted-foreground text-xs">Requester</p>
                        <p className="text-foreground mt-0.5 font-semibold">{request.requester}</p>
                      </div>
                      <div className="ps-4">
                        <p className="text-muted-foreground text-xs">Business focal point</p>
                        <p className="text-foreground mt-0.5 font-semibold">
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
                <h3 className="text-foreground shrink-0 text-xl font-semibold">Change details</h3>
                <Separator className="flex-1" />
              </div>

              <Accordion type="single" collapsible className="mt-3 w-full">
                {request.changes.map((change: any) => (
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
