import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, Plus, Save, X } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import GroupCompaniesTable from '../components/group-companies/GroupCompaniesTable'
import GroupCompanySitesDrawer from '../components/group-companies/GroupCompanySitesDrawer'
import { initialGroupCompaniesData } from '../components/group-companies/constants'
import { SuccessToast } from '@/shared/components/SuccessToast'

import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import type {
  EditableGroupCompanyField,
  GroupCompanyRow,
} from '../components/group-companies/types'

type GroupCompaniesPageProps = {
  searchValue: string
  setToolbarActions: React.Dispatch<React.SetStateAction<ToolbarAction[]>>
}

const GroupCompaniesPage = ({ searchValue, setToolbarActions }: GroupCompaniesPageProps) => {
  const [rows, setRows] = useState<GroupCompanyRow[]>(initialGroupCompaniesData)
  const [isSitesDrawerOpen, setIsSitesDrawerOpen] = useState(false)
  const [selectedRowForSites, setSelectedRowForSites] = useState<GroupCompanyRow | null>(null)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const originalRowRef = useRef<GroupCompanyRow | null>(null)

  const showToast = useCallback((message: string) => {
    setToastOpen(false)
    setToastMessage(message)

    requestAnimationFrame(() => {
      setToastOpen(true)
    })
  }, [])

  const editingRow = useMemo(() => rows.find((row) => row.isEditing), [rows])

  const handleAddNew = useCallback(() => {
    if (editingRow) return

    originalRowRef.current = null

    setRows((prev) => [
      {
        id: String(Date.now()),
        groupCompany: '',
        code: '',
        sites: [],
        status: 'Active',
        isEditing: true,
        editingField: null,
      },
      ...prev,
    ])
  }, [editingRow])

  const handleEditRow = useCallback(
    (row: GroupCompanyRow, field: 'groupCompany' | 'code') => {
      if (editingRow) return

      originalRowRef.current = { ...row }

      setRows((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                isEditing: true,
                editingField: field,
              }
            : item,
        ),
      )
    },
    [editingRow],
  )

  const handleCancelEdit = useCallback(() => {
    if (!editingRow) return

    if (originalRowRef.current) {
      const original = originalRowRef.current

      setRows((prev) =>
        prev.map((row) =>
          row.id === original.id
            ? {
                ...original,
                isEditing: false,
                editingField: null,
              }
            : row,
        ),
      )
    } else {
      setRows((prev) => prev.filter((row) => !row.isEditing))
    }

    originalRowRef.current = null
  }, [editingRow])

  const handleSaveEdit = useCallback(() => {
    if (!editingRow) return

    const trimmedName = editingRow.groupCompany.trim()
    const trimmedCode = editingRow.code.trim().toUpperCase()

    if (!trimmedName || !trimmedCode) {
      console.error('Name and code are required before saving')
      return
    }

    const isNewRow = originalRowRef.current === null

    setRows((prev) =>
      prev.map((row) =>
        row.id === editingRow.id
          ? {
              ...row,
              groupCompany: trimmedName,
              code: trimmedCode,
              isEditing: false,
              editingField: null,
            }
          : row,
      ),
    )

    originalRowRef.current = null
    showToast(isNewRow ? 'Group company added successfully' : 'Group company updated successfully')
  }, [editingRow, showToast])

  const handleArchiveRow = useCallback(
    (row: GroupCompanyRow) => {
      if (editingRow) return

      setRows((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                status: 'Archived',
              }
            : item,
        ),
      )

      showToast('Group company archived successfully')
    },
    [editingRow, showToast],
  )

  const handleSaveSites = useCallback(
    (rowId: string, sites: GroupCompanyRow['sites']) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                sites,
              }
            : row,
        ),
      )

      setIsSitesDrawerOpen(false)
      setSelectedRowForSites(null)
      showToast('Sites updated successfully')
    },
    [showToast],
  )
  const handleRowChange = useCallback(
    (rowId: string, field: EditableGroupCompanyField, value: string) => {
      setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
    },
    [],
  )

  const handleOpenSitesDrawer = useCallback((row: GroupCompanyRow) => {
    setSelectedRowForSites(row)
    setIsSitesDrawerOpen(true)
  }, [])

  const actions = useMemo<ToolbarAction[]>(
    () =>
      editingRow
        ? [
            {
              id: 'save',
              label: 'Save',
              icon: Save,
              onClick: handleSaveEdit,
            },
            {
              id: 'cancel',
              label: 'Cancel',
              icon: X,
              onClick: handleCancelEdit,
            },
          ]
        : [
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
    [editingRow, handleAddNew, handleCancelEdit, handleSaveEdit],
  )

  useEffect(() => {
    setToolbarActions(actions)
  }, [actions, setToolbarActions])

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar title="Manage group companies and maintain their basic details." />

      <GroupCompaniesTable
        data={rows}
        searchValue={searchValue}
        onRowChange={handleRowChange}
        onOpenSitesDrawer={handleOpenSitesDrawer}
        onEditRow={handleEditRow}
        onArchiveRow={handleArchiveRow}
        isEditingRow={!!editingRow}
      />
      <GroupCompanySitesDrawer
        key={selectedRowForSites?.id ?? 'sites-drawer'}
        open={isSitesDrawerOpen}
        row={selectedRowForSites}
        onOpenChange={(open) => {
          if (!open) {
            setIsSitesDrawerOpen(false)
            setSelectedRowForSites(null)
          }
        }}
        onSave={handleSaveSites}
      />

      <SuccessToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        variant="success"
      />
    </div>
  )
}

export default GroupCompaniesPage
