import BaseModal from '@/shared/components/BaseModal'
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
  const close = () => onOpenChange(false)

  return (
    <BaseModal
      open={open}
      onClose={close}
      title="Approve selected requests"
      subtitle={
        count === 1
          ? 'This request will be forwarded to the BPA Program Manager. Are you sure you want to approve it?'
          : `These ${count} requests will be forwarded to the BPA Program Manager. Are you sure you want to approve them?`
      }
      footer={
        <>
          <Button type="button" variant="secondary" className="h-12 rounded-full" onClick={close}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-action-approve hover:bg-action-approve/90 h-12 rounded-full text-white"
            onClick={() => {
              onConfirm()
              close()
            }}
          >
            Approve
          </Button>
        </>
      }
    />
  )
}

export default ApproveConfirmModal
