import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'

const BUSheet = (props: any) => {
  const { open = true, handleOpenChange } = props
  const [selected, setSelected] = useState<string[]>([])

  return (
    <ActionSheet title="Business Unit" open={open} onOpenChange={handleOpenChange}>
      <div className="relative flex-1 overflow-hidden">
        {/* ── Main scrollable body ──────────────────────────────────────── */}
        <div className="h-full overflow-y-auto m-6 p-6  rounded-md border">
          {/* tree select: Shared servise:{Procurement, Vendor Relations:{v1, v2}} */}
          <TreeSelect
            data={[{label: 'Shared Service',
              value: 'shared-service',
              children: [
                {
                  label: 'Procurement',
                  value: 'procurement',
                  children: [
                    {
                      label: 'Strategic Sourcing',
                      value: 'strategic-sourcing',
                      children: [
                        {
                          label: 'Supplier Evaluation',
                          value: 'supplier-evaluation',
                        },
                        {
                          label: 'Contracting',
                          value: 'contracting',
                        },
                      ],
                    },
                  ],
                },
                {
                  label: 'Vendor Relations',
                  value: 'vendor-relations',
                  children: [
                    {
                      label: 'Tier 1 Vendors',
                      value: 'tier-1-vendors',
                      children: [
                        { label: 'v1', value: 'v1' },
                        { label: 'v2', value: 'v2' },
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
      {/* Sticky footer */}
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

export default BUSheet
