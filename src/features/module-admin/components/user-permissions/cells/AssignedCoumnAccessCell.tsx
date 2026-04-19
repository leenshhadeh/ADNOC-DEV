import { useMemo } from 'react'
import type { EditableField, UserPermissionRow } from '../types'
import { availableColumnAccess } from '../constants'
import TagsSelect from '@/shared/components/table-primitives/TagsSelect'

type ColumnAccessOption = {
  id: string
  name: string
}

type Props = {
  row: UserPermissionRow
  onRowChange?: (rowId: string, field: EditableField, value: string | string[]) => void
}

const AssignedColumnAccessCell = ({ row, onRowChange }: Props) => {
  const columnAccessOptions = useMemo<ColumnAccessOption[]>(
    () =>
      availableColumnAccess.map((item) => ({
        id: item,
        name: item,
      })),
    [],
  )

  const selectedColumnAccess = useMemo<ColumnAccessOption[]>(
    () =>
      (row.columnAccess ?? []).map((item) => ({
        id: item,
        name: item,
      })),
    [row.columnAccess],
  )

  return (
    <div className="flex w-full overflow-x-auto">
      <TagsSelect
        tags={selectedColumnAccess}
        allTags={columnAccessOptions}
        placeholder="Select column access"
        onChange={(selected) => {
          onRowChange?.(
            row.id,
            'columnAccess',
            selected.map((item) => item.name),
          )
        }}
      />
    </div>
  )
}

export default AssignedColumnAccessCell
