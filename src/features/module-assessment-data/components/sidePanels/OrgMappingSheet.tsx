import ActionSheet from '@/shared/components/ActionSheet'
import { TreeSelect } from '@/shared/components/TreeSelect'
import { Button } from '@/shared/components/ui/button'
import { useEffect, useState } from 'react'
import { BUData, DigitalTeam } from '../../constants/org-mapping-data'

const OrgMappingSheet = (props: any) => {
  const { open = true, handleOnSubmitData, title, handleOpenChange } = props
  const [selectedBU, setSelectedBU] = useState<string[]>([])
  const [selectedDT, setSelectedDT] = useState<string[]>([])
  const [activeStep, setActiveStep] = useState('unit') // 'unit' | 'team'
  const [orgBUData, setOrgBUData] = useState<any>([])
  const [orgDTData, setOrgDTData] = useState<any>([])

  useEffect(() => {
    // Call List of BU and Digital team
    setOrgBUData(BUData)
    setOrgDTData(DigitalTeam)
  }, [])

  return (
    <ActionSheet title={title} open={open} onOpenChange={handleOpenChange}>
      <div className="relative flex-1 overflow-hidden">
        {/* progress */}
        <div>
          {/* 2 bars + text "Step 2 of 4" (similar to the one in process details page) to indicate the progress of the mapping. */}
          <div className="m-4 flex items-center gap-2">
            <div className="h-2 w-[49%] w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-[#0047BA]"></div>
            </div>
            <div className="h-2 w-[49%] w-full rounded-full bg-gray-200">
              {activeStep == 'team' && <div className="h-2 rounded-full bg-[#0047BA]"></div>}
            </div>
            <span className="text-foreground text-sm">
              <span className="text-primary text-[14px] font-bold">
                {activeStep == 'team' ? 2 : 1}
              </span>
              /2
            </span>
          </div>
        </div>

        {/* title and search input */}

        <div className="m-4">
          <p className="text-md text-muted-foreground mb-1">
            {activeStep == 'unit' ? 'Bussnes Unit' : 'Responsible Digital Team'}
          </p>
          {/* search input */}
          <input
            type="text"
            placeholder={`Search...`}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-8 w-full min-w-0 rounded-md border px-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3"
          />
        </div>

        {/* ── Main scrollable body ──────────────────────────────────────── */}
        <div className="overflow-y-scoll m-4 h-full rounded-md border p-3">
          {/* tree select: Shared servise:{Procurement, Vendor Relations:{v1, v2}} */}
          {activeStep == 'unit' && orgBUData && (
            <TreeSelect data={orgBUData} selected={selectedBU} onChange={setSelectedBU} />
          )}
          {activeStep != 'unit' && orgDTData && (
            <TreeSelect data={orgDTData} selected={selectedDT} onChange={setSelectedDT} />
          )}
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
          {activeStep == 'unit' ? (
            <>
              <Button
                type="button"
                className="flex-1 rounded-full"
                onClick={() => setActiveStep('team')}
              >
                Next
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="flex-1 rounded-full"
              onClick={() => handleOnSubmitData({BU:selectedBU,DT:selectedDT})}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </ActionSheet>
  )
}

export default OrgMappingSheet
