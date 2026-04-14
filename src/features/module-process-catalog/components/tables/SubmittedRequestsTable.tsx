import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import LevelsIcon from '@/assets/icons/Levels.svg?react'

import { Button } from '@/shared/components/ui/button'
import DataTable from '@/shared/components/data-table/DataTable'
import {
  ProcessInfoCell,
  StageProgressCell,
  StatusBadgeCell,
  type CatalogStatus,
  UserBadgeCell,
} from '@/shared/components/cells'
import RequestDetailsSheet from './RequestDetailsSheet'

import type { RequestItem } from '@features/module-process-catalog/types/submitted-requests'
import { useGetSubmittedRequests } from '@features/module-process-catalog/hooks/useGetSubmittedRequests'
import { useCatalogNavStore } from '@features/module-process-catalog/store/useCatalogNavStore'

const LevelCell = ({ level }: { level: string }) => {
  return (
    <div className="text-foreground flex items-center gap-1 text-start text-sm font-medium">
      <LevelsIcon />
      {level}
    </div>
  )
}

const SubmittedRequestsTable = () => {
  const { data: requests, isLoading, isError } = useGetSubmittedRequests()
  const navigateToProcess = useCatalogNavStore((s) => s.navigateToProcess)
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
        size: 200,
        meta: { isDivider: true },
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
        size: 80,
        cell: (info) => <LevelCell level={String(info.getValue())} />,
      },
      {
        id: 'requester',
        accessorKey: 'requester',
        header: 'Requester',
        size: 160,
        cell: (info) => <UserBadgeCell name={String(info.getValue())} />,
      },
      {
        id: 'approver',
        accessorKey: 'approver',
        header: 'Approver',
        size: 160,
        cell: (info) => <UserBadgeCell name={String(info.getValue())} />,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: 155,
        cell: (info) => <StatusBadgeCell status={info.getValue() as CatalogStatus} />,
      },
      {
        id: 'stage',
        header: 'Process Stage',
        size: 280,
        cell: (info) => {
          const row = info.row.original
          return (
            <StageProgressCell
              currentStep={row.stageCurrent}
              totalSteps={row.stageTotal}
              statusText={row.stageText}
            />
          )
        },
      },
      {
        id: 'submittedOn',
        accessorKey: 'submittedOn',
        header: 'Submitted On',
        size: 130,
      },
      {
        id: 'publishedOn',
        accessorKey: 'publishedOn',
        header: 'Published On',
        size: 130,
      },
      {
        id: 'actions',
        size: 120,
        meta: { multiline: true },
        header: 'Go To Affected Record',
        cell: (info) => {
          const row = info.row.original
          return (
            <div className="flex justify-center">
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                className="text-muted-foreground rounded-full"
                disabled={!row.processId}
                aria-label="Go to affected record"
                onClick={() => row.processId && navigateToProcess(row.processId)}
              >
                <Eye className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [],
  )

  if (isError) {
    return (
      <p className="text-destructive px-1 py-4 text-sm">
        Failed to load submitted requests. Please refresh and try again.
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-muted h-14 w-full animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={requests ?? []}
        className="table-light"
        density="comfortable"
        className="overflow-x-auto"
        initialColumnPinning={{ left: ['processName'] }}
        tableMeta={{ rowDividers: true }}
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
