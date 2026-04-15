import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import ActionSheet from '@/shared/components/ActionSheet'
import RichTextEditor from '@/shared/components/ui/RichTextEditor'
import { Button } from '@/shared/components/ui/button'
import { saveSMEFeedback } from '../../api/automationTargetsService'
import type { AutomationTargetRow } from '../../types'

interface SMEFeedbackSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: AutomationTargetRow | null
  onSaved: () => void
}

const SMEFeedbackSheet = ({ open, onOpenChange, target, onSaved }: SMEFeedbackSheetProps) => {
  const [feedback, setFeedback] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Sync initial value when a new target is opened
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && target) {
      setFeedback(target.smeFeedback)
    }
    onOpenChange(isOpen)
  }

  const handleSave = async () => {
    if (!target) return
    setIsSaving(true)
    await saveSMEFeedback(target.id, feedback)
    setIsSaving(false)
    onSaved()
  }

  return (
    <ActionSheet title="Add SME Feedback" open={open} onOpenChange={handleOpenChange}>
      {target ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* ── Scrollable body ──────────────────────────────────────────── */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            {/* Process info summary */}
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                <span className="font-medium text-[#151718]">Process:</span> {target.level4}
              </p>
              <p className="text-muted-foreground text-sm">
                <span className="font-medium text-[#151718]">Code:</span> {target.level4Code}
              </p>
              <p className="text-muted-foreground text-sm">
                <span className="font-medium text-[#151718]">Company / Site:</span>{' '}
                {target.groupCompany} — {target.site}
              </p>
            </div>

            {/* Feedback editor */}
            <div className="space-y-2">
              <label className="text-sm font-normal text-[#687076]">SME Feedback</label>
              <RichTextEditor
                value={feedback}
                placeholder="Enter your SME feedback here…"
                onChange={setFeedback}
              />
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="border-border flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      ) : null}
    </ActionSheet>
  )
}

export default SMEFeedbackSheet
