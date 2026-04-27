import { Button } from '@/shared/components/ui/button'

interface TaskActionFooterProps {
  onCancel: () => void
  onReturn: () => void
  onReject: () => void
  onApprove: () => void
  disabled?: boolean
}

const TaskActionFooter = ({
  onCancel,
  onReturn,
  onReject,
  onApprove,
  disabled = false,
}: TaskActionFooterProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      disabled={disabled}
      className="text-brand-blue hover:text-brand-blue/80 shrink-0 text-sm font-medium hover:bg-transparent disabled:opacity-50"
      onClick={onCancel}
    >
      Cancel
    </Button>
    <button
      type="button"
      disabled={disabled}
      className="flex flex-1 items-center justify-center rounded-[36px] bg-gradient-to-r from-[#EAEFFF] to-[#C7D6F9] px-6 py-3 text-sm font-medium text-[#151718] text-[#EB3865] shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
      onClick={onReturn}
    >
      Return
    </button>
    <button
      type="button"
      disabled={disabled}
      className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#EB3865] to-[#B12A4C] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
      onClick={onReject}
    >
      Reject
    </button>
    <button
      type="button"
      disabled={disabled}
      className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#5B23FF] to-[#3C00EB] px-6 py-3 text-sm font-medium text-white shadow-[0px_4px_8px_0px_rgba(209,213,223,0.5)] transition-opacity hover:opacity-90 disabled:opacity-50"
      onClick={onApprove}
    >
      Approve
    </button>
  </div>
)

export default TaskActionFooter
