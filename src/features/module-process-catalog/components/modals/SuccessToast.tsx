import { X } from 'lucide-react'

interface SuccessToastProps {
  message: string
  open: boolean
  onClose: () => void
}

export function SuccessToast({ message, open, onClose }: SuccessToastProps) {
  if (!open) return null

  return (
    <div className="animate-in fade-in slide-in-from-top-2 fixed top-6 left-1/2 z-50 -translate-x-1/2 duration-300">
      <div className="flex items-start gap-2 rounded-[20px] border-[0.5px] border-[#008B80] bg-[#E8FDFB] p-5 shadow-[0px_1px_30.3px_4px_rgba(77,241,228,0.11)]">
        <svg className="mt-0.5 size-5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="9" stroke="#151718" strokeWidth="2" />
          <path
            d="M6 10l3 3 5-5"
            stroke="#151718"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-base font-medium text-[#151718]">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 shrink-0 rounded-full p-0.5 text-[#687076] transition-colors hover:text-[#151718]"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
