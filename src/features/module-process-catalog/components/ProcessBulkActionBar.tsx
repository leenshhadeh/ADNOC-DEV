/**
 * ProcessBulkActionBar — horizontal bar shown above the Processes table
 * when bulk mode is active in the Processes tab.
 *
 * Matches Figma node 6349-321703 (Table/Bulk actions):
 *   bg #ECEDED, rounded-t-3xl, counter + Edit | Submit | Cancel
 *
 * SRP: only renders the bar + emits actions — no business logic.
 */
import { CheckSquare, Pencil } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

export type ProcessBulkAction = 'edit' | 'submit'

interface ProcessBulkActionBarProps {
  selectedCount: number
  onAction: (action: ProcessBulkAction) => void
  onCancel: () => void
}

const ProcessBulkActionBar = ({ selectedCount, onAction, onCancel }: ProcessBulkActionBarProps) => (
  <div className="flex items-center gap-2 rounded-t-3xl bg-[#ECEDED] px-8 py-2">
    {/* Counter */}
    <div className="flex flex-1 items-center gap-1">
      <span className="text-base font-bold text-[#151718]">{selectedCount}</span>
      <span className="text-base font-medium text-[#151718]">items selected</span>
    </div>

    {/* Action buttons */}
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('edit')}
      >
        <Pencil className="size-4" />
        Edit
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('submit')}
      >
        <CheckSquare className="size-4" />
        Submit
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

export default ProcessBulkActionBar
