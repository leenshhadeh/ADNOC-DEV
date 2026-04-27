/**
 * TaskBulkModals — modals for bulk actions on the My Tasks tab.
 *
 * Approve / Return / Reject are re-exported from the shared modal library.
 * RequestEndorsementModal is assessment-specific (Figma 6203-265619).
 */
import { useState } from 'react'
import { Check, Search, X } from 'lucide-react'

import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'

// ── Shared styles (used by RequestEndorsementModal) ───────────────────────────

const fieldLabel = 'text-muted-foreground mb-1.5 block text-sm'
const fieldInput =
  'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-4 py-3 text-base outline-none focus-visible:ring-2'

const gradCancel =
  'rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-[14px] font-[500] text-[#151718] shadow transition-opacity hover:opacity-80 disabled:opacity-40'
const gradConfirm =
  'rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-[14px] font-[500] text-white shadow transition-opacity hover:opacity-80 disabled:opacity-40'

// ── Request Endorsement Modal ──────────────────────────────────────────────────

/** Mock endorsement candidates — replace with real API data */
const ENDORSEMENT_CANDIDATES = [
  'Ahmed Al Mansoori',
  'Fatima Al Hashimi',
  'Mohammed Al Zaabi',
  'Sara Al Ketbi',
  'Khalid Al Dhaheri',
  'Noura Al Suwaidi',
  'Omar Al Shamsi',
  'Aisha Al Mazrouei',
]

interface RequestEndorsementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (names: string[], reason: string) => void
}

export const RequestEndorsementModal = ({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: RequestEndorsementModalProps) => {
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [reason, setReason] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const close = () => {
    setSelectedNames([])
    setReason('')
    setNameSearch('')
    setIsDropdownOpen(false)
    onOpenChange(false)
  }

  const filteredCandidates = ENDORSEMENT_CANDIDATES.filter((name) =>
    name.toLowerCase().includes(nameSearch.toLowerCase()),
  )

  const toggleName = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )
  }

  const removeName = (name: string) => {
    setSelectedNames((prev) => prev.filter((n) => n !== name))
  }

  const isValid = selectedNames.length > 0 && reason.trim().length > 0

  return (
    <BaseModal
      open={open}
      onClose={close}
      title="Request Endorsement"
      subtitle={`Please select the Business VP name and add your reason${selectedCount > 0 ? ` for ${selectedCount} selected request${selectedCount !== 1 ? 's' : ''}` : ''}.`}
      footer={
        <>
          <button type="button" className={gradCancel} onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className={gradConfirm}
            disabled={!isValid}
            onClick={() => {
              onConfirm(selectedNames, reason.trim())
              close()
            }}
          >
            Request endorsement
          </button>
        </>
      }
    >
      {/* Name field with tag input */}
      <div>
        <label className={fieldLabel}>
          Name <span className="text-[#EB3865]">*</span>
        </label>
        <div className="relative">
          <div
            className={`flex min-h-[48px] flex-wrap items-center gap-1.5 rounded-xl border bg-white px-3 py-2 ${
              isDropdownOpen ? 'border-brand-blue ring-brand-blue/20 ring-2' : 'border-border'
            }`}
            onClick={() => setIsDropdownOpen(true)}
          >
            {selectedNames.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1.5 rounded-full border border-[#2F68D9]/50 bg-[#DCE5F9] px-3 py-1 text-xs text-[#151718]"
              >
                {name}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeName(name)
                  }}
                >
                  <X className="size-3" />
                </Button>
              </span>
            ))}
            {selectedNames.length === 0 && (
              <span className="text-muted-foreground py-1 text-sm select-none">Select name…</span>
            )}
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="border-border absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
                <div className="relative px-3 py-2">
                  <Search className="text-muted-foreground pointer-events-none absolute start-5 top-1/2 size-3.5 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    placeholder="Search…"
                    className="border-border w-full rounded-lg border bg-[#F8F9FA] py-1.5 ps-8 pe-3 text-sm outline-none"
                  />
                </div>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((name) => {
                    const isSelected = selectedNames.includes(name)
                    return (
                      <button
                        key={name}
                        type="button"
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#151718] hover:bg-[#F8F9FA]"
                        onClick={() => toggleName(name)}
                      >
                        <span
                          className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                            isSelected
                              ? 'border-brand-blue bg-brand-blue'
                              : 'border-border bg-white'
                          }`}
                        >
                          {isSelected && <Check className="size-3 text-white" />}
                        </span>
                        {name}
                      </button>
                    )
                  })
                ) : (
                  <p className="text-muted-foreground px-4 py-2.5 text-sm">No results found</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reason field */}
      <div className="pt-3">
        <label className={fieldLabel}>
          Reason for review <span className="text-[#EB3865]">*</span>
        </label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Enter reason…"
          className={`${fieldInput} resize-none`}
        />
      </div>
    </BaseModal>
  )
}
