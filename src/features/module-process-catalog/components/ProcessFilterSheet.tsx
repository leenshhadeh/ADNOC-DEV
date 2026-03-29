import ActionSheet from '@/shared/components/ActionSheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import type { FilterDefinition } from '@/shared/types/filters'

import type { ProcessFilters } from '@features/module-process-catalog/hooks/useProcessFilters'

interface ProcessFilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterDefinition[]
  pending: ProcessFilters
  /** Count of committed (applied) selections per section — drives section badges */
  activePerSection?: Record<string, number>
  onToggle: (sectionId: string, optionId: string) => void
  onApply: () => void
  onReset: () => void
}

const ProcessFilterSheet = ({
  open,
  onOpenChange,
  filters,
  pending,
  activePerSection,
  onToggle,
  onApply,
  onReset,
}: ProcessFilterSheetProps) => {
  const handleApply = () => {
    onApply()
    onOpenChange(false)
  }

  return (
    <ActionSheet title="Filters" open={open} onOpenChange={onOpenChange}>
      {/* Scrollable filter sections */}
      <div className="flex-1 overflow-y-auto py-4">
        <Accordion
          type="multiple"
          defaultValue={filters.map((f) => f.id)}
          className="divide-border divide-y"
        >
          {filters.map((filter) => {
            const sectionActiveCount = (activePerSection ?? {})[filter.id] ?? 0
            return (
              <AccordionItem key={filter.id} value={filter.id} className="border-0">
                <AccordionTrigger className="bg-muted/30 hover:bg-muted/50 gap-3 px-6 py-4 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <span className="flex flex-1 items-center gap-2">
                    {filter.label}
                    {sectionActiveCount > 0 && (
                      <span className="bg-primary text-primary-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums">
                        {sectionActiveCount}
                      </span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  {filter.options.length === 0 ? (
                    <p className="text-muted-foreground px-6 py-3 text-sm italic">
                      No options available yet.
                    </p>
                  ) : (
                    <ul>
                      {filter.options.map((option) => {
                        const checked = (pending[filter.id] ?? []).includes(option.id)
                        const inputId = `filter-${filter.id}-${option.id}`
                        return (
                          <li key={option.id}>
                            <label
                              htmlFor={inputId}
                              className="hover:bg-muted/40 flex cursor-pointer items-center gap-3 px-6 py-2.5"
                            >
                              <Checkbox
                                id={inputId}
                                checked={checked}
                                onCheckedChange={() => onToggle(filter.id, option.id)}
                              />
                              <span className="text-foreground text-sm leading-none">
                                {option.label}
                              </span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>

      {/* Sticky footer */}
      <div className="border-border shrink-0 border-t px-6 py-4">
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={onReset}>
            Reset filter
          </Button>
          <Button type="button" className="flex-1 rounded-full" onClick={handleApply}>
            Filter
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default ProcessFilterSheet
