import { CheckCircle2, ChevronDown, Eye, History, MoveRight } from 'lucide-react'

import ActionSheet from '@/shared/components/ActionSheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'

import type { RequestItem } from '@features/module-process-catalog/types/submitted-requests'

interface RequestDetailsSheetProps {
  request: RequestItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RequestDetailsSheet = ({ request, open, onOpenChange }: RequestDetailsSheetProps) => {
  const steps = [
    { index: 1, title: 'Draft updates' },
    { index: 2, title: 'Custodian approval' },
    { index: 3, title: 'Program manager signoff' },
  ]

  const currentStep = request?.stageCurrent ?? 1

  return (
    <ActionSheet title={request?.processName ?? ''} open={open} onOpenChange={onOpenChange}>
      {request ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3 pe-8">
            <div>
              <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm font-medium">
                Dashboard
              </Badge>
            </div>

            <div className="text-primary grid grid-cols-2 gap-4">
              <button
                type="button"
                className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                <Eye className="size-4" />
                Go to affected record
              </button>
              <button
                type="button"
                className="text-primary inline-flex items-center justify-end gap-1.5 text-sm font-medium hover:underline"
              >
                <History className="size-4" />
                View workflow history
              </button>
            </div>
          </div>

          <div className="border-border bg-card mt-6 rounded-2xl border p-4">
            <div className="mb-3 flex items-center gap-2">
              <p className="text-foreground text-lg font-semibold">
                Stage {request.stageCurrent}/{request.stageTotal}
              </p>
              <Badge className="h-6 rounded-full border-transparent bg-[#F8E7DA] px-2.5 text-xs font-medium text-[#6E4C33]">
                {request.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {steps.map((step) => {
                const isCompleted = step.index < currentStep
                const isActive = step.index === currentStep

                return (
                  <div key={step.index} className="text-start">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="grid size-8 place-items-center rounded-full border-2 border-[#CFE1F5] bg-white">
                        {isCompleted ? (
                          <CheckCircle2 className="size-5 text-[#0047BB]" />
                        ) : isActive ? (
                          <span className="size-4 animate-pulse rounded-full border-2 border-[#0047BB] bg-[#E8F0FF]" />
                        ) : (
                          <span className="size-4 rounded-full border-2 border-[#CFE1F5]" />
                        )}
                      </div>
                      {step.index < steps.length ? (
                        <div className="h-0.5 flex-1 bg-[#CFE1F5]" />
                      ) : null}
                    </div>
                    <p className="text-muted-foreground text-[0.7rem] uppercase">
                      STEP {step.index}/3
                    </p>
                    <p className="text-foreground text-sm leading-5 font-medium">{step.title}</p>
                  </div>
                )
              })}
            </div>

            <Separator className="my-4" />

            <button
              type="button"
              className="text-primary mx-auto inline-flex w-full items-center justify-center gap-1 text-sm font-medium"
            >
              More
              <ChevronDown className="size-4" />
            </button>
          </div>

          <section className="mt-6">
            <h3 className="text-foreground text-xl font-semibold">Change details</h3>

            <Accordion type="single" collapsible className="mt-3 w-full">
              {request.changes.map((change, index) => (
                <AccordionItem key={change.id} value={change.id}>
                  <AccordionTrigger className="py-4 text-lg font-semibold">
                    {change.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-start">
                      <div>
                        <p className="text-muted-foreground text-sm">Old Value:</p>
                        <p className="text-foreground truncate text-base">{change.oldValue}</p>
                      </div>

                      <MoveRight className="text-muted-foreground size-4" />

                      <div>
                        <p className="text-muted-foreground text-sm">New Value:</p>
                        <p className="text-foreground truncate text-base">{change.newValue}</p>
                      </div>
                    </div>
                  </AccordionContent>
                  {index === request.changes.length - 1 ? null : <Separator />}
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      ) : null}
    </ActionSheet>
  )
}

export default RequestDetailsSheet
