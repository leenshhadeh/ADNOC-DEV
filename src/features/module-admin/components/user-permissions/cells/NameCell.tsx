import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Eye, MoreHorizontal, Search, Trash2, X } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

import { userDirectory } from '../constants'
import type { PickerPosition, UserPermissionRow } from '../types'

type Props = {
  row: UserPermissionRow
  openUserPickerRowId: string | null
  setOpenUserPickerRowId: React.Dispatch<React.SetStateAction<string | null>>
  userPickerSearch: string
  setUserPickerSearch: React.Dispatch<React.SetStateAction<string>>
  pickerPosition: PickerPosition | null
  setPickerPosition: React.Dispatch<React.SetStateAction<PickerPosition | null>>
  setOpenRolePickerRowId: React.Dispatch<React.SetStateAction<string | null>>
  setRolePickerPosition: React.Dispatch<React.SetStateAction<PickerPosition | null>>
  onRowSelectUser?: (rowId: string, user: { name: string; email: string }) => void
  onView?: (row: UserPermissionRow) => void
  onDeactivate?: (row: UserPermissionRow) => void
}

const NameCell = ({
  row,
  openUserPickerRowId,
  setOpenUserPickerRowId,
  userPickerSearch,
  setUserPickerSearch,
  pickerPosition,
  setPickerPosition,
  setOpenRolePickerRowId,
  setRolePickerPosition,
  onRowSelectUser,
  onView,
  onDeactivate,
}: Props) => {
  const { id, name, email, isEditing } = row
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const initials = useMemo(() => {
    if (!name) return ''

    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [name])

  const filteredUsers = useMemo(() => {
    return userDirectory.filter((user) =>
      user.name.toLowerCase().includes(userPickerSearch.toLowerCase()),
    )
  }, [userPickerSearch])

  if (isEditing) {
    const isOpen = openUserPickerRowId === id

    return (
      <div className="relative z-50 flex w-full items-center justify-between gap-3">
        <button
          type="button"
          ref={triggerRef}
          onClick={() => {
            const el = triggerRef.current

            if (el) {
              const rect = el.getBoundingClientRect()
              setPickerPosition({
                top: rect.bottom - 10 + window.scrollY,
                left: rect.left + 30 + window.scrollX,
                width: 260,
              })
            }

            setOpenRolePickerRowId(null)
            setRolePickerPosition(null)
            setOpenUserPickerRowId(id)
            setUserPickerSearch('')
          }}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {name ? (
            <>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                {initials}
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[16px] font-[500] text-[#151718]">{name}</span>
                <span className="truncate text-[14px] font-[300] text-[#687076]">{email}</span>
              </div>
            </>
          ) : (
            <div className="flex min-w-0 flex-1 items-center">
              <span className="text-sm text-gray-400">Select user</span>
            </div>
          )}
        </button>

        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-[#DCE5F9]"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </button>

        {isOpen &&
          pickerPosition &&
          createPortal(
            <div
              className="fixed z-[9999] rounded-2xl border border-gray-200 bg-white shadow-xl"
              style={{
                top: pickerPosition.top - window.scrollY,
                left: pickerPosition.left - window.scrollX,
                width: pickerPosition.width,
              }}
            >
              <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  autoFocus
                  value={userPickerSearch}
                  onChange={(e) => setUserPickerSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="max-h-64 overflow-y-auto py-1">
                {filteredUsers.map((user) => {
                  const userInitials = user.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()

                  const isSelected = user.name === name && user.email === email

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        onRowSelectUser?.(id, {
                          name: user.name,
                          email: user.email,
                        })
                        setOpenUserPickerRowId(null)
                        setUserPickerSearch('')
                        setPickerPosition(null)
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-[#DCE5F9] ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                        {userInitials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="truncate text-xs text-gray-500">{user.email}</div>
                      </div>

                      {isSelected && <X className="h-4 w-4 shrink-0 text-gray-400" />}
                    </button>
                  )
                })}
              </div>
            </div>,
            document.body,
          )}
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
