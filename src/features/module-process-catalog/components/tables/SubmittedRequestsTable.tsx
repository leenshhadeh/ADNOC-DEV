import { useMemo, useState } from "react"
import { Eye } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/shared/components/ui/button"
import DataTable from "../data-table/DataTable"
import { ProcessInfoCell, StageProgressCell, StatusBadgeCell, type CatalogStatus, UserBadgeCell } from "../cells"
import RequestDetailsSheet from "./RequestDetailsSheet"

export interface RequestItem {
  id: string
  processName: string
  requestId: string
  level: string
  requester: string
  approver: string
  status: CatalogStatus
  stageCurrent: number
  stageTotal: number
  stageText: string
  submittedOn: string
  publishedOn: string
  changes: Array<{
    id: string
    label: string
    oldValue: string
    newValue: string
  }>
}

const requestItems: RequestItem[] = [
  {
    id: "request-1",
    processName: "Play-based exploration",
    requestId: "9377353",
    level: "L 3",
    requester: "Maryam Al Shamsi",
    approver: "Khaled Al Mansoori",
    status: "Pending approval",
    stageCurrent: 2,
    stageTotal: 3,
    stageText: "Pending custodian approval",
    submittedOn: "08 Apr 2024",
    publishedOn: "-",
    changes: [
      {
        id: "description",
        label: "Process description",
        oldValue: "-",
        newValue: "Creating a communication plan",
      },
      {
        id: "parent-name",
        label: "Process parent name (L2)",
        oldValue: "Regional studies",
        newValue: "Studies",
      },
      {
        id: "applicability",
        label: "Applicability",
        oldValue: "ADNOC - Onshore",
        newValue: "ADNOC - Offshore",
      },
      {
        id: "shared-service",
        label: "Shared service",
        oldValue: "No",
        newValue: "Yes",
      },
    ],
  },
  {
    id: "request-2",
    processName: "Define Budget and Schedule",
    requestId: "9377353",
    level: "L 3",
    requester: "Mohammed Al Hajeri",
    approver: "Khaled Al Mansoori",
    status: "Returned draft",
    stageCurrent: 1,
    stageTotal: 3,
    stageText: "Pending updates",
    submittedOn: "09 Apr 2024",
    publishedOn: "-",
    changes: [
      {
        id: "description",
        label: "Process description",
        oldValue: "Draft description",
        newValue: "Updated process scope",
      },
      {
        id: "parent-name",
        label: "Process parent name (L2)",
        oldValue: "Planning",
        newValue: "Budget planning",
      },
      {
        id: "applicability",
        label: "Applicability",
        oldValue: "Corporate",
        newValue: "Corporate + Group",
      },
      {
        id: "shared-service",
        label: "Shared service",
        oldValue: "No",
        newValue: "No",
      },
    ],
  },
  {
    id: "request-3",
    processName: "Develop external communication",
    requestId: "9377353",
    level: "L 3",
    requester: "Noura Al Ghamdi",
    approver: "Khaled Al Mansoori",
    status: "Pending signoff",
    stageCurrent: 3,
    stageTotal: 3,
    stageText: "Program manager signoff",
    submittedOn: "10 Apr 2024",
    publishedOn: "-",
    changes: [
      {
        id: "description",
        label: "Process description",
        oldValue: "External comms draft",
        newValue: "External comms final",
      },
      {
        id: "parent-name",
        label: "Process parent name (L2)",
        oldValue: "Campaign management",
        newValue: "Comms management",
      },
      {
        id: "applicability",
        label: "Applicability",
        oldValue: "Internal",
        newValue: "Internal + External",
      },
      {
        id: "shared-service",
        label: "Shared service",
        oldValue: "Yes",
        newValue: "Yes",
      },
    ],
  },
  {
    id: "request-4",
    processName: "Prepare media materials",
    requestId: "9377353",
    level: "L 3",
    requester: "Maryam Al Shamsi",
    approver: "Khaled Al Mansoori",
    status: "Pending approval",
    stageCurrent: 2,
    stageTotal: 3,
    stageText: "Pending custodian approval",
    submittedOn: "07 Apr 2024",
    publishedOn: "-",
    changes: [
      {
        id: "description",
        label: "Process description",
        oldValue: "Media draft",
        newValue: "Media delivery package",
      },
      {
        id: "parent-name",
        label: "Process parent name (L2)",
        oldValue: "Operations",
        newValue: "Media operations",
      },
      {
        id: "applicability",
        label: "Applicability",
        oldValue: "ADNOC HQ",
        newValue: "All entities",
      },
      {
        id: "shared-service",
        label: "Shared service",
        oldValue: "No",
        newValue: "Yes",
      },
    ],
  },
  {
    id: "request-5",
    processName: "Defining brand performance",
    requestId: "9377353",
    level: "L 3",
    requester: "Noura Al Ghamdi",
    approver: "Khaled Al Mansoori",
    status: "Published",
    stageCurrent: 3,
    stageTotal: 3,
    stageText: "Program manager signoff",
    submittedOn: "06 Apr 2024",
    publishedOn: "13 May 2024",
    changes: [
      {
        id: "description",
        label: "Process description",
        oldValue: "Brand KPI process",
        newValue: "Brand performance framework",
      },
      {
        id: "parent-name",
        label: "Process parent name (L2)",
        oldValue: "Branding",
        newValue: "Brand strategy",
      },
      {
        id: "applicability",
        label: "Applicability",
        oldValue: "Marketing",
        newValue: "Corporate communications",
      },
      {
        id: "shared-service",
        label: "Shared service",
        oldValue: "No",
        newValue: "Yes",
      },
    ],
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
        id: "processName",
        accessorKey: "processName",
        header: "Process Name",
        cell: info => {
          const row = info.row.original
          return (
            <button
              type="button"
              className="w-full cursor-pointer text-start outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => handleOpenDetails(row)}
            >
              <ProcessInfoCell processName={row.processName} requestId={row.requestId} />
            </button>
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
        id: "requester",
        accessorKey: "requester",
        header: "Requester",
        cell: info => <UserBadgeCell name={String(info.getValue())} />,
      },
      {
        id: "approver",
        accessorKey: "approver",
        header: "Approver",
    cell: info => <UserBadgeCell name={String(info.getValue())} />,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: info => <StatusBadgeCell status={info.getValue() as CatalogStatus} />,
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
              active={row.status === "Published"}
            />
          )
        },
      },
      {
        id: "submittedOn",
        accessorKey: "submittedOn",
        header: "Submitted On",
      },
      {
        id: "publishedOn",
        accessorKey: "publishedOn",
        header: "Published On",
      },
      {
        id: "actions",
        header: () => (
          <div className="w-[132px] text-center text-xs font-medium leading-5 uppercase tracking-wide text-muted-foreground whitespace-normal">
            Go To Affected Record
          </div>
        ),
        cell: () => (
          <div className="flex w-[132px] justify-center">
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              className="rounded-full text-muted-foreground"
              aria-label="Go To Affected Record"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <>
      <DataTable columns={columns} data={requestItems} density="comfortable" className="overflow-x-auto" />
      <RequestDetailsSheet request={selectedRequest} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </>
  )
}

export default SubmittedRequestsTable
