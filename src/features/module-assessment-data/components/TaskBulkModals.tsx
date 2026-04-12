/**
 * TaskBulkModals — modals for bulk actions on the My Tasks tab.
 *
 * Modals (Figma nodes):
 *   6201-264577  ApproveTasksModal         — confirmation only, no input
 *   6201-264549  ReturnTasksModal          — required reason textarea
 *   6201-264563  RejectTasksModal          — required reason textarea
 *   6203-265619  RequestEndorsementModal   — name tag-input + required reason textarea
 */
import { useState } from 'react'
import { Search, X } from 'lucide-react'

import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'

// ── Shared styles ─────────────────────────────────────────────────────────────

const fieldLabel = 'text-muted-foreground mb-1.5 block text-sm'
const fieldInput =
  'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-4 py-3 text-base outline-none focus-visible:ring-2'

const gradCancel =
  'rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-[14px] font-[500] text-[#151718] shadow transition-opacity hover:opacity-80 disabled:opacity-40'
const gradConfirm =
  'rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-[14px] font-[500] text-white shadow transition-opacity hover:opacity-80 disabled:opacity-40'
const gradDanger =
  'rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] border border-[#55213E] px-6 py-3 text-[14px] font-[500] text-[#EB3865] shadow transition-opacity hover:opacity-80 disabled:opacity-40'

// ── Approve Modal ──────────────────────────────────────────────────────────────

interface ApproveTasksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: () => void
}

export const ApproveTasksModal = ({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: ApproveTasksModalProps) => {
  const close = () => onOpenChange(false)

  return (
    <BaseModal
      open={open}
      onClose={close}
      title={`Approve ${selectedCount} selected request${selectedCount !== 1 ? 's' : ''}`}
      subtitle="These requests will be forwarded for Quality Manager Review. Are you sure you want to approve them?"
      footer={
        <>
          <button type="button" className={gradCancel} onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className={gradConfirm}
            onClick={() => {
              onConfirm()
              close()
            }}
          >
            Approve
          </button>
        </>
      }
    />
  )
}

// ── Return Modal ───────────────────────────────────────────────────────────────

interface ReturnTasksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (reason: string) => void
}

export const ReturnTasksModal = ({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: ReturnTasksModalProps) => {
  const [reason, setReason] = useState('')

  const close = () => {
    setReason('')
    onOpenChange(false)
  }

  return (
    <BaseModal
      open={open}
      onClose={close}
      title={`Return ${selectedCount} selected request${selectedCount !== 1 ? 's' : ''}`}
      subtitle="These requests will be marked as Returned. Please add the return reason below."
      footer={
        <>
          <button type="button" className={gradCancel} onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className={gradDanger}
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason.trim())
              close()
            }}
          >
            Return
          </button>
        </>
      }
    >
      <div>
        <label className={fieldLabel}>
          Reason <span className="text-[#EB3865]">*</span>
        </label>
        <textarea
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

// ── Reject Modal ───────────────────────────────────────────────────────────────

interface RejectTasksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (reason: string) => void
}

export const RejectTasksModal = ({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: RejectTasksModalProps) => {
  const [reason, setReason] = useState('')

  const close = () => {
    setReason('')
    onOpenChange(false)
  }

  return (
    <BaseModal
      open={open}
      onClose={close}
      title={`Reject ${selectedCount} selected request${selectedCount !== 1 ? 's' : ''}`}
      subtitle="These requests will be marked as Rejected. Please add the rejection reason below."
      footer={
        <>
          <button type="button" className={gradCancel} onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className={gradDanger}
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason.trim())
              close()
            }}
          >
            Reject
          </button>
        </>
      }
    >
      <div>
        <label className={fieldLabel}>
          Reason <span className="text-[#EB3865]">*</span>
        </label>
        <textarea
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

  const filteredCandidates = ENDORSEMENT_CANDIDATES.filter(
    (name) =>
      name.toLowerCase().includes(nameSearch.toLowerCase()) && !selectedNames.includes(name),
  )

  const addName = (name: string) => {
    setSelectedNames((prev) => [...prev, name])
    setNameSearch('')
    setIsDropdownOpen(false)
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
              isDropdownOpen ? 'border-[#0047BA] ring-2 ring-[#0047BA]/20' : 'border-border'
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
            <div className="relative flex-1">
              <input
                type="text"
                value={nameSearch}
                onChange={(e) => {
                  setNameSearch(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={selectedNames.length === 0 ? 'Search name…' : ''}
                className="placeholder:text-muted-foreground w-full border-none bg-transparent py-1 text-sm outline-none"
              />
            </div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && filteredCandidates.length > 0 && (
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
                {filteredCandidates.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-[#151718] hover:bg-[#F8F9FA]"
                    onClick={() => addName(name)}
                  >
                    {name}
                  </button>
                ))}
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
        <textarea
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
