import { useCallback, useMemo, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import clsx from 'clsx'

import type { GroupCompanyRow, GroupCompanySite } from './types'

type Props = {
  open: boolean
  row: GroupCompanyRow | null
  onOpenChange: (open: boolean) => void
  onSave: (rowId: string, sites: GroupCompanySite[]) => void
}

const createSite = (name = ''): GroupCompanySite => ({
  id: `${Date.now()}-${Math.random()}`,
  name,
})

const GroupCompanySitesDrawer = ({ open, row, onOpenChange, onSave }: Props) => {
  const [draftSites, setDraftSites] = useState<GroupCompanySite[]>([])

  useCallback(() => {
    if (open && row) {
      setDraftSites(row.sites.length ? row.sites : [createSite('')])
    }
  }, [open, row])

  const totalSites = draftSites.filter((site) => site.name.trim()).length

  const handleChangeSite = (siteId: string, value: string) => {
    setDraftSites((prev) =>
      prev.map((site) => (site.id === siteId ? { ...site, name: value } : site)),
    )
  }

  const handleAddSite = () => {
    setDraftSites((prev) => [...prev, createSite('')])
  }

  const handleDeleteSite = (siteId: string) => {
    setDraftSites((prev) => prev.filter((site) => site.id !== siteId))
  }

  const handleSave = () => {
    if (!row) return

    const cleanedSites = draftSites.filter((site) => site.name.trim())
    onSave(row.id, cleanedSites)
    onOpenChange(false)
  }

  const title = useMemo(() => row?.groupCompany ?? '-', [row])

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-end transition-colors duration-300',
        open ? 'pointer-events-auto bg-black/40' : 'pointer-events-none bg-black/0',
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[26px] font-semibold text-[#151718]">Add Sites</h2>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#151718] hover:bg-[#F1F3F5]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mx-6 border-t border-[#DFE3E6]" />

        <div className="px-6 py-5">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#DFE3E6] pb-4">
            <div className="min-w-0">
              <div className="text-[14px] text-[#8D959E]">Group company:</div>
              <div className="truncate text-[16px] font-semibold text-[#151718]">{title}</div>
            </div>

            <div className="text-[14px] whitespace-nowrap text-[#5B6572]">
              Sites Number <span className="ml-2 font-semibold text-[#151718]">{totalSites}</span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <div className="space-y-5 pb-6">
            {draftSites.map((site) => (
              <div key={site.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="mb-2 block text-[14px] text-[#5B6572]">Site name</label>
                  <input
                    value={site.name}
                    onChange={(e) => handleChangeSite(site.id, e.target.value)}
                    placeholder="Enter site name"
                    className="h-12 w-full rounded-[18px] border border-[#DFE3E6] px-6 text-[16px] text-[#151718] outline-none placeholder:text-[#B0B7C3]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSite(site.id)}
                  className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#151718] hover:bg-[#F5F7FA]"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <div className="border-t border-[#DFE3E6] pt-5">
              <button
                type="button"
                onClick={handleAddSite}
                className="inline-flex items-center gap-2 text-[16px] font-medium text-[#0B57D0]"
              >
                <Plus className="h-4 w-4" />
                Add Site
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DFE3E6] px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-12 flex-1 rounded-full bg-[#E8EEFF] text-[16px] font-semibold text-[#151718]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="h-12 flex-1 rounded-full bg-gradient-to-r from-[#5B19FF] to-[#2D00F7] text-[16px] font-semibold text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupCompanySitesDrawer
