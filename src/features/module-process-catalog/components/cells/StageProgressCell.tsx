import { Check } from "lucide-react"

interface StageProgressCellProps {
  currentStep: number
  totalSteps: number
  statusText: string
  active?: boolean
}

const StageProgressCell = ({ currentStep, totalSteps, statusText, active = true }: StageProgressCellProps) => {
  const progress = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100))
  const ringColor = active ? "#0047BB" : "#D1D5DB"

  return (
    <div className="flex items-center gap-2 text-start">
      <div className="relative grid size-10 place-items-center">
        <svg viewBox="0 0 36 36" className="size-10 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#DDE8F6" strokeWidth="2.5" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={ringColor}
            strokeWidth="2.5"
            strokeDasharray={`${progress} ${100 - progress}`}
            pathLength="100"
            strokeLinecap="round"
          />
        </svg>

        {progress >= 100 ? <Check className="absolute size-4 text-[#0047BB]" /> : null}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Step {currentStep}/{totalSteps}
        </p>
        <p className="text-md font-semibold leading-6 text-foreground">{statusText}</p>
      </div>
    </div>
  )
}

export default StageProgressCell
