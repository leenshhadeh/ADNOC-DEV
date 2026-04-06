import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export interface ApproveConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  onConfirm: () => void
}

const ApproveConfirmModal = ({
  open,
  onOpenChange,
  count,
  onConfirm,
}: ApproveConfirmModalProps) => {
  if (!open) return null

  const handleApprove = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <div className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[480px] rounded-2xl bg-[#F1F3F5] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-foreground text-2xl font-medium">Approve selected requests</h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {count === 1
                ? 'This request will be forwarded for BPA Program Manager. Are you sure you want to approve it?'
                : `These ${count} requests will be forwarded for BPA Program Manager. Are you sure you want to approve them?`}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-12 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-action-approve hover:bg-action-approve/90 h-12 rounded-full text-white"
            onClick={handleApprove}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ApproveConfirmModal
