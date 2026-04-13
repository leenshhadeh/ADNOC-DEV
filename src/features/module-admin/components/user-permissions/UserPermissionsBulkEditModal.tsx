import { useCallback, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import BaseModal from '@/shared/components/BaseModal'
import { Button } from '@/shared/components/ui/button'
import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

import { availableRoles } from './constants'

type BulkEditType = 'assignedRole' | 'assignedAccess' | ''

type RoleOption = {
  id: string
  name: string
}

type Props = {
  open: boolean
  selectedCount: number
  onClose: () => void
  onApplyRoles: (roles: string[]) => void
  onNextAccess: () => void
}

const editTypeOptions: { value: Exclude<BulkEditType, ''>; label: string }[] = [
  { value: 'assignedRole', label: 'Assigned role' },
  { value: 'assignedAccess', label: 'Assigned access' },
]

const UserPermissionsBulkEditModal = ({
  open,
  selectedCount,
  onClose,
  onApplyRoles,
  onNextAccess,
}: Props) => {
  const [editType, setEditType] = useState<BulkEditType>('')
  const [selectedRoles, setSelectedRoles] = useState<RoleOption[]>([])

  useCallback(() => {
    if (!open) return
    setEditType('')
    setSelectedRoles([])
  }, [open])

  const roleOptions = useMemo<RoleOption[]>(
    () =>
      availableRoles.map((role) => ({
        id: role,
        name: role,
      })),
    [],
  )

  const selectedEditTypeLabel =
    editTypeOptions.find((option) => option.value === editType)?.label ?? 'Select'

  const footer = (() => {
    if (editType === 'assignedRole') {
      return (
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
            disabled={selectedRoles.length === 0}
            onClick={() => onApplyRoles(selectedRoles.map((item) => item.name))}
            className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </Button>
        </>
      )
    }

    if (editType === 'assignedAccess') {
      return (
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
            onClick={onNextAccess}
            className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)]"
          >
            Next
          </Button>
        </>
      )
    }

    return (
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
          disabled
          className="h-9 rounded-full bg-[linear-gradient(180deg,#5B23FF_0%,#3C00EB_100%)] text-white shadow-[0_4px_8px_0_rgba(209,213,223,0.50)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apply
        </Button>
      </>
    )
  })()

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Bulk edit for ${selectedCount} selected users`}
      subtitle="Changes will apply to all selected users"
      maxWidth="max-w-[560px]"
      footer={footer}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#344054]">Edit type</label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-between rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#151718] outline-none"
            >
              <span>{selectedEditTypeLabel}</span>
              <ChevronDown className="h-4 w-4 text-[#667085]" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            <DropdownMenuRadioGroup
              value={editType}
              onValueChange={(value) => setEditType(value as BulkEditType)}
            >
              {editTypeOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {editType === 'assignedRole' ? (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#344054]">Assigned role</label>
          <div className="color-black font-sm w-full rounded-[12px] border bg-white px-4 py-3 text-sm">
            <TagsSelect
              tags={selectedRoles}
              allTags={roleOptions}
              placeholder="Select role"
              onChange={setSelectedRoles}
            />
          </div>
        </div>
      ) : null}
    </BaseModal>
  )
}

export default UserPermissionsBulkEditModal
