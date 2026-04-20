import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'

type Props = {
  open: boolean
  userName?: string
  actionType: 'activate' | 'deactivate' | null
  onClose: () => void
  onConfirm: () => void
}

const UserStatusConfirmModal = ({ open, userName, actionType, onClose, onConfirm }: Props) => {
  const isActivate = actionType === 'activate'

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to ${isActivate ? 'activate' : 'deactivate'} ${userName ?? 'this user'}?`}
     
      maxWidth="max-w-[520px]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 rounded-[36px] bg-[linear-gradient(180deg,#EAEFFF_0%,#C7D6F9_100%)] text-black shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Confirm
          </Button>
        </>
      }
    >
      <div className="text-sm text-[#344054]">
        {isActivate
          ? 'The selected user will become active again.'
          : 'The selected user will be deactivated and marked as inactive.'}
      </div>
    </BaseModal>
  )
}

export default UserStatusConfirmModal
