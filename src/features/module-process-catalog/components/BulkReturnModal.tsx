import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export interface BulkReturnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  onConfirm: (reason: string) => void
}

const MAX_CHARS = 500

const BulkReturnModal = ({ open, onOpenChange, count, onConfirm }: BulkReturnModalProps) => {
  const [reason, setReason] = useState('')

  if (!open) return null

  const handleReturn = () => {
    onConfirm(reason.trim())
    setReason('')
    onOpenChange(false)
  }

  const handleCancel = () => {
    setReason('')
    onOpenChange(false)
  }

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[480px] rounded-2xl bg-[#F1F3F5] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-foreground text-2xl font-medium">Return selected requests</h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {count === 1
                ? 'This request will be marked as Returned. Please add the return reason below.'
                : `These ${count} requests will be marked as Returned. Please add the return reason below.`}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={handleCancel}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="mt-5 space-y-1.5">
          <label htmlFor="bulk-return-reason" className="text-muted-foreground text-sm">
            Reason <span className="text-destructive">*</span>
          </label>
          <textarea
            id="bulk-return-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Explain why these requests are being returned..."
            rows={4}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-4 py-3 text-base outline-none focus-visible:ring-2"
          />
          <p className="text-muted-foreground text-right text-xs">
            {reason.length} / {MAX_CHARS}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-12 rounded-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-action-return text-action-return-foreground hover:bg-action-return/80 h-12 rounded-full"
            disabled={reason.trim().length === 0}
            onClick={handleReturn}
          >
            Return
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BulkReturnModal
