import { useCallback, useState } from 'react'
import { BaseModal } from '@/shared/components'
import { Button } from '@base-ui/react/button'

type Props = {
  open: boolean
  onClose: () => void
  selectedCount: number
  onApply: (value: string) => void
}

const BulkEditRateCardModal = ({ open, onClose, selectedCount, onApply }: Props) => {
  const [value, setValue] = useState('')

  useCallback(() => {
    if (open) {
      setValue('')
    }
  }, [open])

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Bulk edit to ${selectedCount} selected processes`}
      subtitle="Changes will apply to all selected processes"
      footer={
        <>
          <Button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[36px] bg-[linear-gradient(180deg,#EAEFFF_0%,#C7D6F9_100%)] text-black shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onApply(value)}
            disabled={value === ''}
            className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#344054]">Rate card value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter rate card value"
          className="h-11 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#151718] outline-none"
        />
      </div>
    </BaseModal>
  )
}

export default BulkEditRateCardModal
