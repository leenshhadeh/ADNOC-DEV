import { useState } from 'react'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { CloseButton } from './ModalParts'

interface ReturnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount?: number
  title?: string
  description?: string
  onConfirm: (reason: string) => void
}

export function ReturnModal({
  open,
  onOpenChange,
  selectedCount,
  title,
  description,
  onConfirm,
}: ReturnModalProps) {
  const [reason, setReason] = useState('')

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
            <h2 className="text-2xl font-medium text-[#151718]">
              {title ?? `Return selected requests${selectedCount ? ` (${selectedCount})` : ''}`}
            </h2>
            <p className="text-base font-normal text-[#687076]">
              {description ??
                'These requests will be marked as Returned. Please add the return reason below.'}
            </p>
          </div>
          <CloseButton onClick={() => handleOpenChange(false)} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-0.5 text-base font-normal text-[#687076]">
            Reason <span className="text-[#EB3865]">*</span>
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-2xl border border-[#DFE3E6] bg-white px-6 py-4 text-sm text-[#151718] outline-none placeholder:text-[#A1A8AD] focus:border-[#0047BA]"
            placeholder="Enter return reason..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            className="flex flex-1 items-center justify-center rounded-[36px] px-6 py-3 text-sm font-medium text-[#0047BA] transition-colors hover:bg-[#0047BA]/5"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={reason.trim().length === 0}
            className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r px-6 py-3 text-sm font-medium text-[#EB3865] shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
            onClick={() => {
              onConfirm(reason.trim())
              handleOpenChange(false)
            }}
          >
            Return
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
