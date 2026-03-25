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
  onToggle: (sectionId: string, optionId: string) => void
  onApply: () => void
  onReset: () => void
}

const ProcessFilterSheet = ({
  open,
  onOpenChange,
  filters,
  pending,
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
          {filters.map((filter) => (
            <AccordionItem key={filter.id} value={filter.id} className="border-0">
              <AccordionTrigger className="bg-muted/30 hover:bg-muted/50 px-6 py-4 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
                {filter.label}
              </AccordionTrigger>
              <AccordionContent className="pb-2">
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
              </AccordionContent>
            </AccordionItem>
          ))}
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
