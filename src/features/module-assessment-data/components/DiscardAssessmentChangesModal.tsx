import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'

type DiscardAssessmentChangesModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

const DiscardAssessmentChangesModal = ({
  open,
  onClose,
  onConfirm,
}: DiscardAssessmentChangesModalProps) => {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Discard unsaved changes?"
      subtitle="You have unsaved changes. Leaving this view will discard them."
      maxWidth="max-w-[520px]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 rounded-[36px] bg-[linear-gradient(180deg,#EAEFFF_0%,#C7D6F9_100%)] text-black shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Stay on page
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Discard changes
          </Button>
        </>
      }
    >
     
    </BaseModal>
  )
}

export default DiscardAssessmentChangesModal
