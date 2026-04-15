import { Loader2 } from 'lucide-react'
import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'

interface SubmitForApprovalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isSubmitting: boolean
  count: number
}

const SubmitForApprovalModal = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  count,
}: SubmitForApprovalModalProps) => {
  return (
    <BaseModal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Submit for Approval"
      subtitle={`You are about to submit ${count} process${count !== 1 ? 'es' : ''} for approval. This action cannot be undone.`}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Submit
          </Button>
        </div>
      }
    />
  )
}

export default SubmitForApprovalModal
