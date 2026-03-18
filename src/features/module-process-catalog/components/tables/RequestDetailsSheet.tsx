import { CheckCircle2, ChevronDown, Eye, History, MoveRight } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"

import type { RequestItem } from "./SubmittedRequestsTable"

interface RequestDetailsSheetProps {
  request: RequestItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RequestDetailsSheet = ({ request, open, onOpenChange }: RequestDetailsSheetProps) => {
  const steps = [
    { index: 1, title: "Draft updates" },
    { index: 2, title: "Custodian approval" },
    { index: 3, title: "Program manager signoff" },
  ]

  const currentStep = request?.stageCurrent ?? 1

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-6 sm:max-w-[460px]">
        {request ? (
          <>
            <SheetHeader className="space-y-3 pe-8">
              <div className="flex items-start justify-between gap-3">
                <SheetTitle className="text-4xl/none font-semibold">{request.processName}</SheetTitle>
              </div>
              <SheetDescription className="text-start">
                <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm font-medium">
                  Dashboard
                </Badge>
              </SheetDescription>

              <div className="grid grid-cols-2 gap-4 text-primary">
                <button type="button" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <Eye className="size-4" />
                  Go to affected record
                </button>
                <button type="button" className="inline-flex items-center justify-end gap-1.5 text-sm font-medium text-primary hover:underline">
                  <History className="size-4" />
                  View workflow history
                </button>
              </div>
            </SheetHeader>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-lg font-semibold text-foreground">Stage {request.stageCurrent}/{request.stageTotal}</p>
                <Badge className="h-6 rounded-full border-transparent bg-[#F8E7DA] px-2.5 text-xs font-medium text-[#6E4C33]">
                  {request.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {steps.map(step => {
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
                        {step.index < steps.length ? <div className="h-0.5 flex-1 bg-[#CFE1F5]" /> : null}
                      </div>
                      <p className="text-[0.7rem] uppercase text-muted-foreground">STEP {step.index}/3</p>
                      <p className="text-sm font-medium leading-5 text-foreground">{step.title}</p>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-4" />

              <button type="button" className="mx-auto inline-flex w-full items-center justify-center gap-1 text-sm font-medium text-primary">
                More
                <ChevronDown className="size-4" />
              </button>
            </div>

            <section className="mt-6">
              <h3 className="text-xl font-semibold text-foreground">Change details</h3>

              <Accordion type="single" collapsible className="mt-3 w-full">
                {request.changes.map((change, index) => (
                  <AccordionItem key={change.id} value={change.id}>
                    <AccordionTrigger className="py-4 text-lg font-semibold">{change.label}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Old Value:</p>
                          <p className="truncate text-base text-foreground">{change.oldValue}</p>
                        </div>

                        <MoveRight className="size-4 text-muted-foreground" />

                        <div>
                          <p className="text-sm text-muted-foreground">New Value:</p>
                          <p className="truncate text-base text-foreground">{change.newValue}</p>
                        </div>
                      </div>
                    </AccordionContent>
                    {index === request.changes.length - 1 ? null : <Separator />}
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export default RequestDetailsSheet
