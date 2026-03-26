import { Bell } from 'lucide-react'

const HeaderActions = () => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Open notifications"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F1F3F5]"
      >
        <Bell className="h-5 w-5" />
      </button>
    </div>
  )
}

export default HeaderActions
