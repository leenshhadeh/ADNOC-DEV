import { useState } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import type { AutomationProcessDetail, OpportunityItem } from '../../../types'
import OpportunityDetailsSheet from '../../sidePanels/OpportunityDetailsSheet'

interface OpportunitiesTabProps {
  process: AutomationProcessDetail
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

const OpportunitiesTab = ({ process }: OpportunitiesTabProps) => {
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleRowClick = (opp: OpportunityItem) => {
    setSelectedOpp(opp)
    setSheetOpen(true)
  }

  return (
    <div>
      <h3 className="text-foreground mb-4 text-lg font-semibold">Opportunities</h3>

      {process.opportunities.length === 0 ? (
        <p className="text-muted-foreground text-sm">No opportunities identified yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#DFE3E6]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DFE3E6] bg-[#F1F3F5]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#687076] uppercase">
                  Estimated Savings
                </th>
              </tr>
            </thead>
            <tbody>
              {process.opportunities.map((opp) => (
                <tr
                  key={opp.id}
                  className="cursor-pointer border-b border-[#DFE3E6] transition-colors last:border-b-0 hover:bg-[#F8F9FA]"
                  onClick={() => handleRowClick(opp)}
                >
                  <td className="text-foreground px-4 py-3 font-medium">{opp.title}</td>
                  <td className="text-muted-foreground px-4 py-3">{opp.type}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`rounded-full border-transparent px-2.5 text-xs font-normal ${statusStyles[opp.status] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {opp.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`rounded-full border-transparent px-2.5 text-xs font-normal ${priorityStyles[opp.priority] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {opp.priority}
                    </Badge>
                  </td>
                  <td className="text-foreground px-4 py-3">{opp.estimatedSavings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Opportunity detail side-panel ──────────────────────────────── */}
      <OpportunityDetailsSheet
        opportunity={selectedOpp}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}

export default OpportunitiesTab
