import { X } from 'lucide-react'

export interface WorkflowHistoryEntry {
  id: string
  action: string
  date: string
  userName: string
  userRole: string
  reason?: string
}

interface WorkflowHistoryPanelProps {
  items: WorkflowHistoryEntry[]
  onClose: () => void
}

const WorkflowHistoryPanel = ({ items, onClose }: WorkflowHistoryPanelProps) => (
  <div className="bg-background absolute inset-0 z-20 flex flex-col">
    <div className="border-border flex shrink-0 items-center justify-between border-b px-6 py-4">
      <h3 className="text-foreground text-lg font-semibold">Workflow History</h3>
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Close workflow history"
      >
        <X className="size-4" />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto px-6 py-5">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No workflow history available.</p>
      ) : (
        <ol>
          {items.map((item, i) => (
            <li key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="mt-1 size-3.5 shrink-0 rounded-full bg-[#0047BB]" />
                {i < items.length - 1 && <div className="bg-border mt-1 w-0.5 flex-1" />}
              </div>
              <div className="flex-1 pb-6">
                <p className="text-foreground font-semibold">{item.action}</p>
                <p className="text-muted-foreground mt-0.5 text-sm">{item.date}</p>
                <p className="mt-0.5 text-sm">
                  <span className="text-foreground font-semibold">{item.userName}</span>
                  <span className="text-muted-foreground"> – {item.userRole}</span>
                </p>
                {item.reason && (
                  <div className="border-border bg-muted/30 mt-3 rounded-xl border px-4 py-3">
                    <p className="text-muted-foreground mb-1 text-xs font-medium">Reason:</p>
                    <p className="text-foreground text-sm">{item.reason}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
)

export default WorkflowHistoryPanel
