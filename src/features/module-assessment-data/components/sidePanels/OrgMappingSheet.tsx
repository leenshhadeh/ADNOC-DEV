import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'

const OrgMappingSheet = (props: any) => {
  const { open = true, handleOpenChange , title } = props
  const [selected, setSelected] = useState<string[]>([])
  const [activeStep, setActiveStep] = useState('unit') // 'unit' | 'team'

  return (
    <ActionSheet title={title} open={open} onOpenChange={handleOpenChange}
   >
      <div className="relative flex-1 overflow-hidden">

{/* progress */}
<div>
    {/* 2 bars + text "Step 2 of 4" (similar to the one in process details page) to indicate the progress of the mapping. */}
    <div className="flex items-center gap-2 m-4">
      <div className="w-full bg-gray-200 rounded-full h-2 w-[49%]">
         <div className="bg-[#0047BA] h-2 rounded-full" ></div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 w-[49%]">
      {activeStep=='team' &&  <div className="bg-[#0047BA] h-2 rounded-full"></div>}
      </div>
      <span className="text-sm text-foreground"><span className='text-primary font-bold text-[14px]'>{activeStep=='team'?2:1}</span>/2</span>
    </div>

</div>

{/* title and search input */}

    <div className="m-4">
      <p className="text-md mb-1 text-muted-foreground">
        {activeStep=='unit' ? 'Bussnes Unit' : 'Responsible Digital Team'}
      </p>
      {/* search input */}
      <input
        type="text"
        placeholder={`Search...`}
        className="flex h-8 w-full min-w-0 border-border bg-background text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40 rounded-md border px-2"
      />
     
    </div>


        {/* ── Main scrollable body ──────────────────────────────────────── */}
        <div className="h-full overflow-y-scoll m-4 p-3 rounded-md border">
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
          {
            activeStep=='unit'? <>
              <Button type="button" className="flex-1 rounded-full" onClick={()=>setActiveStep('team')}>
            Next
          </Button></>:
            <Button type="button" className="flex-1 rounded-full" onClick={()=>handleOpenChange(selected)}>
            Save
          </Button>
          }
          
        </div>
      </div>
    </ActionSheet>
  )
}

export default OrgMappingSheet
