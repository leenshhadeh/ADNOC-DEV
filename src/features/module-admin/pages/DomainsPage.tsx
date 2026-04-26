import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, Plus, Save, X } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import DomainsTable from '../components/domains/DomainsTable'
import { initialDomainsData } from '../components/domains/constants'
import { SuccessToast } from '@/shared/components'
import DomainEditModal from '../components/domains/DomainEditModal'
import DomainStatusConfirmModal from '../components/domains/DomainStatusConfirmModal'

import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import type { DomainRow, EditableDomainField } from '../components/domains/types'

type DomainsPageProps = {
  searchValue: string
  setToolbarActions: React.Dispatch<React.SetStateAction<ToolbarAction[]>>
}

const DomainsPage = ({ searchValue, setToolbarActions }: DomainsPageProps) => {
  const [rows, setRows] = useState<DomainRow[]>(initialDomainsData)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const originalRowRef = useRef<DomainRow | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEditRow, setSelectedEditRow] = useState<DomainRow | null>(null)
  const [selectedEditField, setSelectedEditField] = useState<
    'businessDomain' | 'code' | 'sortingIndex' | null
  >(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [pendingStatusRow, setPendingStatusRow] = useState<DomainRow | null>(null)
  const [pendingStatusAction, setPendingStatusAction] = useState<'activate' | 'archive' | null>(
    null,
  )

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
        businessDomain: '',
        code: '',
        sortingIndex: prev.length + 1,
        status: 'Activated',
        isEditing: true,
        isNew: true,
        editingField: 'businessDomain',
      },
      ...prev,
    ])
  }, [editingRow])

  const handleEditRow = useCallback(
    (row: DomainRow, field: 'businessDomain' | 'code' | 'sortingIndex') => {
      if (editingRow) return
      if (row.isNew) return

      setSelectedEditRow(row)
      setSelectedEditField(field)
      setIsEditModalOpen(true)
    },
    [editingRow],
  )

  const handleSaveFieldEdit = useCallback(
    (rowId: string, field: 'businessDomain' | 'code' | 'sortingIndex', value: string) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]:
                  field === 'sortingIndex'
                    ? Number(value)
                    : field === 'code'
                      ? value.toUpperCase()
                      : value,
              }
            : row,
        ),
      )

      setIsEditModalOpen(false)
      setSelectedEditRow(null)
      setSelectedEditField(null)

      showToast(
        field === 'businessDomain'
          ? 'Business domain updated successfully'
          : field === 'code'
            ? 'Code updated successfully'
            : 'Sorting index updated successfully',
      )
    },
    [showToast],
  )

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedEditRow(null)
    setSelectedEditField(null)
  }, [])

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

    const trimmedBusinessDomain = editingRow.businessDomain.trim()
    const trimmedCode = editingRow.code.trim().toUpperCase()

    if (!trimmedBusinessDomain || !trimmedCode || editingRow.sortingIndex === '') {
      console.error('All fields are required before saving')
      return
    }

    const isNewRow = originalRowRef.current === null

    setRows((prev) =>
      prev.map((row) =>
        row.id === editingRow.id
          ? {
              ...row,
              businessDomain: trimmedBusinessDomain,
              code: trimmedCode,
              sortingIndex: Number(editingRow.sortingIndex),
              isEditing: false,
              editingField: null,
              isNew: false,
            }
          : row,
      ),
    )

    originalRowRef.current = null
    showToast(isNewRow ? 'Domain added successfully' : 'Domain updated successfully')
  }, [editingRow, showToast])

  const handleArchiveRow = useCallback(
    (row: DomainRow) => {
      if (editingRow) return
      setPendingStatusRow(row)
      setPendingStatusAction('archive')
      setStatusModalOpen(true)
    },
    [editingRow],
  )

  const handleActivateRow = useCallback(
    (row: DomainRow) => {
      if (editingRow) return
      setPendingStatusRow(row)
      setPendingStatusAction('activate')
      setStatusModalOpen(true)
    },
    [editingRow],
  )

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

  const handleEditingFieldChange = useCallback((rowId: string, field: EditableDomainField) => {
    setRows((prev) => {
      const nextRows = prev.map((row) => {
        if (row.id !== rowId || row.editingField === field) {
          return row
        }

        return {
          ...row,
          editingField: field,
        }
      })

      const hasChanged = nextRows.some((row, index) => row !== prev[index])

      return hasChanged ? nextRows : prev
    })
  }, [])

  const handleCloseStatusModal = useCallback(() => {
    setStatusModalOpen(false)
    setPendingStatusRow(null)
    setPendingStatusAction(null)
  }, [])

  const handleConfirmStatusChange = useCallback(() => {
    if (!pendingStatusRow || !pendingStatusAction) return

    setRows((prev) =>
      prev.map((item) =>
        item.id === pendingStatusRow.id
          ? {
              ...item,
              status: pendingStatusAction === 'activate' ? 'Activated' : 'Archived',
            }
          : item,
      ),
    )

    showToast(
      pendingStatusAction === 'activate'
        ? 'Domain activated successfully'
        : 'Domain archived successfully',
    )

    handleCloseStatusModal()
  }, [handleCloseStatusModal, pendingStatusAction, pendingStatusRow, showToast])

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
              onClick: () => {},
            },
          ],
    [editingRow, handleAddNew, handleCancelEdit, handleSaveEdit],
  )

  useEffect(() => {
    setToolbarActions(actions)
  }, [actions, setToolbarActions])

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar title="Manage business domains used across the BPA process hierarchy." />

      <DomainsTable
        data={rows}
        searchValue={searchValue}
        onRowChange={handleRowChange}
        onEditingFieldChange={handleEditingFieldChange}
        onEditRow={handleEditRow}
        onArchiveRow={handleArchiveRow}
        onActivateRow={handleActivateRow}
        isEditingRow={!!editingRow}
      />

      <DomainEditModal
        key={`${selectedEditRow?.id ?? 'empty'}-${selectedEditField ?? 'none'}-${
          isEditModalOpen ? 'open' : 'closed'
        }`}
        open={isEditModalOpen}
        row={selectedEditRow}
        field={selectedEditField}
        onClose={handleCloseEditModal}
        onSave={handleSaveFieldEdit}
      />

      <DomainStatusConfirmModal
        open={statusModalOpen}
        domainName={pendingStatusRow?.businessDomain}
        actionType={pendingStatusAction}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusChange}
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

export default DomainsPage
