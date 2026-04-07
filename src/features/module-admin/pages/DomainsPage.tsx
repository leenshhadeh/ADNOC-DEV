import { useCallback, useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import DomainsTable from '../components/domains/DomainsTable'
import { initialDomainsData } from '../components/domains/constants'

import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import type { DomainRow, EditableDomainField } from '../components/domains/types'

const DomainsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState<DomainRow[]>(initialDomainsData)

  const handleAddNew = useCallback(() => {
    setRows((prev) => [
      {
        id: String(Date.now()),
        businessDomain: '',
        code: '',
        sortingIndex: prev.length + 1,
        isEditing: true,
      },
      ...prev,
    ])
  }, [])

  const handleRowChange = useCallback(
    (rowId: string, field: EditableDomainField, value: string) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: field === 'sortingIndex' ? (value === '' ? '' : Number(value)) : value,
              }
            : row,
        ),
      )
    },
    [],
  )

  const actions = useMemo<ToolbarAction[]>(
    () => [
      {
        id: 'add-new',
        label: 'Add new',
        icon: Plus,
        onClick: handleAddNew,
      },
      {
        id: 'export',
        label: 'Export',
        icon: Download,
        onClick: () => console.log('Export'),
      },
    ],
    [handleAddNew],
  )

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar
        title="Manage business domains used across the BPA process hierarchy."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={actions}
      />

      <DomainsTable data={rows} searchValue={searchValue} onRowChange={handleRowChange} />
    </div>
  )
}

export default DomainsPage
