import { useState } from 'react'

import { BaseModal } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'

type Props = {
  open: boolean
  rowId: string | null
  initialValue: number | string
  onClose: () => void
  onSave: (rowId: string, value: string) => void
}

const EditRateCardValueModal = ({ open, rowId, initialValue, onClose, onSave }: Props) => {
  const [value, setValue] = useState(() => String(initialValue ?? ''))

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Rename rate card value"
      subtitle="Update the selected rate card value and save your changes."
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
            onClick={() => {
              if (!rowId) return
              onSave(rowId, value)
            }}
            disabled={value === ''}
            className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#344054]">Rate card value</label>
        <input
          autoFocus
          type="number"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter rate card value"
          className="h-11 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#151718] outline-none"
        />
      </div>
    </BaseModal>
  )
}

export default EditRateCardValueModal
