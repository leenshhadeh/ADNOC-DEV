import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/shared/components/ui/button'
import DataTable from '@features/module-process-catalog/components/data-table/DataTable'
import {
  ProcessInfoCell,
  StageProgressCell,
  StatusBadgeCell,
  type CatalogStatus,
  UserBadgeCell,
} from '@features/module-process-catalog/components/cells'
import RequestDetailsSheet from './RequestDetailsSheet'

import type { RequestItem } from '@features/module-process-catalog/types/submitted-requests'
import { SUBMITTED_REQUESTS } from '@features/module-process-catalog/constants/submitted-requests'

const LevelCell = ({ level }: { level: string }) => {
  return (
    <div className="text-foreground flex items-center gap-2 text-start text-[1.02rem] font-medium">
      <span className="text-muted-foreground inline-flex h-5 items-end gap-0.5" aria-hidden="true">
        <span className="h-4 w-1 rounded-sm bg-current" />
        <span className="h-5 w-1 rounded-sm bg-current" />
        <span className="h-3 w-1 rounded-sm bg-current" />
      </span>
      {level}
    </div>
  )
}

const SubmittedRequestsTable = () => {
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleOpenDetails = (request: RequestItem) => {
    setSelectedRequest(request)
    setIsDetailsOpen(true)
  }

  const columns = useMemo<ColumnDef<RequestItem, unknown>[]>(
    () => [
      {
        id: 'processName',
        accessorKey: 'processName',
        header: 'Process Name',
        cell: (info) => {
          const row = info.row.original
          return (
            <button
              type="button"
              className="focus-visible:ring-ring w-full cursor-pointer text-start outline-none focus-visible:ring-2"
              onClick={() => handleOpenDetails(row)}
            >
              <ProcessInfoCell processName={row.processName} requestId={row.requestId} />
            </button>
          )
        },
      },
      {
        id: 'level',
        accessorKey: 'level',
        header: 'Level',
        cell: (info) => <LevelCell level={String(info.getValue())} />,
      },
      {
        id: 'requester',
        accessorKey: 'requester',
        header: 'Requester',
        cell: (info) => <UserBadgeCell name={String(info.getValue())} />,
      },
      {
        id: 'approver',
        accessorKey: 'approver',
        header: 'Approver',
        cell: (info) => <UserBadgeCell name={String(info.getValue())} />,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusBadgeCell status={info.getValue() as CatalogStatus} />,
      },
      {
        id: 'stage',
        header: 'Process Stage',
        cell: (info) => {
          const row = info.row.original
          return (
            <StageProgressCell
              currentStep={row.stageCurrent}
              totalSteps={row.stageTotal}
              statusText={row.stageText}
              active={row.status === 'Published'}
            />
          )
        },
      },
      {
        id: 'submittedOn',
        accessorKey: 'submittedOn',
        header: 'Submitted On',
      },
      {
        id: 'publishedOn',
        accessorKey: 'publishedOn',
        header: 'Published On',
      },
      {
        id: 'actions',
        header: () => (
          <div className="text-muted-foreground w-[132px] text-center text-xs leading-5 font-medium tracking-wide whitespace-normal uppercase">
            Go To Affected Record
          </div>
        ),
        cell: () => (
          <div className="flex w-[132px] justify-center">
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              className="text-muted-foreground rounded-full"
              aria-label="Go To Affected Record"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={SUBMITTED_REQUESTS}
        density="comfortable"
        className="overflow-x-auto"
      />
      <RequestDetailsSheet
        request={selectedRequest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  )
}

export default SubmittedRequestsTable
