import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { CloseButton } from './ModalParts'

interface ApproveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Number of selected rows – shown in the default bulk title. */
  selectedCount?: number
  /** Override the default "Approve selected requests (N)" title. */
  title?: string
  /** Override the default description paragraph. */
  description?: string
  onConfirm: () => void
}

export function ApproveModal({
  open,
  onOpenChange,
  selectedCount,
  title,
  description,
  onConfirm,
}: ApproveModalProps) {
  const defaultTitle = `Approve selected requests${selectedCount ? ` (${selectedCount})` : ''}`
  const defaultDesc =
    'These requests will be forwarded for BPA Program Manager. Are you sure you want to approve them?'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="max-w-lg gap-6 rounded-2xl bg-[#F1F3F5] p-8 shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)]"
      >
        <div className="flex items-start gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-2xl font-medium text-[#151718]">{title ?? defaultTitle}</h2>
            <p className="text-base font-normal text-[#687076]">{description ?? defaultDesc}</p>
          </div>
          <CloseButton onClick={() => onOpenChange(false)} />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            className="flex flex-1 items-center justify-center rounded-[36px] px-6 py-3 text-sm font-medium text-[#0047BA] transition-colors hover:bg-[#0047BA]/5"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Approve
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
