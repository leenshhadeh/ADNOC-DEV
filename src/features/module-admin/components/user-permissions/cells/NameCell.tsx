import { useMemo } from 'react'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

import TagsSelect from '@/shared/components/table-primitives/TagsSelect'
import { userDirectory } from '../constants'
import type { UserPermissionRow } from '../types'

type SelectUserOption = {
  id: string
  name: string
  email?: string
  img?: string
}

type Props = {
  row: UserPermissionRow
  onRowSelectUser?: (rowId: string, user: { id: string; name: string; email: string }) => void
  onView?: (row: UserPermissionRow) => void
  onDeactivate?: (row: UserPermissionRow) => void
}

const NameCell = ({ row, onRowSelectUser, onView, onDeactivate }: Props) => {
  const { id, name, email, isEditing } = row

  const initials = useMemo(() => {
    if (!name) return ''

    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [name])

  const userOptions = useMemo<SelectUserOption[]>(
    () =>
      userDirectory.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        // only keep this line if userDirectory items actually include img
        img: 'img' in user ? user.img : undefined,
      })),
    [],
  )

  const selectedUser = useMemo<SelectUserOption[]>(() => {
    if (!name) return []

    const matchedUser = userOptions.find((user) => user.name === name && user.email === email)

    return [
      {
        id: matchedUser?.id ?? id,
        name,
        email: email ?? '',
        img: matchedUser?.img,
      },
    ]
  }, [name, email, id, userOptions])

  if (isEditing) {
    return (
      <div className="relative z-50 flex w-full items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <TagsSelect
            tags={selectedUser}
            allTags={userOptions}
            isUsers
            singleSelect
            variant="user"
            placeholder="Select user"
            onChange={(selected) => {
              const user = selected[0]
              if (!user) return

              onRowSelectUser?.(id, {
                id: user.id,
                name: user.name,
                email: user.email ?? '',
              })
            }}
          />
        </div>

        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-[#DCE5F9]"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
          {initials}
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[16px] font-[500] text-[#151718]">{name}</span>
          <span className="truncate text-[14px] font-[300] text-[#687076]">{email}</span>
        </div>
      </div>

      <div className="shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#DCE5F9]"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44 rounded-xl p-1">
            <DropdownMenuItem
              onClick={() => onView?.(row)}
              className="flex cursor-pointer items-center gap-2 rounded-lg data-[highlighted]:bg-[#DCE5F9]"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDeactivate?.(row)}
              className="flex cursor-pointer items-center gap-2 rounded-lg text-red-600 data-[highlighted]:bg-[#DCE5F9] data-[highlighted]:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              <span>Deactivate</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default NameCell
