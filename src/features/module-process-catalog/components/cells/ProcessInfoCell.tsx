import { ChevronDown, ChevronRight } from "lucide-react"

interface ProcessInfoCellProps {
  processName: string
  requestId: string
  showChevron?: boolean
  expanded?: boolean
  onToggle?: () => void
}

const ProcessInfoCell = ({ processName, requestId, showChevron = false, expanded = false, onToggle }: ProcessInfoCellProps) => {
  return (
    <div className="flex items-start gap-2 text-start">
      {showChevron ? (
        <button
          type="button"
          onClick={onToggle}
          className="mt-0.5 shrink-0 text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={expanded ? "Collapse row" : "Expand row"}
        >
          {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      ) : null}

      <div className="min-w-0">
        <p className="truncate text-base font-semibold leading-6 text-foreground">{processName}</p>
        <p className="truncate text-sm text-muted-foreground">Req ID: {requestId}</p>
      </div>
    </div>
  )
}

export default ProcessInfoCell
