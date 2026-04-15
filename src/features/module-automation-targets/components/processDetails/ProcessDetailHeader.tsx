import CopyText from '@/shared/components/CopyText'
import StatusBadgeCell from '@/shared/components/cells/StatusBadgeCell'
import type { AutomationProcessDetail } from '../../types'

interface ProcessDetailHeaderProps {
  process: AutomationProcessDetail
}

const ProcessDetailHeader = ({ process }: ProcessDetailHeaderProps) => {
  const items = [
    { label: 'Group Company', value: process.groupCompany },
    { label: 'Domain', value: process.domain },
    { label: 'Process Code', value: process.code, canCopy: true },
    { label: 'Status', value: process.status, isStatus: true },
    {
      label: `Process Stage (${process.stageCurrent}/${process.stageTotal})`,
      value: 'Quality review',
    },
    { label: 'Process Applicability', value: process.processApplicability ? 'Yes' : 'No' },
    { label: 'Last Published Date', value: process.lastPublishedDate },
    { label: 'Marked Review Date', value: process.markedReviewDate },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {items.map((item) => (
        <div key={item.label} className="border-l border-gray-300 px-4 first:border-l-0 first:ps-0">
          <span className="text-muted-foreground text-sm">{item.label}</span>
          <div className="flex">
            {item.canCopy ? (
              <CopyText text={item.value as string} />
            ) : item.isStatus ? (
              <StatusBadgeCell status={process.status} />
            ) : (
              <span className="text-foreground text-sm">{item.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProcessDetailHeader
