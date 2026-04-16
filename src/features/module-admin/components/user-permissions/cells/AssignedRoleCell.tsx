import { useMemo } from 'react'
import type { EditableField, UserPermissionRow } from '../types'
import { availableRoles } from '../constants'
import TagsSelect from '@/shared/components/table-primitives/TagsSelect'

type RoleOption = {
  id: string
  name: string
}

type Props = {
  row: UserPermissionRow
  onRowChange?: (rowId: string, field: EditableField, value: string | string[]) => void
  onBlur?: (rowId: string) => void
}

const AssignedRoleCell = ({ row, onRowChange, onBlur }: Props) => {
  const roleOptions = useMemo<RoleOption[]>(
    () =>
      availableRoles.map((role) => ({
        id: role,
        name: role,
      })),
    [],
  )

  const selectedRoles = useMemo<RoleOption[]>(
    () =>
      (row.assignedRole ?? []).map((role) => ({
        id: role,
        name: role,
      })),
    [row.assignedRole],
  )

  return (
    <div className="flex w-full overflow-x-auto">
      <TagsSelect
        tags={selectedRoles}
        allTags={roleOptions}
        placeholder="Select role"
        onChange={(selected) => {
          onRowChange?.(
            row.id,
            'assignedRole',
            selected.map((item) => item.name),
          )
        }}
        onOpenChange={(open) => {
          if (!open) {
            onBlur?.(row.id)
          }
        }}
      />
    </div>
  )
}

export default AssignedRoleCell
