import { Maximize2 } from 'lucide-react'
import type { GroupCompanyRow } from '../types'
import clsx from 'clsx'

type Props = {
  row: GroupCompanyRow
  onOpenSitesDrawer?: (row: GroupCompanyRow) => void
}

const GroupCompanySitesCell = ({ row, onOpenSitesDrawer }: Props) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        {row.sites.length > 0 ? (
          row.sites.map((site) => (
            <span
              key={site.id}
              className={clsx(
                site.name === 'General'
                  ? 'inline-flex h-7 items-center rounded-full border border-[#DFE3E6] bg-accent px-4 text-[14px] text-[#151718]'
                  : 'inline-flex h-7 items-center rounded-full border border-[#2F68D9] bg-[#DCE5F9] px-4 text-[14px] text-[#151718]',
              )}
            >
              {site.name}
            </span>
          ))
        ) : (
          <span className="text-[16px] text-[#8D959E]">Add sites...</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpenSitesDrawer?.(row)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#151718] hover:bg-[#F5F7FA]"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default GroupCompanySitesCell
