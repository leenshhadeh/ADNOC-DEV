import { Separator } from '@/shared/components/ui/separator'

import { useCatalogNavStore } from '@features/module-process-catalog/store/useCatalogNavStore'
import type { RequestItem } from '@features/module-process-catalog/types/submitted-requests'

import ProcessDetailsSheet, { type ChangeItem } from './ProcessDetailsSheet'

// ── Main component ────────────────────────────────────────────────────────────

interface RequestDetailsSheetProps {
  request: RequestItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RequestDetailsSheet = ({ request, open, onOpenChange }: RequestDetailsSheetProps) => {
  const navigateToProcess = useCatalogNavStore((s) => s.navigateToProcess)

  if (!request) return null

  const changes: ChangeItem[] = request.changes.map((c) => ({
    id: c.id,
    label: c.label,
    oldValue: c.oldValue,
    newValue: c.newValue,
  }))

  const detailsGrid = (
    <>
      {/* Process details */}
      <section className="pt-4">
        <p className="text-muted-foreground mb-3 text-sm font-medium">Process details</p>
        <div className="grid grid-cols-2">
          <div className="border-border border-r border-b pe-4 pb-3">
            <p className="text-muted-foreground text-sm font-light">Domain</p>
            <p className="text-foreground mt-0.5 text-sm font-medium">{request.domain ?? '—'}</p>
          </div>
          <div className="border-border border-b ps-4 pb-3">
            <p className="text-muted-foreground text-sm font-light">Process Level</p>
            <p className="text-foreground mt-0.5 text-sm font-medium">
              {request.processLevel ?? '—'}
            </p>
          </div>
          <div className="border-border border-r pe-4 pt-3">
            <p className="text-muted-foreground text-sm font-light">Level 1</p>
            <p className="text-foreground mt-0.5 text-sm font-medium">{request.level1 ?? '—'}</p>
          </div>
          <div className="ps-4 pt-3">
            <p className="text-muted-foreground text-sm font-light">Level 2</p>
            <p className="text-foreground mt-0.5 text-sm font-medium">{request.level2 ?? '—'}</p>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      {/* People involved */}
      <section>
        <p className="text-muted-foreground mb-3 text-sm font-medium">People Involved</p>
        <div className="grid grid-cols-2">
          <div className="border-border border-r pe-4">
            <p className="text-muted-foreground text-sm font-light">Requester</p>
            <p className="text-foreground mt-0.5 text-sm font-medium">{request.requester}</p>
          </div>
          <div className="ps-4">
            <p className="text-muted-foreground text-sm font-light">Business focal point</p>
            <p className="text-foreground mt-0.5 text-sm font-medium">
              {request.businessFocalPoint ?? request.approver}
            </p>
          </div>
        </div>
      </section>
    </>
  )

  return (
    <ProcessDetailsSheet
      title={request.processName}
      open={open}
      onOpenChange={onOpenChange}
      processId={request.processId}
      onGoToRecord={() => {
        if (request.processId) navigateToProcess(request.processId)
      }}
      stageCurrent={request.stageCurrent}
      stageTotal={request.stageTotal}
      stageText={request.stageText}
      detailsGrid={detailsGrid}
      changes={changes}
      workflowHistory={request.workflowHistory ?? []}
    />
  )
}

export default RequestDetailsSheet
