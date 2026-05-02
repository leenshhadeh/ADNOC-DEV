import { Button } from '@/shared/components/ui/button'
import type { OpportunityApplicability } from '../../types'
import UpDownArrows from '@/assets/icons/up-down-arrows.svg?react'

interface OpportunityApplicabilityCellProps {
  applicability: OpportunityApplicability
}

const OpportunityApplicabilityCell = ({ applicability }: OpportunityApplicabilityCellProps) => {
  const { proposedTo, acceptedBy } = applicability

  return (
    <div className="flex items-center gap-0">
      <div className="flex items-center gap-2 pr-3">
        <span className="text-muted-foreground text-sm">Proposed to:</span>
        <span className="text-foreground text-sm font-semibold">{proposedTo}</span>
      </div>

      <div className="bg-border h-[18px] w-px shrink-0" />

      <div className="flex items-center gap-2 px-3">
        <span className="text-muted-foreground text-sm">Accepted by:</span>
        <span className="text-status-positive text-sm font-semibold">{acceptedBy}</span>
      </div>
      <div className="bg-border h-[18px] w-px shrink-0" />

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="text-muted-foreground hover:bg-sidebar-accent ml-1 shrink-0 rounded-full p-4"
        aria-label="Expand applicability details"
      >
        <UpDownArrows className="size-[17.5px]" />
      </Button>
    </div>
  )
}

export default OpportunityApplicabilityCell
