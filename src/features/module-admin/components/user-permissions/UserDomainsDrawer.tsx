import { useCallback, useMemo, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import clsx from 'clsx'

import {
  domains,
  groupCompanies,
} from '@/features/module-admin/components/user-permissions/constants'
import type {
  AccessConfig,
  UserPermissionRow,
} from '@/features/module-admin/components/user-permissions/types'
import { getAccessCounts } from '@/features/module-admin/components/user-permissions/utils'

type Props = {
  open: boolean
  user: UserPermissionRow | null
  draftAccessConfig: AccessConfig
  onOpenChange: (open: boolean) => void
  onChange: (next: AccessConfig) => void
  onSave: () => void
}

const UserDomainsDrawer = ({
  open,
  user,
  draftAccessConfig,
  onOpenChange,
  onChange,
  onSave,
}: Props) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useCallback(() => {
    if (open) {
      setOpenGroups(Object.fromEntries(groupCompanies.map((gc) => [gc.id, true])))
    }
  }, [open])

  const initials = useMemo(() => {
    if (!user?.name) return '--'

    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [user])

  const counts = getAccessCounts(draftAccessConfig)

  const toggleGroupOpen = (groupCompanyId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupCompanyId]: !prev[groupCompanyId],
    }))
  }

  const getSelectedDomainsForGroup = (groupCompanyId: string) =>
    draftAccessConfig.selectedAccessByGroupCompany[groupCompanyId] ?? []

  const areAllDomainsSelectedForGroup = (groupCompanyId: string) =>
    getSelectedDomainsForGroup(groupCompanyId).length === domains.length

  const handleToggleDomain = (groupCompanyId: string, domainId: string) => {
    const selectedDomains = getSelectedDomainsForGroup(groupCompanyId)
    const isSelected = selectedDomains.includes(domainId)

    const nextSelectedDomains = isSelected
      ? selectedDomains.filter((id) => id !== domainId)
      : [...selectedDomains, domainId]

    onChange({
      ...draftAccessConfig,
      selectedAccessByGroupCompany: {
        ...draftAccessConfig.selectedAccessByGroupCompany,
        [groupCompanyId]: nextSelectedDomains,
      },
    })
  }

  const handleToggleAllDomainsForGroup = (groupCompanyId: string) => {
    const allSelected = areAllDomainsSelectedForGroup(groupCompanyId)

    onChange({
      ...draftAccessConfig,
      selectedAccessByGroupCompany: {
        ...draftAccessConfig.selectedAccessByGroupCompany,
        [groupCompanyId]: allSelected ? [] : domains.map((domain) => domain.id),
      },
    })
  }

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-end transition-colors duration-300',
        open ? 'pointer-events-auto bg-black/20' : 'pointer-events-none bg-black/0',
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
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-[26px] leading-none font-semibold text-[#151718]">
              Assigned Access
            </h2>

            <div className="flex items-center gap-2 text-[14px] text-[#8D959E]">
              <span>{counts.gcsAccess} GCs</span>
              <span>•</span>
              <span>{counts.domainsAccess} Domains</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#151718] transition hover:bg-[#F1F3F5]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-6 border-t border-[#DFE3E6]" />

        <div className="px-6 py-5">
          <p className="mb-3 text-[14px] text-[#8D959E]">User name</p>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5E7EB] text-[12px] font-semibold text-[#374151]">
              {initials}
            </div>

            <div className="truncate text-[16px] font-semibold text-[#151718]">
              {user?.name || 'No user selected'}
            </div>
          </div>
        </div>

        <div className="mx-6 border-t border-[#DFE3E6]" />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-3">
            {groupCompanies.map((gc) => {
              const selectedDomains = getSelectedDomainsForGroup(gc.id)
              const allSelected = areAllDomainsSelectedForGroup(gc.id)

              return (
                <div
                  key={gc.id}
                  className="overflow-hidden rounded-[20px] border border-[#DFE3E6] bg-white"
                >
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleGroupOpen(gc.id)}
                        className="inline-flex h-6 w-6 items-center justify-center text-[#151718]"
                      >
                        <ChevronDown
                          className={clsx(
                            'h-4 w-4 transition-transform duration-200',
                            openGroups[gc.id] ? 'rotate-0' : '-rotate-90',
                          )}
                        />
                      </button>

                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => handleToggleAllDomainsForGroup(gc.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />

                      <div className="flex flex-col">
                        <span className="truncate text-[16px] font-medium text-[#5B6572]">
                          {gc.name}
                        </span>
                        <span className="text-[12px] text-[#8D959E]">
                          {selectedDomains.length} selected
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleGroupOpen(gc.id)}
                      className="flex items-center gap-1 text-[14px] font-medium text-[#0047BA]"
                    >
                      <span>View</span>
                      <ChevronDown
                        className={clsx(
                          'h-4 w-4 transition-transform duration-200',
                          openGroups[gc.id] ? 'rotate-0' : '-rotate-90',
                        )}
                      />
                    </button>
                  </div>

                  {openGroups[gc.id] && (
                    <>
                      <div className="border-t border-[#DFE3E6]" />
                      <div className="px-6 py-5">
                        <div className="space-y-3">
                          {domains.map((domain) => (
                            <label
                              key={`${gc.id}-${domain.id}`}
                              className="flex cursor-pointer items-center gap-3 text-[14px] text-[#5B6572]"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDomains.includes(domain.id)}
                                onChange={() => handleToggleDomain(gc.id, domain.id)}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <span>{domain.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mx-6 border-t border-[#DFE3E6]" />

        <div className="flex items-center gap-3 px-6 py-5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 flex-1 rounded-full bg-[#E8EEFF] text-[16px] font-semibold text-[#151718]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="h-11 flex-1 rounded-full bg-gradient-to-r from-[#5B19FF] to-[#2D00F7] text-[16px] font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDomainsDrawer
