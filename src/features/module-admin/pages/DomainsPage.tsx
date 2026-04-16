import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, Plus, Save, X } from 'lucide-react'

import AdminToolbar from '../components/AdminToolbar'
import DomainsTable from '../components/domains/DomainsTable'
import { initialDomainsData } from '../components/domains/constants'
import { SuccessToast } from '@/shared/components'

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
        editingField: null,
      },
      ...prev,
    ])
  }, [editingRow])

  const handleEditRow = useCallback(
    (row: DomainRow, field: 'businessDomain' | 'code' | 'sortingIndex') => {
      if (editingRow) return

      originalRowRef.current = { ...row }

      setRows((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                isEditing: true,
                isNew: false,
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

      showToast('Domain archived successfully')
    },
    [editingRow, showToast],
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
      <AdminToolbar title="Manage business domains used across the BPA process hierarchy." />

      <DomainsTable
        data={rows}
        searchValue={searchValue}
        onRowChange={handleRowChange}
        onEditRow={handleEditRow}
        onArchiveRow={handleArchiveRow}
        isEditingRow={!!editingRow}
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
