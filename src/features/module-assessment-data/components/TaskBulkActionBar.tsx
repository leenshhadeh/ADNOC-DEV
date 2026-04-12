/**
 * TaskBulkActionBar — shown above the My Tasks table when bulk mode is active.
 *
 * Figma node 6201-264440 (Table/Bulk actions):
 *   bg #ECEDED · rounded-t-3xl · px-8 · counter + Approve | Return | Reject | Request endorsement | Cancel
 */
import { ArrowLeftRight, CheckSquare, UserRoundCog, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

export type TaskBulkAction = 'approve' | 'return' | 'reject' | 'request-endorsement'

interface TaskBulkActionBarProps {
  selectedCount: number
  onAction: (action: TaskBulkAction) => void
  onCancel: () => void
}

const TaskBulkActionBar = ({ selectedCount, onAction, onCancel }: TaskBulkActionBarProps) => (
  <div className="flex items-center gap-2 overflow-x-auto rounded-t-3xl bg-[#ECEDED] px-8 py-2">
    {/* Counter */}
    <div className="flex flex-1 shrink-0 items-center gap-1">
      <span className="text-base font-bold text-[#151718]">{selectedCount}</span>
      <span className="text-base font-medium text-[#151718]">items selected</span>
    </div>

    {/* Action buttons */}
    <div className="flex shrink-0 items-center gap-3">
      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('approve')}
      >
        <CheckSquare className="size-4" />
        Approve
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('return')}
      >
        <ArrowLeftRight className="size-4" />
        Return
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#EB3865] hover:bg-transparent hover:text-[#EB3865]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('reject')}
      >
        <X className="size-4" />
        Reject
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('request-endorsement')}
      >
        <UserRoundCog className="size-4" />
        Request endorsement
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#151718] hover:bg-transparent hover:text-[#151718]/80"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  </div>
)

export default TaskBulkActionBar
