import { Badge } from '@/shared/components/ui/badge'
import ActionSheet from '@/shared/components/ActionSheet'
import type { OpportunityItem } from '../../types'

interface OpportunityDetailsSheetProps {
  opportunity: OpportunityItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const priorityStyles: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-green-100 text-green-700',
}

const statusStyles: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-700',
  Planned: 'bg-violet-100 text-violet-700',
  Evaluation: 'bg-amber-100 text-amber-700',
}

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4 border-b border-[#DFE3E6] py-3 last:border-b-0">
    <span className="w-40 shrink-0 text-sm font-medium text-[#687076]">{label}</span>
    <span className="text-foreground text-sm">{children}</span>
  </div>
)

const OpportunityDetailsSheet = ({
  opportunity,
  open,
  onOpenChange,
}: OpportunityDetailsSheetProps) => {
  return (
    <ActionSheet
      title={opportunity?.title ?? 'Opportunity Details'}
      open={open}
      onOpenChange={onOpenChange}
      large
    >
      {opportunity ? (
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <InfoRow label="Type">{opportunity.type}</InfoRow>

          <InfoRow label="Status">
            <Badge
              className={`rounded-full border-transparent px-2.5 text-xs font-normal ${statusStyles[opportunity.status] ?? 'bg-gray-100 text-gray-700'}`}
            >
              {opportunity.status}
            </Badge>
          </InfoRow>

          <InfoRow label="Priority">
            <Badge
              className={`rounded-full border-transparent px-2.5 text-xs font-normal ${priorityStyles[opportunity.priority] ?? 'bg-gray-100 text-gray-700'}`}
            >
              {opportunity.priority}
            </Badge>
          </InfoRow>

          <InfoRow label="Estimated Savings">{opportunity.estimatedSavings}</InfoRow>

          <InfoRow label="Description">
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
              {opportunity.description}
            </p>
          </InfoRow>
        </div>
      ) : null}
    </ActionSheet>
  )
}

export default OpportunityDetailsSheet
