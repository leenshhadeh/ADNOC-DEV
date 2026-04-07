import { useCallback, useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import GroupCompaniesTable from '../components/group-companies/GroupCompaniesTable'
import GroupCompanySitesDrawer from '../components/group-companies/GroupCompanySitesDrawer'
import { initialGroupCompaniesData } from '../components/group-companies/constants'

import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import type { EditableGroupCompanyField, GroupCompanyRow, GroupCompanySite } from '../components/group-companies/types'

const GroupCompaniesPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState<GroupCompanyRow[]>(initialGroupCompaniesData)

  const [isSitesDrawerOpen, setIsSitesDrawerOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<GroupCompanyRow | null>(null)

  const handleAddNew = useCallback(() => {
    setRows((prev) => [
      {
        id: String(Date.now()),
        groupCompany: '',
        code: '',
        sites: [],
        isEditing: true,
      },
      ...prev,
    ])
  }, [])

  const handleRowChange = useCallback(
    (rowId: string, field: EditableGroupCompanyField, value: string) => {
      setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
    },
    [],
  )

  const handleOpenSitesDrawer = useCallback((row: GroupCompanyRow) => {
    setSelectedRow(row)
    setIsSitesDrawerOpen(true)
  }, [])

  const handleSaveSites = useCallback((rowId: string, sites: GroupCompanySite[]) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, sites } : row)))
  }, [])

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
        title="Manage group companies and their associated sites within the BPA structure."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={actions}
      />

      <GroupCompaniesTable
        data={rows}
        searchValue={searchValue}
        onRowChange={handleRowChange}
        onOpenSitesDrawer={handleOpenSitesDrawer}
      />

      <GroupCompanySitesDrawer
        open={isSitesDrawerOpen}
        row={selectedRow}
        onOpenChange={setIsSitesDrawerOpen}
        onSave={handleSaveSites}
      />
    </div>
  )
}

export default GroupCompaniesPage
