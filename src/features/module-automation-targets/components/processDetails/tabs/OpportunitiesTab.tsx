import { useState } from 'react'
import { Lock, Loader2 } from 'lucide-react'
import type { OpportunityItem } from '../../../types'
import { useGetOpportunities } from '../../../hooks/useGetOpportunities'
import OpportunityDetailsSheet from '../../sidePanels/OpportunityDetailsSheet'

interface OpportunitiesTabProps {
  processId: string
}

const OpportunitiesTab = ({ processId }: OpportunitiesTabProps) => {
  const { data: opportunities = [], isLoading } = useGetOpportunities(processId)
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleRowClick = (opp: OpportunityItem) => {
    setSelectedOpp(opp)
    setSheetOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Read-only badge */}
      <div className="bg-muted absolute -top-2 right-4 flex items-center gap-1.5 rounded-md px-2.5 py-1">
        <Lock className="text-muted-foreground size-3" />
        <span className="text-muted-foreground text-xs">Read-only</span>
      </div>
      {opportunities.length === 0 ? (
        <p className="text-sm text-[#889096]">No opportunities identified yet.</p>
      ) : (
        <div className="overflow-hidden rounded-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DFE3E6]">
                <th className="min-w-[260px] px-4 py-2 text-left text-xs font-normal text-[#687076] uppercase">
                  Opportunity
                </th>
                <th className="px-4 py-2 text-left text-xs font-normal text-[#687076] uppercase">
                  Description
                </th>
                <th className="min-w-[160px] px-4 py-2 text-left text-xs font-normal text-[#687076] uppercase">
                  Domain
                </th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr
                  key={opp.id}
                  className="cursor-pointer border-b border-[#DFE3E6] transition-colors last:border-b-0 hover:bg-[#F8F9FA]"
                  onClick={() => handleRowClick(opp)}
                >
                  <td className="px-4 py-2 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-medium text-[#151718]">{opp.title}</span>
                      <span className="text-sm font-light text-[#687076]">{opp.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top">
                    <span className="text-sm font-normal text-[#687076]">{opp.description}</span>
                  </td>
                  <td className="px-4 py-2 align-top">
                    <span className="text-sm font-normal text-[#687076]">{opp.domain}</span>
                  </td>
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
