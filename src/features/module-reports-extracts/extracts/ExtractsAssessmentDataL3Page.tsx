import extractsData from '../data/extracts_assessment_data_l3.json'
import { useMemo, useState } from 'react'
import { ChevronLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'

import ModuleToolbar from '@/shared/components/ModuleToolbar'
import DataTable from '@/shared/components/data-table/DataTable'
type ExtractValue = string | number | boolean | null
type ExtractRow = Record<string, ExtractValue>

type ExtractJson = {
  workbook_name: string
  sheet_name: string
  column_count: number
  record_count: number
  headers: string[]
  keys: string[]
  data: ExtractRow[]
}

const report = extractsData as ExtractJson

const downloadCsv = (rows: ExtractRow[]) => {
  const headers = report.headers
  const csvRows = rows.map((row) => report.keys.map((key) => row[key] ?? ''))

  const escapeCell = (value: string) => `"${String(value).replace(/"/g, '""')}"`
  const csv = [headers, ...csvRows].map((row) => row.map(escapeCell).join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'extracts_assessment_data_l3.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const ExtractsAssessmentDataL3Page = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const rows = report.data ?? []

  const filteredData = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return rows.filter((row) => {
      const searchTarget = Object.values(row)
        .filter((value) => value != null)
        .join(' ')
        .toLowerCase()

      const matchesSearch = query ? searchTarget.includes(query) : true

      return matchesSearch
    })
  }, [rows, searchValue])

  const columns = useMemo<ColumnDef<ExtractRow>[]>(
    () =>
      report.keys.map((key, index) => ({
        id: key,
        accessorKey: key,
        header: report.headers[index] ?? key,
        size: 220,
        cell: ({ row }) => {
          const value = row.original[key]
          return (
            <div className="w-fit max-w-[260px]">
              <div className="max-h-[96px] overflow-y-auto pr-1">
                <p className="text-[12px] leading-6 break-words whitespace-normal text-[#3A404A]">
                  {value == null || value === '' ? '-' : String(value)}
                </p>
              </div>
            </div>
          )
        },
      })),
    [],
  )

  return (
    <div className="min-h-screen p-6">
      <div>
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate('/reports-and-extracts')} className="p-2">
            <ChevronLeft className="h-5 w-5 text-[#344054]" />
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[40px] leading-[48px] font-semibold tracking-[-0.5px] text-[#1F2430]">
              Assesment Data L3
            </h1>
          </div>
        </div>

        <div className="mb-6">
          <ModuleToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search"
            showFilter
            onFilterClick={() => {}}
            actions={[
              {
                id: 'export',
                label: 'Export full report',
                icon: Download,
                onClick: () => downloadCsv(filteredData),
              },
            ]}
          />
        </div>

        <div className="overflow-auto">
          <DataTable
            data={filteredData}
            columns={columns}
            enableColumnDnd={false}
            enableSorting
            tableMeta={{ rowDividers: true }}
            density="comfortable"
            className="[&_p]:break-words [&_p]:whitespace-normal [&_td]:align-top [&_td]:break-words [&_td]:whitespace-normal"
          />
        </div>
      </div>
    </div>
  )
}

export default ExtractsAssessmentDataL3Page
