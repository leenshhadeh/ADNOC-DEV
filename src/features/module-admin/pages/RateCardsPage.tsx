import { useMemo, useState } from 'react'
import AdminToolbar from '../components/AdminToolbar'
import RateCardsTable from '../components/rate-cards/RateCardsTable'
import BulkEditRateCardModal from '../components/rate-cards/BulkEditRateCardModal'
import { initialRateCardsData } from '../components/rate-cards/constants'
import { flattenRateCards } from '../components/rate-cards/utils'
import { Pencil, Save, X, Download } from 'lucide-react'
const RateCardsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState(() => flattenRateCards(initialRateCardsData))

  const [isBulkEditMode, setIsBulkEditMode] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)

  const handleRateCardValueChange = (rowId: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              rateCardValue: value === '' ? '' : Number(value),
            }
          : row,
      ),
    )
  }

  const handleToggleBulkEditMode = () => {
    setIsBulkEditMode(true)
    setSelectedRowIds([])
  }

  const handleCancelBulkEdit = () => {
    setIsBulkEditMode(false)
    setSelectedRowIds([])
    setIsBulkEditModalOpen(false)
  }

  const handleToggleRowSelection = (rowId: string, checked: boolean) => {
    setSelectedRowIds((prev) => (checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)))
  }

  const handleApplyBulkValue = (value: string) => {
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
  }

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

  const actions = useMemo(() => {
    if (isBulkEditMode) {
      return [
        {
          id: 'edit',
          label: 'Edit',
          onClick: () => setIsBulkEditModalOpen(true),
          disabled: selectedRowIds.length === 0 ? true : false,
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
          return
        },
        icon: Download,
      },
    ]
  }, [isBulkEditMode, selectedRowIds.length])

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar
        title="Manage rate values applied to manual effort calculations across L3 processes."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search"
        actions={actions}
      />

      <RateCardsTable
        data={filteredData}
        isBulkEditMode={isBulkEditMode}
        selectedRowIds={selectedRowIds}
        onToggleRowSelection={handleToggleRowSelection}
        onRateCardValueChange={handleRateCardValueChange}
      />

      <BulkEditRateCardModal
        open={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        selectedCount={selectedRowIds.length}
        onApply={handleApplyBulkValue}
      />
    </div>
  )
}

export default RateCardsPage
