import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface StepProps {
  id: string
  title: string
  status: string
  owner?: string
  progress?: string
}

interface StepsProps {
  steps: StepProps[]
}

const WorkflowStepper = (props: StepsProps) => {
  console.log('WorkflowStepper', props)
  const { steps } = props
  return (
    <div className="flex items-start">
      {steps.map((step: any, i: number) => {
        const stepIndex = i + 1
        const isCompleted = step.status == 'completed'
        const isActive = step.status == 'active'
        const currentStepProgress = isActive && step.progress
        const isLast = i === steps.length - 1

        return (
          <div key={stepIndex} className={cn('flex flex-col', isLast ? '' : 'flex-1')}>
            {/* Node + connector row */}
            <div className="flex items-center">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full border-2',
                  isCompleted || isActive
                    ? 'border-[#0047BB] bg-[#EFF6FF]'
                    : 'border-[#D1D5DB] bg-white',
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 text-[#0047BB]" strokeWidth={2.5} />
                ) : isActive ? (
                  <div className="size-7 rounded-full bg-[#c7dcf7]" />
                ) : (
                  <div className="size-7 rounded-full bg-[#F1F5F9]" />
                )}
              </div>

              <div className={cn('mx-2 h-0.5 flex-1', 'bg-[#D1D5DB]')}>
                {(isCompleted || isActive) && (
                  <div
                    className={cn('h-0.5 flex-1 bg-[#0047BB]')}
                    style={{ width: `${isCompleted ? '100%' : currentStepProgress}` }}
                  />
                )}
              </div>
            </div>
            {/* Labels */}
            <div className="mt-2 max-w-[100%]">
              <p className="text-muted-foreground text-[0.65rem] font-medium tracking-wide uppercase">
                STEP {stepIndex}/{steps.length}
              </p>
              <p
                className={cn(
                  'text-sm leading-5',
                  isActive ? 'text-foreground font-semibold' : 'text-muted-foreground',
                )}
              >
                {step.title}
              </p>
              {step.owner && (
                <span className="text-muted-foreground text-[10px]">{step.owner}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WorkflowStepper
