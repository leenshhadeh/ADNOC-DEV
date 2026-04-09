import { ChevronDown, ChevronRight } from 'lucide-react'

interface ProcessInfoCellProps {
  processName: string
  requestId: string
  processCode?: string
  showChevron?: boolean
  expanded?: boolean
  onToggle?: () => void
}

const ProcessInfoCell = ({
  processName,
  requestId,
  processCode,
  showChevron = false,
  expanded = false,
  onToggle,
}: ProcessInfoCellProps) => {
  return (
    <div className="flex items-start gap-2 text-start">
      {showChevron ? (
        <button
          type="button"
          onClick={onToggle}
          className="text-muted-foreground focus-visible:ring-ring mt-0.5 shrink-0 outline-none focus-visible:ring-2"
          aria-label={expanded ? 'Collapse row' : 'Expand row'}
        >
          {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      ) : null}

      <div className="min-w-0">
        <p className="text-foreground truncate text-base leading-6 font-medium">{processName}</p>
        <p className="text-muted-foreground truncate text-xs font-light">
          {processCode ? `Code: ${processCode} | ` : ''}Req ID: {requestId}
        </p>
      </div>
    </div>
  )
}

export default ProcessInfoCell
