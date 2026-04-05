import { Check } from 'lucide-react'

interface StageProgressCellProps {
  currentStep: number
  totalSteps: number
  statusText: string
  active?: boolean
  showSteps?:boolean
}

const StageProgressCell = ({
  currentStep,
  totalSteps,
  statusText,
  active = true,
  showSteps=true
}: StageProgressCellProps) => {
  const isComplete = currentStep >= totalSteps
  const progress = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100))
  const ringColor = active ? '#0047BB' : '#D1D5DB'
  // Light blue fill when active, transparent when inactive (pending / not published)
  const innerFill = active ? '#EFF6FF' : 'transparent'

  return (
    <div className="flex items-center gap-2">
      {/* shrink-0 → prevents the fixed-size ring from being compressed by the flex row */}
      <div className="relative flex size-10 shrink-0 items-center justify-center">
        {/*
          viewBox 0 0 36 36, cx/cy at 18 18 (true center) with r=15 and strokeWidth 2.5:
            outer stroke edge = 18 + 15 + 1.25 = 34.25  ✓ inside 36
            inner stroke edge = 18 − 15 − 1.25 = 1.75   ✓ inside 0
          Previously cx/cy=16 caused the stroke to bleed off the viewBox (-0.75) → clipped.
        */}
        <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden="true">
          {/* Track circle — always visible, carries the inner fill colour */}
          <circle cx="18" cy="18" r="15" fill={innerFill} stroke="#DDE8F6" strokeWidth="2.5" />
          {/* Progress arc — only rendered when there is progress to show */}
          {progress > 0 && (
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={ringColor}
              strokeWidth="2.5"
              strokeDasharray={`${progress} ${100 - progress}`}
              pathLength="100"
              strokeLinecap="round"
            />
          )}
        </svg>
        {/* Check icon — fill colour comes from the SVG inner circle above, not from bg-* */}
        {isComplete && (
          <Check strokeWidth={2.5} className="absolute size-4 text-[#0047BB]" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0">
        {showSteps && <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Step {currentStep}/{totalSteps}
        </p>}
        <p className="text-foreground text-sm leading-5 font-semibold">{statusText}</p>
      </div>
    </div>
  )
}

export default StageProgressCell
