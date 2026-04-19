import { useState } from 'react'

import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'
import type { GroupCompanyRow } from './types'

type EditableField = 'groupCompany' | 'code'

type Props = {
  open: boolean
  row: GroupCompanyRow | null
  field: EditableField | null
  onClose: () => void
  onSave: (rowId: string, field: EditableField, value: string) => void
}

const GroupCompanyEditModal = ({ open, row, field, onClose, onSave }: Props) => {
  const [value, setValue] = useState(() => {
    if (!row || !field) return ''

    return field === 'groupCompany' ? row.groupCompany : row.code
  })

  const title =
    field === 'groupCompany'
      ? 'Rename group company name'
      : field === 'code'
        ? 'Rename code'
        : 'Rename'

  const label =
    field === 'groupCompany' ? 'Group company name' : field === 'code' ? 'Code' : 'Value'

  const handleSave = () => {
    if (!row || !field) return

    const nextValue = field === 'code' ? value.trim().toUpperCase() : value.trim()

    if (!nextValue) {
      console.error(`${label} is required before saving`)
      return
    }

    onSave(row.id, field, nextValue)
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle="Update the selected field and save your changes."
      maxWidth="max-w-[560px]"
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
            onClick={handleSave}
            className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#344054]">{label}</label>
        <input
          autoFocus
          value={value}
          onChange={(e) =>
            setValue(field === 'code' ? e.target.value.toUpperCase() : e.target.value)
          }
          className="h-11 w-full rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#151718] outline-none focus:border-[#0047BB] focus:ring-2 focus:ring-[#B2DDFF]"
          placeholder={field === 'groupCompany' ? 'Enter group company name' : 'Enter code'}
        />
      </div>
    </BaseModal>
  )
}

export default GroupCompanyEditModal
