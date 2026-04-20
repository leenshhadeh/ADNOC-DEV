import { useState } from 'react'

import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'

import type { DomainRow } from './types'

type EditableField = 'businessDomain' | 'code' | 'sortingIndex'

type Props = {
  open: boolean
  row: DomainRow | null
  field: EditableField | null
  onClose: () => void
  onSave: (rowId: string, field: EditableField, value: string) => void
}

const DomainEditModal = ({ open, row, field, onClose, onSave }: Props) => {
  const [value, setValue] = useState(() => {
    if (!row || !field) return ''

    if (field === 'sortingIndex') {
      return String(row.sortingIndex)
    }

    return field === 'businessDomain' ? row.businessDomain : row.code
  })

  const title =
    field === 'businessDomain'
      ? 'Rename business domain'
      : field === 'code'
        ? 'Rename code'
        : field === 'sortingIndex'
          ? 'Rename sorting index'
          : 'Rename'

  const label =
    field === 'businessDomain'
      ? 'Business domain'
      : field === 'code'
        ? 'Code'
        : field === 'sortingIndex'
          ? 'Sorting index'
          : 'Value'

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
          type={field === 'sortingIndex' ? 'number' : 'text'}
          min={field === 'sortingIndex' ? 0 : undefined}
          value={value}
          onChange={(e) =>
            setValue(field === 'code' ? e.target.value.toUpperCase() : e.target.value)
          }
          className="h-11 w-full rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#151718] outline-none focus:border-[#0047BB] focus:ring-2 focus:ring-[#B2DDFF]"
          placeholder={
            field === 'businessDomain'
              ? 'Enter business domain'
              : field === 'code'
                ? 'Enter code'
                : 'Enter sorting index'
          }
        />
      </div>
    </BaseModal>
  )
}

export default DomainEditModal
