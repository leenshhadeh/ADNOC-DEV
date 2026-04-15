import type { AutomationProcessDetail } from '../../../types'

interface TargetRecommendationsTabProps {
  process: AutomationProcessDetail
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[280px_1fr] gap-4 border-b border-[#F1F3F5] py-3">
    <span className="text-sm font-medium text-[#687076]">{label}</span>
    <span className="text-foreground text-sm">{value || '—'}</span>
  </div>
)

const TargetRecommendationsTab = ({ process }: TargetRecommendationsTabProps) => {
  return (
    <div className="space-y-1">
      <h3 className="text-foreground mb-4 text-lg font-semibold">Target Recommendations</h3>
      <InfoRow label='"North Star" Target Automation' value={process.northStarTarget} />
      <InfoRow label="Target Automation Level (%)" value={process.targetAutomationLevelPercent} />
      <InfoRow label="To be AI Powered (Y/N)" value={process.toBeAIPowered} />
      <InfoRow label="To be AI Powered — Comments" value={process.toBeAIPoweredComments} />
      <InfoRow label="Rate Card (AED)" value={process.rateCardAED} />
      <InfoRow label="Cost of Manual Effort (AED)" value={process.costOfManualEffortAED} />
    </div>
  )
}

export default TargetRecommendationsTab
