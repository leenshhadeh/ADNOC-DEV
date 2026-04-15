import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown, ChevronRight, ChevronUp, Eye } from 'lucide-react'

import ActionSheet from '@/shared/components/ActionSheet'
import { Accordion, AccordionContent, AccordionItem } from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'

import WorkflowStepper from '@/shared/components/WorkFlowStepper'
import { DOMAINS_DATA } from '@features/module-process-catalog/constants/domains-data'
import PrimaryInformation from '../processDetails/processOpportunties/PrimaryInformation'
import EstimationAndPrioritization from '../processDetails/processOpportunties/EstimationAndPrioritization'
import ValueEstimation from '../processDetails/processOpportunties/ValueEstimation'

const WORKFLOW_STEPS = [
  { id: 'step1', title: 'Draft updates', status: 'completed', owner: 'Business FP' },
  {
    id: 'step2',
    title: 'Custodian approval',
    status: 'active',
    owner: 'Digital FP',
    progress: '40%',
  },
  { id: 'step3', title: 'Program manager signoff', status: '' },
]

function OpportunityAccordionItem({ title }: { title: string }) {
  return (
    <AccordionItem value={title}>
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'group/ch flex flex-1 items-start gap-2 py-3 text-start outline-none',
            'focus-visible:ring-ring focus-visible:rounded focus-visible:ring-2',
          )}
        >
          <ChevronRight className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/ch:-rotate-90" />
          <div className="min-w-0 flex-1">{title}</div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* Expanded — two labeled value boxes */}
      <AccordionContent className="ps-6">
        {title == 'Primary Information' && <PrimaryInformation />}
        {title == 'Estimation And Prioritization' && <EstimationAndPrioritization />}
        {title == 'Value Estimation' && <ValueEstimation />}
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
  title: string
}

const OpportunityDetailsSheet = ({ request, open, onOpenChange , title }: RequestDetailsSheetProps) => {
  // const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)

  // Reset sub-panel state when the sheet closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShowMore(false)
    }
    onOpenChange(isOpen)
  }

  return (
    <ActionSheet
      title={title}
      open={open}
      onOpenChange={handleOpenChange}
      large
    >
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

              {/* TODO: to be added after implementing the opportunity table  */}
              <div className="grid grid-cols-2">
                {/* <button
                  type="button"
                  className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  onClick={() => {
                    if (request.processId) {
                      onOpenChange(false)
                      navigate(`/opportunity-data/opportunity/${request.processId}`)
                    }
                  }}> 
                    <Eye className="size-4" />
                  View full card
                </button> */}
              </div>
            </div>

            {/* Stage card */}
            <div className="border-border bg-card mt-6 rounded-2xl border p-4 shadow-[0_4px_8px_0_#d1d5df80]">
              {/* Stage header */}
              <div className="mb-4 flex items-center gap-2">
                <p className="text-foreground text-lg font-semibold">
                  Stage {request.stageCurrent || 1}/{request.stageTotal || 1}
                </p>
                <Badge className="h-6 rounded-full border-transparent bg-[#F8E7DA] px-2.5 text-xs font-medium text-[#6E4C33]">
                  {request.stageText || 'Draft'}
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
                      Opportunity details
                    </p>
                    <div className="grid grid-cols-2">
                      <div className="border-border border-r border-b pe-4 pb-3">
                        <p className="text-muted-foreground text-xs">Domain</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {DOMAINS_DATA.find((d) => d.id === request.domain)?.name ??
                            request.domain ??
                            '—'}
                        </p>
                      </div>
                      <div className="border-border border-b ps-4 pb-3">
                        <p className="text-muted-foreground text-xs">Opportunity Source</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {request.processLevel ?? '—'}
                        </p>
                      </div>
                      <div className="border-border border-r pe-4 pt-3">
                        <p className="text-muted-foreground text-xs">GC Owner</p>
                        <p className="text-foreground mt-0.5 font-semibold">
                          {request.level1 ?? '—'}
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

            <section className="mt-6">
              <Accordion type="single" collapsible className="mt-3 w-full">
                {/* TODO: to be updated after implemeting the opportunites data  */}
                
                <OpportunityAccordionItem title="Primary Information" />
                <OpportunityAccordionItem title="Estimation And Prioritization" />
                <OpportunityAccordionItem title="Value Estimation" />
              </Accordion>
            </section>
          </div>
        </div>
      ) : null}
    </ActionSheet>
  )
}

export default OpportunityDetailsSheet
