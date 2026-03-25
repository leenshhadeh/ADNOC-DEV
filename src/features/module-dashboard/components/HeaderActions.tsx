import { Bell, Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@/shared/hooks/useDarkMode'

const HeaderActions = () => {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Toggle dark mode"
        onClick={toggleDarkMode}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F1F3F5]"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 -scale-x-100" />}
      </button>

      <div className="h-5 w-px bg-[#E6E8EB]" />

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
