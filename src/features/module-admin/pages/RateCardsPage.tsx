import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import RateCardsTable from '../components/rate-cards/RateCardsTable'
import BulkEditRateCardModal from '../components/rate-cards/BulkEditRateCardModal'
import EditRateCardValueModal from '../components/rate-cards/EditRateCardValueModal'
import { initialRateCardsData } from '../components/rate-cards/constants'
import { flattenRateCards } from '../components/rate-cards/utils'
import { Pencil, X, Download, Save } from 'lucide-react'
import { SuccessToast } from '@/shared/components/SuccessToast'
import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import type { FlattenedRateCardRow } from '../components/rate-cards/types'

type RateCardsPageProps = {
  searchValue: string
  setToolbarActions: React.Dispatch<React.SetStateAction<ToolbarAction[]>>
}

const RateCardsPage = ({ searchValue, setToolbarActions }: RateCardsPageProps) => {
  const [rows, setRows] = useState<FlattenedRateCardRow[]>(() =>
    flattenRateCards(initialRateCardsData),
  )

  const [isBulkEditMode, setIsBulkEditMode] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isSingleEditModalOpen, setIsSingleEditModalOpen] = useState(false)
  const [selectedEditRow, setSelectedEditRow] = useState<FlattenedRateCardRow | null>(null)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = useCallback((message: string) => {
    setToastOpen(false)
    setToastMessage(message)

    requestAnimationFrame(() => {
      setToastOpen(true)
    })
  }, [])

  const handleEditRateCardRow = useCallback(
    (rowId: string) => {
      if (isBulkEditMode || isSingleEditModalOpen) return

      const targetRow = rows.find((row) => row.id === rowId)
      if (!targetRow) return

      setSelectedEditRow(targetRow)
      setIsSingleEditModalOpen(true)
    },
    [isBulkEditMode, isSingleEditModalOpen, rows],
  )

  const handleSaveSingleEdit = useCallback(
    (rowId: string, value: string) => {
      const numericValue = Number(value)

      if (value === '' || Number.isNaN(numericValue) || numericValue < 0) {
        return
      }

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                rateCardValue: numericValue,
              }
            : row,
        ),
      )

      setIsSingleEditModalOpen(false)
      setSelectedEditRow(null)
      showToast('Rate card value updated successfully')
    },
    [showToast],
  )

  const handleCloseSingleEditModal = useCallback(() => {
    setIsSingleEditModalOpen(false)
    setSelectedEditRow(null)
  }, [])

  const handleToggleBulkEditMode = useCallback(() => {
    if (isSingleEditModalOpen) return

    setIsBulkEditMode(true)
    setSelectedRowIds([])
    showToast('Bulk edit mode enabled')
  }, [isSingleEditModalOpen, showToast])

  const handleCancelBulkEdit = useCallback(() => {
    setIsBulkEditMode(false)
    setSelectedRowIds([])
    setIsBulkEditModalOpen(false)
    showToast('Bulk edit cancelled')
  }, [showToast])

  const handleToggleRowSelection = useCallback((rowId: string, checked: boolean) => {
    setSelectedRowIds((prev) => (checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)))
  }, [])

  const handleApplyBulkValue = useCallback(
    (value: string) => {
      setRows((prev) =>
        prev.map((row) =>
          selectedRowIds.includes(row.id)
            ? {
                ...row,
                rateCardValue: value === '' ? '' : Number(value),
              }
            : row,
        ),
      )

      setIsBulkEditModalOpen(false)
      setIsBulkEditMode(false)
      setSelectedRowIds([])
      showToast('Bulk rate card values updated successfully')
    },
    [selectedRowIds, showToast],
  )

  const filteredData = useMemo(() => {
    const value = searchValue.trim().toLowerCase()

    if (!value) return rows

    return rows.filter((item) =>
      [
        item.groupCompany,
        item.domain,
        item.domainCode,
        item.level1,
        item.level1Code,
        item.level2,
        item.level2Code,
        item.processLevel3,
        item.processLevel3Code,
        item.processLevel4,
        item.processLevel4Code,
        String(item.rateCardValue),
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value)),
    )
  }, [rows, searchValue])

  const actions = useMemo<ToolbarAction[]>(() => {
    if (isBulkEditMode) {
      return [
        {
          id: 'edit',
          label: 'Edit',
          onClick: () => setIsBulkEditModalOpen(true),
          disabled: selectedRowIds.length === 0,
          icon: Pencil,
        },
        {
          id: 'cancel',
          label: 'Cancel',
          onClick: handleCancelBulkEdit,
          icon: X,
        },
      ]
    }

    return [
      {
        id: 'bulk-action',
        label: 'Bulk action',
        onClick: handleToggleBulkEditMode,
        icon: Save,
      },
      {
        id: 'export',
        label: 'Export',
        onClick: () => {
          showToast('Export started successfully')
        },
        icon: Download,
      },
    ]
  }, [
    handleCancelBulkEdit,
    handleToggleBulkEditMode,
    selectedRowIds.length,
    isBulkEditMode,
    showToast,
  ])

  useEffect(() => {
    setToolbarActions(actions)
  }, [actions, setToolbarActions])

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar title="Manage rate values applied to manual effort calculations across L3 processes." />

      <RateCardsTable
        data={filteredData}
        isBulkEditMode={isBulkEditMode}
        selectedRowIds={selectedRowIds}
        onToggleRowSelection={handleToggleRowSelection}
        onEditRateCardRow={handleEditRateCardRow}
      />

      <EditRateCardValueModal
        key={`${selectedEditRow?.id ?? 'empty'}-${isSingleEditModalOpen ? 'open' : 'closed'}`}
        open={isSingleEditModalOpen}
        rowId={selectedEditRow?.id ?? null}
        initialValue={selectedEditRow?.rateCardValue ?? ''}
        onClose={handleCloseSingleEditModal}
        onSave={handleSaveSingleEdit}
      />

      <BulkEditRateCardModal
        open={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        selectedCount={selectedRowIds.length}
        onApply={handleApplyBulkValue}
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

export default RateCardsPage
