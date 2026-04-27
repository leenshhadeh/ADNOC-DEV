import { useNavigate } from 'react-router-dom'

import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'

import type { RequestItem } from '@features/module-assessment-data/types/submitted-requests'
import ProcessDetailsSheet, {
  type ChangeItem,
} from '@features/module-process-catalog/components/modals/ProcessDetailsSheet'

// ── Main component ────────────────────────────────────────────────────────────

interface RequestDetailsSheetProps {
  request: RequestItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RequestDetailsSheet = ({ request, open, onOpenChange }: RequestDetailsSheetProps) => {
  const navigate = useNavigate()

  if (!request) return null

  const changes: ChangeItem[] = request.changes.map((c) => ({
    id: c.id,
    label: c.label,
    oldValue: c.oldValue,
    newValue: c.newValue,
  }))

  const detailsGrid = (
    <>
      <section className="pt-4">
        <p className="text-muted-foreground mb-3 text-sm font-medium">Process details</p>
        <div className="grid grid-cols-2">
          <div className="border-border border-r border-b pe-4 pb-3">
            <p className="text-muted-foreground text-xs">Domain</p>
            <p className="text-foreground mt-0.5 font-semibold">{request.domain ?? '—'}</p>
          </div>
          <div className="border-border border-b ps-4 pb-3">
            <p className="text-muted-foreground text-xs">Process Level</p>
            <p className="text-foreground mt-0.5 font-semibold">{request.processLevel ?? '—'}</p>
          </div>
          <div className="border-border border-r pe-4 pt-3">
            <p className="text-muted-foreground text-xs">Level 1</p>
            <p className="text-foreground mt-0.5 font-semibold">{request.level1 ?? '—'}</p>
          </div>
          <div className="ps-4 pt-3">
            <p className="text-muted-foreground text-xs">Level 2</p>
            <p className="text-foreground mt-0.5 font-semibold">{request.level2 ?? '—'}</p>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      <section>
        <p className="text-muted-foreground mb-3 text-sm font-medium">People Involved</p>
        <div className="grid grid-cols-2">
          <div className="border-border border-r pe-4">
            <p className="text-muted-foreground text-xs">Requester</p>
            <p className="text-foreground mt-0.5 font-semibold">{request.requester}</p>
          </div>
          <div className="ps-4">
            <p className="text-muted-foreground text-xs">Business focal point</p>
            <p className="text-foreground mt-0.5 font-semibold">
              {request.businessFocalPoint ?? '—'}
            </p>
          </div>
        </div>
      </section>
    </>
  )

  const changesPreamble =
    request.returnComment || request.rejectComment ? (
      <>
        {request.returnComment && (
          <div className="mt-4 rounded-xl border border-[#F9D4E0] bg-[#FFF5F7] px-4 py-3">
            <p className="text-muted-foreground mb-1 text-xs font-medium">Reason for return</p>
            <p className="text-foreground text-sm">{request.returnComment}</p>
          </div>
        )}
        {request.rejectComment && (
          <div className="mt-4 rounded-xl border border-[#F9D4E0] bg-[#FFF5F7] px-4 py-3">
            <p className="text-muted-foreground mb-1 text-xs font-medium">Reason for rejection</p>
            <p className="text-foreground text-sm">{request.rejectComment}</p>
          </div>
        )}
      </>
    ) : undefined

  return (
    <ProcessDetailsSheet
      title={request.processName}
      open={open}
      onOpenChange={onOpenChange}
      processId={request.processId}
      onGoToRecord={() => {
        if (request.processId) navigate(`/assessment-data/process/${request.processId}`)
      }}
      primaryLinkLabel="View full card"
      headerBadge={
        request.processCategory ? (
          <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm font-medium">
            {request.processCategory}
          </Badge>
        ) : undefined
      }
      stageCurrent={request.stageCurrent}
      stageTotal={request.stageTotal}
      stageText={request.stageText}
      detailsGrid={detailsGrid}
      changes={changes}
      changesPreamble={changesPreamble}
      workflowHistory={request.workflowHistory ?? []}
    />
  )
}

export default RequestDetailsSheet
