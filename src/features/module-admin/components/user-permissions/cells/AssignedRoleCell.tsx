import { createPortal } from 'react-dom'
import { useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

import { availableRoles } from '../constants'
import type { EditableField, PickerPosition, UserPermissionRow } from '../types'

type Props = {
  row: UserPermissionRow
  openRolePickerRowId: string | null
  setOpenRolePickerRowId: React.Dispatch<React.SetStateAction<string | null>>
  rolePickerPosition: PickerPosition | null
  setRolePickerPosition: React.Dispatch<React.SetStateAction<PickerPosition | null>>
  setOpenUserPickerRowId: React.Dispatch<React.SetStateAction<string | null>>
  setPickerPosition: React.Dispatch<React.SetStateAction<PickerPosition | null>>
  onRowChange?: (rowId: string, field: EditableField, value: string | string[]) => void
}

const AssignedRoleCell = ({
  row,
  openRolePickerRowId,
  setOpenRolePickerRowId,
  rolePickerPosition,
  setRolePickerPosition,
  setOpenUserPickerRowId,
  setPickerPosition,
  onRowChange,
}: Props) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [rolePickerSearch, setRolePickerSearch] = useState('')

  const roles = row.assignedRole ?? []
  const isOpen = openRolePickerRowId === row.id

  const toggleRole = (role: string) => {
    const nextRoles = roles.includes(role)
      ? roles.filter((item) => item !== role)
      : [...roles, role]

    onRowChange?.(row.id, 'assignedRole', nextRoles)
  }

  const filteredRoles = useMemo(() => {
    return availableRoles.filter((role) =>
      role.toLowerCase().includes(rolePickerSearch.toLowerCase()),
    )
  }, [rolePickerSearch])

  return (
    <div className="relative w-full">
      <button
        type="button"
        ref={triggerRef}
        onClick={() => {
          const el = triggerRef.current

          if (el) {
            const rect = el.getBoundingClientRect()
            setRolePickerPosition({
              top: rect.bottom + 8 + window.scrollY,
              left: rect.left + window.scrollX,
              width: rect.width,
            })
          }

          setOpenUserPickerRowId(null)
          setPickerPosition(null)
          setOpenRolePickerRowId((prev) => {
            const next = prev === row.id ? null : row.id

            if (next) {
              setRolePickerSearch('')
            }

            return next
          })
        }}
        className="flex min-h-10 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors"
        style={{
          borderColor: isOpen ? '#2F68D9' : 'transparent',
          backgroundColor: '#fff',
        }}
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-1">
          {roles.length > 0 ? (
            roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-3 rounded-full border border-[#2F68D9] bg-[#DCE5F9] px-3 py-1 text-[12px] font-[400] text-[#151718]"
              >
                <span>{role}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRole(role)
                  }}
                  className="inline-flex items-center justify-end"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">Select role</span>
          )}
        </div>

        <ChevronDown className="h-4 w-4 shrink-0 text-[#151718]" />
      </button>

      {isOpen &&
        rolePickerPosition &&
        createPortal(
          <div
            className="fixed z-[9999] rounded-2xl border border-gray-200 bg-white shadow-xl"
            style={{
              top: rolePickerPosition.top - window.scrollY,
              left: rolePickerPosition.left - window.scrollX,
              width: Math.max(rolePickerPosition.width, 260),
            }}
          >
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                autoFocus
                value={rolePickerSearch}
                onChange={(e) => setRolePickerSearch(e.target.value)}
                placeholder="Search"
                className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => {
                  const selected = roles.includes(role)

                  return (
                    <label
                      key={role}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[#DCE5F9] ${
                        selected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleRole(role)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="flex-1">{role}</span>
                    </label>
                  )
                })
              ) : (
                <div className="px-3 py-3 text-sm text-gray-400">No roles found</div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

export default AssignedRoleCell
