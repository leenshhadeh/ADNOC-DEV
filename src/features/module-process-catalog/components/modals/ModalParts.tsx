import { X } from 'lucide-react'

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-2 shrink-0 rounded-full p-1 text-[#687076] transition-colors hover:text-[#151718]"
      aria-label="Close"
    >
      <X className="size-5" />
    </button>
  )
}
