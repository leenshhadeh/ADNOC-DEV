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
      {opportunities.length === 0 ? (
        <p className="text-sm text-[#889096]">No opportunities identified yet.</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-[#DFE3E6]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DFE3E6]">
                <th className="min-w-[260px] border-r border-[#DFE3E6] px-4 py-2 text-left text-xs font-normal text-[#687076] uppercase">
                  Opportunity
                </th>
                <th className="border-r border-[#DFE3E6] px-4 py-2 text-left text-xs font-normal text-[#687076] uppercase">
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
                  <td className="border-r border-[#DFE3E6] px-4 py-2 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-medium text-[#151718]">{opp.title}</span>
                      <span className="text-sm font-light text-[#687076]">{opp.code}</span>
                    </div>
                  </td>
                  <td className="border-r border-[#DFE3E6] px-4 py-2 align-top">
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

      {/* ── Read-only badge ───────────────────────────────────────────── */}
      <div className="flex justify-start">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECEDED] px-2 py-1.5 text-xs font-normal text-[#7B8899]">
          <Lock className="size-3" />
          Read-only
        </span>
      </div>

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
