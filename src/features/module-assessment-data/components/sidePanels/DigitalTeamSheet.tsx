import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'

const DigitalTeamSheet = (props: any) => {
  const { open = true, handleOpenChange } = props
  const [selected, setSelected] = useState<string[]>([])

  return (
    <ActionSheet title={'Responsible Digital Team'} open={open} onOpenChange={handleOpenChange}>
      <div className="relative flex-1 overflow-hidden">
      <div className="m-4">
      <input
        type="text"
        placeholder={`Search...`}
        className="flex h-8 w-full min-w-0 border-border bg-background text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40 rounded-md border px-2"
      />
      </div>
        {/* ── Main scrollable body ──────────────────────────────────────── */}
        <div className=" overflow-y-auto m-4 p-3 rounded-md border">
          {/* tree select: Shared servise:{Procurement, Vendor Relations:{v1, v2}} */}
          <TreeSelect
            data={[{label: 'Business Support',
              value: 'Business Support',
              children: [
                {
                  label: 'Digital Operations',
                  value: 'Digital Operations',
                  children: [
                    {
                      label: 'Business Intelligence',
                      value: 'Business Intelligence',
                      children: [
                        {
                          label: 'Supplier Evaluation',
                          value: 'supplier-evaluation',
                        },
                      ],
                    },
                  ],
                },
                {
                  label: 'IT Service Management',
                  value: 'IT Service Management',
                  children: [
                    {
                      label: 'Enterprise Technology',
                      value: 'tier-1-vendors',
                      children: [
                        { label: 'Cybersecurity', value: 'v1' },
                        { label: 'Application Services', value: 'v2' },
                      ],
                    },
                  ],
                },
              ],
            }]}
            selected={selected}
            onChange={setSelected}
          />
        </div>
      </div>
       <div className="border-border shrink-0 px-6 py-4">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleOpenChange}
          >
            Cancel
          </Button>
          <Button type="button" className="flex-1 rounded-full" onClick={()=>handleOpenChange(selected)}>
            Save
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default DigitalTeamSheet
