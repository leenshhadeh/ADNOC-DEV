import { useMemo, useState } from 'react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Eye, Pencil, Plus, RotateCcw, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import CatalogHeader, { type CatalogTabValue } from './CatalogHeader'
import DataTable from './data-table/DataTable'
import type { RowAction } from './data-table/interfaces'
import YesNoDropdownCell, { type YesNoValue } from './data-table/YesNoDropdownCell'
import MyTasksTable from './tables/MyTasksTable'
import SubmittedRequestsTable from './tables/SubmittedRequestsTable'

type ProcessNode = {
  id: string
  name: string
  code: string
  status: 'Published' | 'Draft'
  siteC: YesNoValue
  description: string
  subRows?: ProcessNode[]
}

const data: ProcessNode[] = [
  {
    id: 'lvl1-1',
    name: 'Exploration',
    code: 'EXP.1',
    status: 'Published',
    siteC: 'No',
    description: 'Comprehensive exploration data interpretation and planning.',
    subRows: [
      {
        id: 'lvl2-1',
        name: 'Regional studies',
        code: 'EXP.1.1',
        status: 'Published',
        siteC: 'No',
        description: 'Regional basin modeling and geophysical interpretation.',
        subRows: [
          {
            id: 'lvl3-1',
            name: 'Basin Modeling',
            code: 'EXP.1.1.1',
            status: 'Published',
            siteC: 'Yes',
            description: 'Regional tectonic and petroleum system simulation.',
          },
          {
            id: 'lvl3-2',
            name: 'Geophysical Data Interpretation',
            code: 'EXP.1.1.2',
            status: 'Draft',
            siteC: 'No',
            description: 'Interpret seismic data and validate structural trends.',
          },
        ],
      },
      {
        id: 'lvl2-2',
        name: 'Play Assessment',
        code: 'EXP.1.2',
        status: 'Draft',
        siteC: 'No',
        description: 'Assess play potential and prospectivity for prioritization.',
      },
    ],
  },
  {
    id: 'lvl1-2',
    name: 'Field Development',
    code: 'EXP.2',
    status: 'Published',
    siteC: 'Yes',
    description: 'Integrate reservoir insights into field development plans.',
    subRows: [
      {
        id: 'lvl2-3',
        name: 'Subsurface Modeling',
        code: 'EXP.2.1',
        status: 'Published',
        siteC: 'No',
        description: 'Build integrated geological and dynamic models.',
      },
    ],
  },
]

const CatalogModule = () => {
  const [activeTab, setActiveTab] = useState<CatalogTabValue>('processes')
  const [isAddL2ModalOpen, setIsAddL2ModalOpen] = useState(false)
  const [numberOfProcesses, setNumberOfProcesses] = useState('1')
  const [targetRowName, setTargetRowName] = useState('')

  const columns = useMemo<ColumnDef<ProcessNode, unknown>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Process',
        cell: info => <span className="font-medium">{String(info.getValue())}</span>,
      },
      {
        id: 'code',
        accessorKey: 'code',
        header: 'Code',
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const value = String(info.getValue())

          return (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{value}</span>
          )
        },
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
      },
      {
        id: 'siteC',
        accessorKey: 'siteC',
        header: 'Site C',
        cell: info => <YesNoDropdownCell defaultValue={info.getValue() as YesNoValue} />,
      },
    ],
    []
  )

  const getRowActions = (row: Row<ProcessNode>): RowAction<ProcessNode>[] => [
    {
      id: 'add-l2-processes',
      label: 'Add L2 processes',
      icon: <Plus className="size-4" />,
      onSelect: currentRow => {
        setTargetRowName(currentRow.name)
        setIsAddL2ModalOpen(true)
      },
    },
    {
      id: 'view-recorded-changes',
      label: 'View recorded changes',
      icon: <Eye className="size-4" />,
      onSelect: currentRow => {
        console.log('View recorded changes', currentRow.id)
      },
    },
    {
      id: 'switch-version',
      label: row.original.status === 'Published' ? 'Switch to Draft version' : 'Switch to Published version',
      icon: <RotateCcw className="size-4" />,
      onSelect: currentRow => {
        console.log('Switch version', currentRow.id)
      },
    },
    {
      id: 'rename',
      label: 'Rename',
      icon: <Pencil className="size-4" />,
      onSelect: currentRow => {
        console.log('Rename', currentRow.id)
      },
    },
  ]

  return (
    <section className="space-y-4">
      <CatalogHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'processes' ? (
        <DataTable columns={columns} data={data} density="compact" getSubRows={row => row.subRows} getRowActions={getRowActions} />
      ) : activeTab === 'myTasks' ? (
        <MyTasksTable />
      ) : activeTab === 'submittedRequests' ? (
        <SubmittedRequestsTable />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 text-start">
          <h2 className="text-lg font-medium text-foreground">Tab content</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tab content placeholder.</p>
        </div>
      )}

      {isAddL2ModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-[560px] rounded-2xl border border-border bg-background p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-4xl/none font-semibold text-foreground">Add multiple processes</h2>
                <p className="mt-3 text-lg text-muted-foreground">Please select the number of processes you want to add.</p>
                {targetRowName ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Parent process: <span className="font-medium text-foreground">{targetRowName}</span>
                  </p>
                ) : null}
              </div>

              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => setIsAddL2ModalOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="mt-8 space-y-3">
              <label htmlFor="process-count" className="text-lg text-foreground">
                How many processes you want to add?
              </label>
              <select
                id="process-count"
                value={numberOfProcesses}
                onChange={event => setNumberOfProcesses(event.target.value)}
                className="h-14 w-full rounded-xl border border-border bg-background ps-4 pe-4 text-lg text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {[1, 2, 3, 4, 5].map(value => (
                  <option key={value} value={String(value)}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-12 rounded-full"
                onClick={() => setIsAddL2ModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-12 rounded-full"
                onClick={() => {
                  console.log('Add L2 processes', { count: numberOfProcesses, parent: targetRowName })
                  setIsAddL2ModalOpen(false)
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default CatalogModule