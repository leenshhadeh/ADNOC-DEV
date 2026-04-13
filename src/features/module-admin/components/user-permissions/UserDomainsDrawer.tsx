import { useMemo, useState } from 'react'
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

type Props = {
  open: boolean
  user: UserPermissionRow | null
  draftAccessConfig: AccessConfig
  onOpenChange: (open: boolean) => void
  onChange: (next: AccessConfig) => void
  onSave: () => void
  isBulkMode?: boolean
  selectedUsersCount?: number
}

const UserDomainsDrawer = ({
  open,
  user,
  draftAccessConfig,
  onOpenChange,
  onChange,
  onSave,
  isBulkMode = false,
  selectedUsersCount = 0,
}: Props) => {
  const createInitialOpenGroups = () =>
    Object.fromEntries(groupCompanies.map((gc) => [gc.publicId, false]))

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(createInitialOpenGroups)

  const initials = useMemo(() => {
    if (!user?.name) return '--'

    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [user])

  const toggleGroupOpen = (groupCompanyId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupCompanyId]: !prev[groupCompanyId],
    }))
  }

  const handleClose = () => {
    setOpenGroups(createInitialOpenGroups())
    onOpenChange(false)
  }

  const isGroupCompanySelected = (groupCompanyId: string) =>
    draftAccessConfig.some(({ groupCompany }) => groupCompany.publicId === groupCompanyId)

  const getSelectedDomainsForGroup = (groupCompanyId: string) =>
    draftAccessConfig.find(({ groupCompany }) => groupCompany.publicId === groupCompanyId)
      ?.groupCompany.applicableDomains ?? []

  const areAllDomainsSelectedForGroup = (groupCompanyId: string) =>
    getSelectedDomainsForGroup(groupCompanyId).length === domains.length

  const handleToggleGroupCompany = (groupCompanyId: string) => {
    const isSelected = isGroupCompanySelected(groupCompanyId)
    const selectedGroupCompany = groupCompanies.find((gc) => gc.publicId === groupCompanyId)

    if (!selectedGroupCompany) return

    onChange(
      isSelected
        ? draftAccessConfig.filter(({ groupCompany }) => groupCompany.publicId !== groupCompanyId)
        : [
            ...draftAccessConfig,
            {
              groupCompany: {
                ...selectedGroupCompany,
                applicableDomains: [],
              },
            },
          ],
    )
  }

  const handleToggleDomain = (groupCompanyId: string, domainId: string) => {
    const selectedDomains = getSelectedDomainsForGroup(groupCompanyId)
    const domain = domains.find((item) => item.publicId === domainId)

    if (!domain) return

    const isSelected = selectedDomains.some((item) => item.publicId === domainId)

    onChange(
      draftAccessConfig.map((entry) =>
        entry.groupCompany.publicId === groupCompanyId
          ? {
              groupCompany: {
                ...entry.groupCompany,
                applicableDomains: isSelected
                  ? entry.groupCompany.applicableDomains.filter(
                      (item) => item.publicId !== domainId,
                    )
                  : [...entry.groupCompany.applicableDomains, domain],
              },
            }
          : entry,
      ),
    )
  }

  const handleToggleAllDomainsForGroup = (groupCompanyId: string) => {
    const allSelected = areAllDomainsSelectedForGroup(groupCompanyId)

    onChange(
      draftAccessConfig.map((entry) =>
        entry.groupCompany.publicId === groupCompanyId
          ? {
              groupCompany: {
                ...entry.groupCompany,
                applicableDomains: allSelected ? [] : [...domains],
              },
            }
          : entry,
      ),
    )
  }

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-end transition-colors duration-300',
        open ? 'pointer-events-auto bg-black/20' : 'pointer-events-none bg-black/0',
      )}
      onClick={handleClose}
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
            <h2 className="text-[24px] leading-none font-[500] text-[#111827]">Assigned Access</h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#151718] transition hover:bg-[#F1F3F5]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-6 border-t border-[#DFE3E6]" />

        <div className="px-6 py-5">
          <p className="mb-3 text-[14px] font-[300] text-[#687076]">
            {isBulkMode ? 'Selected users' : 'User name'}
          </p>

          {isBulkMode ? (
            <div className="truncate text-[14px] font-[500] text-[#151718]">
              {selectedUsersCount} selected users
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5E7EB] text-[12px] font-semibold text-[#374151]">
                {initials}
              </div>

              <div className="truncate text-[14px] font-[500] text-[#151718]">
                {user?.name || 'No user selected'}
              </div>
            </div>
          )}
        </div>

        <div className="mx-6 border-t border-[#DFE3E6]" />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-3">
            {groupCompanies.map((gc) => {
              const selectedDomains = getSelectedDomainsForGroup(gc.publicId)
              const allSelected = areAllDomainsSelectedForGroup(gc.publicId)
              const gcSelected = isGroupCompanySelected(gc.publicId)

              return (
                <div
                  key={gc.publicId}
                  className="overflow-hidden rounded-[20px] border border-[#DFE3E6] bg-white"
                >
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleGroupOpen(gc.publicId)}
                        className="inline-flex h-6 w-6 items-center justify-center text-[#151718]"
                      >
                        <ChevronDown
                          className={clsx(
                            'h-4 w-4 transition-transform duration-200',
                            openGroups[gc.publicId] ? 'rotate-0' : '-rotate-90',
                          )}
                        />
                      </button>

                      <input
                        type="checkbox"
                        checked={gcSelected}
                        onChange={() => handleToggleGroupCompany(gc.publicId)}
                        className="h-4 w-4 rounded-[2px] accent-[#0047BA]"
                      />

                      <div className="flex flex-col">
                        <span className="truncate text-[16px] font-medium text-[#5B6572]">
                          {gc.name}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleGroupOpen(gc.publicId)}
                      className="flex items-center gap-1 text-[14px] font-[500] text-[#0047BA]"
                    >
                      <span>View</span>
                      <ChevronDown
                        className={clsx(
                          'h-5 w-5 transition-transform duration-200',
                          openGroups[gc.publicId] ? 'rotate-0' : '-rotate-90',
                        )}
                      />
                    </button>
                  </div>

                  {openGroups[gc.publicId] && (
                    <>
                      <div className="border-t border-[#DFE3E6]" />

                      <div className="px-6 py-5">
                        <div className="mb-4 text-[14px] font-[500] text-[#151718]">Domains</div>

                        <label className="mb-4 flex cursor-pointer items-center gap-3 text-[14px] text-[#5B6572]">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => handleToggleAllDomainsForGroup(gc.publicId)}
                            className="h-4 w-4 rounded-[2px] accent-[#0047BA]"
                          />
                          <span>All</span>
                        </label>

                        <div className="space-y-3">
                          {domains.map((domain) => (
                            <label
                              key={`${gc.publicId}-${domain.publicId}`}
                              className="flex cursor-pointer items-center gap-3 text-[14px] text-[#5B6572]"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDomains.some(
                                  (selectedDomain) => selectedDomain.publicId === domain.publicId,
                                )}
                                onChange={() => handleToggleDomain(gc.publicId, domain.publicId)}
                                className="h-4 w-4 rounded-[2px] accent-[#0047BA]"
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
            onClick={handleClose}
            className="h-8 flex-1 rounded-[36px] bg-[linear-gradient(180deg,#EAEFFF_0%,#C7D6F9_100%)] text-[16px] font-semibold text-[#151718] shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="h-8 flex-1 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-[16px] font-semibold text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDomainsDrawer
