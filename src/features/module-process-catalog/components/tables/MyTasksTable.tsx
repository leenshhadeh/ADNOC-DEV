import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import DataTable from "../data-table/DataTable"
import { ProcessInfoCell, StageProgressCell, StatusBadgeCell, type CatalogStatus, UserBadgeCell } from "../cells"

export interface TaskItem {
  id: string
  processName: string
  requestId: string
  level: string
  domain: string
  stageCurrent: number
  stageTotal: number
  stageText: string
  requester: string
  status: CatalogStatus
}

const taskItems: TaskItem[] = [
  {
    id: "task-1",
    processName: "Regional studies",
    requestId: "9377353",
    level: "L 3",
    domain: "Corporate Communications",
    stageCurrent: 1,
    stageTotal: 3,
    stageText: "Pending updates",
    requester: "Maryam Al Shamsi",
    status: "Returned draft",
  },
  {
    id: "task-2",
    processName: "Define Budget and Schedule",
    requestId: "9377353",
    level: "L 3",
    domain: "Corporate Communications",
    stageCurrent: 1,
    stageTotal: 3,
    stageText: "Pending updates",
    requester: "Maryam Al Shamsi",
    status: "Returned draft",
  },
  {
    id: "task-3",
    processName: "Develop external communication",
    requestId: "9377353",
    level: "L 3",
    domain: "Corporate Communications",
    stageCurrent: 1,
    stageTotal: 3,
    stageText: "Pending updates",
    requester: "Maryam Al Shamsi",
    status: "Returned draft",
  },
  {
    id: "task-4",
    processName: "Prepare media materials",
    requestId: "9377353",
    level: "L 3",
    domain: "Corporate Communications",
    stageCurrent: 1,
    stageTotal: 3,
    stageText: "Pending updates",
    requester: "Maryam Al Shamsi",
    status: "Returned draft",
  },
  {
    id: "task-5",
    processName: "Defining brand performance",
    requestId: "9377353",
    level: "L 3",
    domain: "Corporate Communications",
    stageCurrent: 1,
    stageTotal: 3,
    stageText: "Pending updates",
    requester: "Maryam Al Shamsi",
    status: "Returned draft",
  },
]

const LevelCell = ({ level }: { level: string }) => {
  return (
    <div className="flex items-center gap-2 text-start text-[1.02rem] font-medium text-foreground">
      <span className="inline-flex h-5 items-end gap-0.5 text-muted-foreground" aria-hidden="true">
        <span className="h-4 w-1 rounded-sm bg-current" />
        <span className="h-5 w-1 rounded-sm bg-current" />
        <span className="h-3 w-1 rounded-sm bg-current" />
      </span>
      {level}
    </div>
  )
}

const MyTasksTable = () => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows(current => ({ ...current, [id]: !current[id] }))
  }

  const columns = useMemo<ColumnDef<TaskItem, unknown>[]>(
    () => [
      {
        id: "processName",
        accessorKey: "processName",
        header: "Process Name",
        cell: info => {
          const row = info.row.original
          return (
            <ProcessInfoCell
              processName={row.processName}
              requestId={row.requestId}
              showChevron
              expanded={Boolean(expandedRows[row.id])}
              onToggle={() => toggleRow(row.id)}
            />
          )
        },
      },
      {
        id: "level",
        accessorKey: "level",
        header: "Level",
        cell: info => <LevelCell level={String(info.getValue())} />,
      },
      {
        id: "domain",
        accessorKey: "domain",
        header: "Domain",
        cell: info => <span className="text-[1.02rem] text-foreground">{String(info.getValue())}</span>,
      },
      {
        id: "stage",
        header: "Process Stage",
        cell: info => {
          const row = info.row.original
          return (
            <StageProgressCell
              currentStep={row.stageCurrent}
              totalSteps={row.stageTotal}
              statusText={row.stageText}
              active
            />
          )
        },
      },
      {
        id: "requester",
        accessorKey: "requester",
        header: "Requester",
        cell: info => <UserBadgeCell name={String(info.getValue())} />,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: info => <StatusBadgeCell status={info.getValue() as CatalogStatus} />,
      },
    ],
    [expandedRows]
  )

  return <DataTable columns={columns} data={taskItems} density="comfortable" />
}

export default MyTasksTable
