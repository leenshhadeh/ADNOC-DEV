import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import DataTable from '@/shared/components/data-table/DataTable'
import {
  ProcessInfoCell,
  StageProgressCell,
  StatusBadgeCell,
  type CatalogStatus,
  UserBadgeCell,
} from '@/shared/components/cells'
import RequestDetailsSheet from '../sidePanels/RequestDetailsSheet'

import type { RequestItem } from '@features/module-assessment-data/types/submitted-requests'
import { useGetSubmittedRequests } from '@features/module-assessment-data/hooks/useGetSubmittedRequests'

const SubmittedRequestsTable = () => {
  const { data: requests, isLoading, isError } = useGetSubmittedRequests()
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
        id: 'domain',
        accessorKey: 'domain',
        header: 'Domain',
        size: 150,
        cell: (info) => {
          if (info.row.depth > 0) return null
          return (
            <div className="flex min-h-[40px] flex-col justify-center">
              <span className="block max-w-[120px] font-normal break-words whitespace-normal text-[#687076]">
                {String(info.getValue())}
              </span>
            </div>
          )
        },
      },
      {
        id: 'requester',
        accessorKey: 'requester',
        header: 'Requester',
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
              active={row.status === 'Published'}
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
