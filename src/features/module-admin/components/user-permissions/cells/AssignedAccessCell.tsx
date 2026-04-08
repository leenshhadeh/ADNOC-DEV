import { Maximize2 } from 'lucide-react'

import type { UserPermissionRow } from '../types'

type Props = {
  row: UserPermissionRow
  onOpenDomainsDrawer?: (row: UserPermissionRow) => void
}

const AssignedAccessCell = ({ row, onOpenDomainsDrawer }: Props) => {
  const { gcsAccess, domainsAccess } = row

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-1">
        <p className="text-[14px] font-[700] text-[#151718]">{gcsAccess}</p>{' '}
        <p className="text-[14px] font-[400] text-[#687076]">GCs</p>
      </span>

      <div className="h-6 w-px bg-[#DFE3E6]" />

      <span className="flex items-center gap-1">
        <p className="text-[14px] font-[700] text-[#151718]">{domainsAccess}</p>{' '}
        <p className="text-[14px] font-[400] text-[#687076]">Domains</p>
      </span>

      <div className="flex items-center gap-3">
        <div className="h-6 w-px bg-[#DFE3E6]" />

        <button
          type="button"
          onClick={() => onOpenDomainsDrawer?.(row)}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <Maximize2 className="h-[17.5px] w-[17.5px] text-[#151718]" />
        </button>
      </div>
    </div>
  )
}

export default AssignedAccessCell
