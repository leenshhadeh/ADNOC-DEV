/**
 * AssessmentBulkActionBar — shown above the Processes table when bulk mode is active.
 *
 * Figma node 2860-89333 (Table/Bulk actions):
 *   bg #ECEDED · rounded-t-3xl · px-8 · counter + Edit | Comment | Copy assessment data | Submit | Mark as reviewed | Cancel
 *
 * SRP: renders only the bar and emits action events — no business logic.
 */
import { CheckSquare, ClipboardCopy, MessageSquare, Pencil, SendHorizonal, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'

export type AssessmentBulkAction =
  | 'edit'
  | 'comment'
  | 'copy-assessment-data'
  | 'submit'
  | 'mark-as-reviewed'

interface AssessmentBulkActionBarProps {
  selectedCount: number
  onAction: (action: AssessmentBulkAction) => void
  onCancel: () => void
}

const AssessmentBulkActionBar = ({
  selectedCount,
  onAction,
  onCancel,
}: AssessmentBulkActionBarProps) => (
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
        onClick={() => onAction('comment')}
      >
        <MessageSquare className="size-4" />
        Comment
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('copy-assessment-data')}
      >
        <ClipboardCopy className="size-4" />
        Copy assessment data
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('submit')}
      >
        <SendHorizonal className="size-4" />
        Submit
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#0047BA] hover:bg-transparent hover:text-[#0047BA]/80"
        disabled={selectedCount === 0}
        onClick={() => onAction('mark-as-reviewed')}
      >
        <CheckSquare className="size-4" />
        Mark as reviewed
      </Button>

      <Separator orientation="vertical" className="h-5 bg-[#DFE3E6]" />

      <Button
        type="button"
        variant="ghost"
        className="gap-1 text-sm font-medium text-[#151718] hover:bg-transparent hover:text-[#151718]/80"
        onClick={onCancel}
      >
        <X className="size-4" />
        Cancel
      </Button>
    </div>
  </div>
)

export default AssessmentBulkActionBar
