import { useState } from 'react'
import BaseModal from '@/shared/components/BaseModal'
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

  const close = () => {
    setReason('')
    onOpenChange(false)
  }

  return (
    <BaseModal
      open={open}
      onClose={close}
      title="Return selected requests"
      subtitle={
        count === 1
          ? 'This request will be marked as Returned. Please add the return reason below.'
          : `These ${count} requests will be marked as Returned. Please add the return reason below.`
      }
      footer={
        <>
          <Button type="button" variant="secondary" className="h-12 rounded-full" onClick={close}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-action-return text-action-return-foreground hover:bg-action-return/80 h-12 rounded-full"
            disabled={reason.trim().length === 0}
            onClick={() => {
              onConfirm(reason.trim())
              close()
            }}
          >
            Return
          </Button>
        </>
      }
    >
      <div>
        <label htmlFor="bulk-return-reason" className="text-muted-foreground mb-1.5 block text-sm">
          Reason <span className="text-destructive">*</span>
        </label>
        <textarea
          id="bulk-return-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Explain why these requests are being returned..."
          rows={4}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-xl border px-4 py-3 text-base outline-none focus-visible:ring-2"
        />
        <p className="text-muted-foreground mt-1 text-right text-xs">
          {reason.length} / {MAX_CHARS}
        </p>
      </div>
    </BaseModal>
  )
}

export default BulkReturnModal
