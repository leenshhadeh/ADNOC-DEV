import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'

type Props = {
  open: boolean
  domainName?: string
  actionType: 'activate' | 'archive' | null
  onClose: () => void
  onConfirm: () => void
}

const DomainStatusConfirmModal = ({
  open,
  domainName,
  actionType,
  onClose,
  onConfirm,
}: Props) => {
  const isActivate = actionType === 'activate'

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to ${isActivate ? 'activate' : 'archive'} ${domainName ?? 'this domain'}?`}
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
          ? 'The selected domain will be activated.'
          : 'Archiving this domain can affect its use across related configuration and process flows. Are you sure you want to continue?'}
      </div>
    </BaseModal>
  )
}

export default DomainStatusConfirmModal
