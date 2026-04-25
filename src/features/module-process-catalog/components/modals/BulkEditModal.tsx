/**
 * BulkEditModal — modal for bulk editing selected processes in the Processes tab.
 *
 * Matches Figma node 6726-388302:
 *   - Title: "Bulk edit to {n} selected processes"
 *   - Subtitle: "Changes will apply to all selected items."
 *   - Dropdown: "Applicable to" — group company / site selection
 *   - Footer: Cancel (light gradient) + Apply (purple gradient)
 *
 * SRP: only handles UI + emits onApply(selectedCompanySite) — no API logic.
 */

import { useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface BulkEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  /** "CompanyName - SiteName" options fetched from the group companies lookup */
  companySiteOptions: string[]
  onApply: (selectedCompanySite: string) => void
}

export const BulkEditModal = ({
  open,
  onOpenChange,
  selectedCount,
  companySiteOptions,
  onApply,
}: BulkEditModalProps) => {
  const [selected, setSelected] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleCancel = () => {
    setSelected('')
    setDropdownOpen(false)
    onOpenChange(false)
  }

  const handleApply = () => {
    if (!selected) return
    onApply(selected)
    setSelected('')
    setDropdownOpen(false)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]">
      <div className="bg-accent flex w-full max-w-lg flex-col gap-8 rounded-2xl p-8 shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]">
        {/* ── Header ── */}
        <div className="flex items-start gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-2xl leading-8 font-medium text-[#151718]">
              Bulk edit to {selectedCount} selected process{selectedCount !== 1 ? 'es' : ''}
            </h2>
            <p className="text-base font-normal text-[#687076]">
              Changes will apply to all selected items.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={handleCancel}
            className="shrink-0 rounded-full p-1 text-[#687076] transition-colors hover:text-[#151718]"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Applicable to dropdown ── */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-base font-normal text-[#687076]">Applicable to</span>
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border border-[#DFE3E6] bg-white px-4 py-3 text-left',
                  'transition-colors hover:border-brand-blue/30',
                )}
              >
                <span
                  className={cn(
                    'text-base font-medium',
                    selected ? 'text-[#687076]' : 'text-[#687076]/60',
                  )}
                >
                  {selected || 'Select group company - site'}
                </span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-[#687076] transition-transform',
                    dropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 max-h-[200px] w-full overflow-y-auto rounded-2xl border border-[#DFE3E6] bg-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]">
                  {companySiteOptions.length > 0 ? (
                    companySiteOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={cn(
                          'flex w-full items-center border-b border-[#DFE3E6]/50 px-4 py-2.5 text-left text-sm font-normal text-[#687076] transition-colors last:border-b-0 hover:bg-[#]',
                          selected === option && 'bg-accent font-medium text-[#151718]',
                        )}
                        onClick={() => {
                          setSelected(option)
                          setDropdownOpen(false)
                        }}
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 text-sm text-[#687076]">No options available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-sm font-medium text-[#151718] shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected}
            className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
            onClick={handleApply}
          >
            Apply changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkEditModal
