import type { LucideIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface ViewToggleOption {
  value: string
  icon: LucideIcon
  label: string
}

interface ViewToggleProps {
  options: ViewToggleOption[]
  value: string
  onChange: (value: string) => void
}

const ViewToggle = ({ options, value, onChange }: ViewToggleProps) => (
  <div className="border-border flex shrink-0 items-center gap-0.5 rounded-xl border p-1">
    {options.map((option) => (
      <div key={option.value} className="group relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={option.label}
          className={cn('size-9 rounded-lg')}
          style={value === option.value ? { background: 'var(--tab-active-bg)' } : undefined}
          onClick={() => onChange(option.value)}
        >
          <option.icon className="size-4" />
        </Button>
        <span className="bg-foreground text-background pointer-events-none absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
          {option.label}
        </span>
      </div>
    ))}
  </div>
)

export default ViewToggle
