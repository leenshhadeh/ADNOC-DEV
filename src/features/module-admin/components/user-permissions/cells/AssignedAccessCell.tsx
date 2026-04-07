import { Maximize2 } from 'lucide-react'

import type { UserPermissionRow } from '../types'

type Props = {
  row: UserPermissionRow
  onOpenDomainsDrawer?: (row: UserPermissionRow) => void
}

const AssignedAccessCell = ({ row, onOpenDomainsDrawer }: Props) => {
  const { gcsAccess, domainsAccess } = row

  return (
    <div className="flex items-center justify-between gap-3 px-3 text-sm">
      <span>
        <strong>{gcsAccess}</strong> GCs
      </span>

      <span className="text-gray-300">|</span>

      <span>
        <strong>{domainsAccess}</strong> Domains
      </span>

      <div className="flex items-center gap-3">
        <span className="text-gray-300">|</span>

        <button
          type="button"
          onClick={() => onOpenDomainsDrawer?.(row)}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <Maximize2 className="h-4 w-4 text-gray-700" />
        </button>
      </div>
    </div>
  )
}

export default AssignedAccessCell
