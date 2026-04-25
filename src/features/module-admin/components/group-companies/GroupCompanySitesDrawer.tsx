import { useMemo, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import clsx from 'clsx'

import type { GroupCompanyRow, GroupCompanySite } from './types'

type Props = {
  open: boolean
  row: GroupCompanyRow | null
  onOpenChange: (open: boolean) => void
  onSave: (rowId: string, sites: GroupCompanySite[]) => void
}

const GENERAL_SITE_NAME = 'General'

const createSite = (name = '', isDefault = false): GroupCompanySite => ({
  id: `${Date.now()}-${Math.random()}`,
  name,
  isDefault,
})

const ensureGeneralSite = (sites: GroupCompanySite[]): GroupCompanySite[] => {
  const defaultSite = sites.find((site) => site.isDefault)
  const otherSites = sites.filter((site) => !site.isDefault)

  return [defaultSite ?? createSite(GENERAL_SITE_NAME, true), ...otherSites]
}

const GroupCompanySitesDrawer = ({ open, row, onOpenChange, onSave }: Props) => {
  const initialSites = useMemo(() => {
    if (!row) return [createSite(GENERAL_SITE_NAME, true)]
    return ensureGeneralSite(row.sites ?? [])
  }, [row])

  const [draftSites, setDraftSites] = useState<GroupCompanySite[]>(initialSites)

  const totalSites = draftSites.filter((site) => site.name.trim()).length

  const isGeneralSite = (site: GroupCompanySite) => Boolean(site.isDefault)

  const handleChangeSite = (siteId: string, value: string) => {
    setDraftSites((prev) =>
      prev.map((site) =>
        site.id === siteId && !isGeneralSite(site) ? { ...site, name: value } : site,
      ),
    )
  }

  const handleAddSite = () => {
    setDraftSites((prev) => [...prev, createSite('')])
  }

  const handleDeleteSite = (siteId: string) => {
    setDraftSites((prev) => prev.filter((site) => site.id !== siteId || isGeneralSite(site)))
  }

  const handleSave = () => {
    if (!row) return

    const cleanedSites = ensureGeneralSite(draftSites.filter((site) => site.name.trim()))
    onSave(row.id, cleanedSites)
    onOpenChange(false)
  }

  const handleDrawerClose = () => {
    onOpenChange(false)
  }

  const title = row?.groupCompany ?? '-'

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-end transition-colors duration-300',
        open ? 'pointer-events-auto bg-black/40' : 'pointer-events-none bg-black/0',
      )}
      onClick={handleDrawerClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-foreground text-[26px] font-semibold">Add Sites</h2>

          <button
            type="button"
            onClick={handleDrawerClose}
            className="text-foreground hover:bg-accent inline-flex h-10 w-10 items-center justify-center rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="border-border mx-6 border-t" />

        <div className="px-6 py-5">
          <div className="border-border flex items-center justify-between gap-4 border-b pb-4">
            <div className="min-w-0">
              <div className="text-muted-foreground text-[14px] font-[300]">Group company:</div>
              <div className="text-foreground truncate text-[14px] font-[500]">{title}</div>
            </div>

            <div className="bg-border h-6 w-px" />

            <div className="text-muted-foreground text-[14px] font-[400] whitespace-nowrap">
              Sites Number
              <span className="text-foreground ml-2 text-[14px] font-[500]">{totalSites}</span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <div className="space-y-5 pb-6">
            {draftSites.map((site) => {
              const isGeneral = isGeneralSite(site)

              return (
                <div key={site.id} className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <label className="text-muted-foreground mb-2 block text-[16px] font-[400]">
                        Site name
                      </label>

                      {!isGeneral && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSite(site.id)}
                          className="text-foreground hover:bg-accent mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="pr-8">
                      <input
                        value={site.name}
                        disabled={isGeneral}
                        onChange={(e) => handleChangeSite(site.id, e.target.value)}
                        placeholder="Enter site name"
                        className={clsx(
                          'h-12 w-full rounded-[18px] border px-6 text-[16px] outline-none',
                          isGeneral
                            ? 'border-border bg-accent text-muted-foreground cursor-not-allowed'
                            : 'border-border text-foreground placeholder:text-muted-foreground',
                        )}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="border-border border-t pt-5">
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

        <div className="flex items-center gap-3 px-6 py-5">
          <button
            type="button"
            onClick={handleDrawerClose}
            className="text-foreground h-8 flex-1 rounded-[36px] bg-[linear-gradient(180deg,#EAEFFF_0%,#C7D6F9_100%)] text-[16px] font-semibold shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-8 flex-1 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-[16px] font-semibold text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroupCompanySitesDrawer
