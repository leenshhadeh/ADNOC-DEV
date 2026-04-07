import { useState } from 'react'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { CloseButton } from './ModalParts'

interface RejectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount?: number
  title?: string
  description?: string
  /** When true the user must provide a reason before confirming. */
  requireReason?: boolean
  onConfirm: (reason?: string) => void
}

export function RejectModal({
  open,
  onOpenChange,
  selectedCount,
  title,
  description,
  requireReason = false,
  onConfirm,
}: RejectModalProps) {
  const [reason, setReason] = useState('')
  const defaultTitle = `Reject selected requests${selectedCount ? ` (${selectedCount})` : ''}`
  const defaultDesc = 'These requests will be rejected. Are you sure you want to reject them?'

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setReason('')
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose={false}
        className="max-w-lg gap-6 rounded-2xl bg-[#F1F3F5] p-8 shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]"
      >
        <div className="flex items-start gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-2xl font-medium text-[#151718]">{title ?? defaultTitle}</h2>
            <p className="text-base font-normal text-[#687076]">{description ?? defaultDesc}</p>
          </div>
          <CloseButton onClick={() => handleOpenChange(false)} />
        </div>

        {requireReason && (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-0.5 text-base font-normal text-[#687076]">
              Reason <span className="text-[#EB3865]">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-2xl border border-[#DFE3E6] bg-white px-6 py-4 text-sm text-[#151718] outline-none placeholder:text-[#A1A8AD] focus:border-[#0047BA]"
              placeholder="Enter reject reason..."
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            className="flex flex-1 items-center justify-center rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-sm font-medium text-[#151718] shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={requireReason && reason.trim().length === 0}
            className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#EB3865] to-[#B12A4C] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
            onClick={() => {
              onConfirm(requireReason ? reason.trim() : undefined)
              handleOpenChange(false)
            }}
          >
            Reject
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
