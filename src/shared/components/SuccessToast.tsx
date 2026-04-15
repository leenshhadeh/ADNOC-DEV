import { useEffect } from 'react'
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

const VARIANT_STYLES: Record<
  ToastVariant,
  { border: string; bg: string; icon: typeof CheckCircle }
> = {
  success: { border: 'border-[#008B80]', bg: 'bg-[#E8FDFB]', icon: CheckCircle },
  error: { border: 'border-[#EB3865]', bg: 'bg-[#FFF5F7]', icon: AlertTriangle },
  info: { border: 'border-[#0047BB]', bg: 'bg-[#EAF0FF]', icon: Info },
}

interface SuccessToastProps {
  message: string
  open: boolean
  onClose: () => void
  /** Visual variant — defaults to `"success"`. */
  variant?: ToastVariant
  /** Optional bold title rendered above the message. */
  title?: string
  /** Auto-dismiss after this many milliseconds. `0` disables. Default `4000`. */
  autoDismiss?: number
}

export function SuccessToast({
  message,
  open,
  onClose,
  variant = 'success',
  title,
  autoDismiss = 4000,
}: SuccessToastProps) {
  useEffect(() => {
    if (!open || autoDismiss <= 0) return
    const t = setTimeout(onClose, autoDismiss)
    return () => clearTimeout(t)
  }, [open, autoDismiss, onClose])

  if (!open) return null

  const { border, bg, icon: Icon } = VARIANT_STYLES[variant]

  return createPortal(
    <div className="animate-in fade-in slide-in-from-bottom-2 fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 duration-300">
      <div
        className={cn(
          'flex items-start gap-2 rounded-[20px] border-[0.5px] p-5 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.20)]',
          border,
          bg,
        )}
      >
        <Icon className="mt-0.5 size-5 shrink-0 text-[#151718]" />
        <div className="min-w-0">
          {title && <p className="text-sm font-semibold text-[#151718]">{title}</p>}
          <p className="text-base font-medium text-[#151718]">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 shrink-0 rounded-full p-0.5 text-[#687076] transition-colors hover:text-[#151718]"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
