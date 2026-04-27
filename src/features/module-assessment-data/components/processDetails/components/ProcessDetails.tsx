import {
  StageProgressCell,
  StatusBadgeCell,
} from '@/features/module-process-catalog/components/cells'
import CopyText from '@/shared/components/CopyText'
import { RadioCell } from '@/shared/components/table-primitives'
const ProcessDetails = (props: any) => {
  const { data, isEditable = true } = props
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {data?.map((item: any) => (
        <div key={item.label} className="border-l border-gray-300 px-4 first:border-l-0 first:ps-0">
          <span className="text-muted-foreground text-sm">
            {item.label} {item.stageCurrent ? `(${item.stageCurrent}/${item.stageTotal})` : ''}
          </span>
          {/* value: */}
          <div className="flex">
            {item.canCopy ? (
              <CopyText text={item.value} />
            ) : item.label == 'Status' ? (
              <StatusBadgeCell status={item.value} />
            ) : item.isEditable ? (
              <>
                <RadioCell value={item.value} disabled={!isEditable} />
              </>
            ) : item.label == 'Process stage' ? (
              <StageProgressCell
                currentStep={item.stageCurrent}
                totalSteps={item.stageTotal}
                statusText={item.value}
                active
                showSteps={false}
              />
            ) : (
              <span className="text-foreground text-sm">{item.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProcessDetails
