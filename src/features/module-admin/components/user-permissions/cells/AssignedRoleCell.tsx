import { createPortal } from 'react-dom'
import { useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'

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

  const roles = row.assignedRole ?? []
  const isOpen = openRolePickerRowId === row.id

  const toggleRole = (role: string) => {
    const nextRoles = roles.includes(role)
      ? roles.filter((item) => item !== role)
      : [...roles, role]

    onRowChange?.(row.id, 'assignedRole', nextRoles)
  }

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
          setOpenRolePickerRowId((prev) => (prev === row.id ? null : row.id))
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
                className="inline-flex items-center gap-3 rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
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

        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
      </button>

      {isOpen &&
        rolePickerPosition &&
        createPortal(
          <div
            className="fixed z-[9999] max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
            style={{
              top: rolePickerPosition.top - window.scrollY,
              left: rolePickerPosition.left - window.scrollX,
              width: rolePickerPosition.width,
            }}
          >
            {availableRoles.map((role) => {
              const selected = roles.includes(role)

              return (
                <label
                  key={role}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${
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
            })}
          </div>,
          document.body,
        )}
    </div>
  )
}

export default AssignedRoleCell
