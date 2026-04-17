import { useState } from 'react'
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import ActionSheet from '@/shared/components/ActionSheet'
import WorkflowStepper from '@/shared/components/WorkFlowStepper'
import { cn } from '@/shared/lib/utils'
import type { OpportunityItem } from '../../types'

interface OpportunityDetailsSheetProps {
  opportunity: OpportunityItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const stageStatusStyles: Record<string, string> = {
  'Pending approval': 'bg-[#FEE5D3] text-foreground',
  Published: 'bg-[#DFEBFF] text-foreground',
  Draft: 'bg-accent text-foreground',
}

const DisabledField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2">
    <span className="text-base text-[#889096]">{label}</span>
    <div className="border-border bg-accent flex h-12 items-center rounded-2xl border px-4">
      <span className="truncate text-base font-medium text-[#889096]">{value}</span>
    </div>
  </div>
)

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const CollapsibleSection = ({ title, children, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-border border-b py-4 last:border-b-0">
      <button className="flex w-full items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <ChevronRight
          className={cn('text-foreground size-5 transition-transform', isOpen && 'rotate-90')}
        />
        <span className="text-foreground text-base font-medium">{title}</span>
      </button>
      {isOpen && <div className="mt-4 flex flex-col gap-4 pl-7">{children}</div>}
    </div>
  )
}

const OpportunityDetailsSheet = ({
  opportunity,
  open,
  onOpenChange,
}: OpportunityDetailsSheetProps) => {
  const [showMoreStepper, setShowMoreStepper] = useState(false)

  return (
    <ActionSheet
      title={opportunity?.title ?? 'Opportunity Details'}
      open={open}
      onOpenChange={onOpenChange}
      large
    >
      {opportunity ? (
        <div className="flex-1 overflow-y-auto">
          {/* View full card link */}
          <div className="px-6">
            <button className="text-sidebar-primary flex items-center gap-1 text-sm font-medium">
              <ExternalLink className="size-4" />
              View full card
            </button>
          </div>

          {/* Stage + Stepper section */}
          <div className="flex flex-col gap-3 px-6 pt-6">
            {/* Stage status row */}
            <div className="flex items-center gap-2">
              <span className="text-foreground text-base font-medium">
                Stage {opportunity.stageCurrent}/{opportunity.stageTotal}
              </span>
              <Badge
                className={`rounded-full border-transparent px-1.5 text-xs font-normal ${stageStatusStyles[opportunity.stageStatus] ?? 'bg-accent text-foreground'}`}
              >
                {opportunity.stageStatus}
              </Badge>
            </div>

            {/* Stepper card */}
            {opportunity.workflowSteps.length > 0 && (
              <div
                className="flex flex-col gap-8 rounded-2xl px-4 py-3 shadow-[7px_8px_28px_0px_rgba(0,0,0,0.2)]"
                style={{
                  backgroundImage:
                    'linear-gradient(-90deg, rgb(233, 239, 255) 105%, rgb(255, 255, 255) 25.8%)',
                }}
              >
                <WorkflowStepper steps={opportunity.workflowSteps} />

                {/* Divider + More toggle */}
                <div className="flex flex-col items-center">
                  <div className="bg-border h-px w-full" />
                  <button
                    className="text-sidebar-primary flex items-center gap-1 pt-1 text-sm font-medium"
                    onClick={() => setShowMoreStepper(!showMoreStepper)}
                  >
                    {showMoreStepper ? 'Less' : 'More'}
                    <ChevronDown
                      className={cn('size-4 transition-transform', showMoreStepper && 'rotate-180')}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Accordion sections */}
          <div className="px-6 pt-12 pb-8">
            <CollapsibleSection title="Primary Information">
              <DisabledField label="Type" value={opportunity.type} />
              <DisabledField label="Status" value={opportunity.status} />
              <DisabledField label="Priority" value={opportunity.priority} />
              <DisabledField label="Domain" value={opportunity.domain} />
            </CollapsibleSection>

            <CollapsibleSection title="Estimation and Prioritization">
              <DisabledField label="Estimated Savings" value={opportunity.estimatedSavings} />
            </CollapsibleSection>

            <CollapsibleSection title="Value Estimation">
              <DisabledField label="Description" value={opportunity.description || '—'} />
            </CollapsibleSection>
          </div>
        </div>
      ) : null}
    </ActionSheet>
  )
}

export default OpportunityDetailsSheet
