import ActionSheet from '@/shared/components/ActionSheet'
import { RadioCell } from '@/shared/components/table-primitives'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@radix-ui/react-separator'

const GCs = [
  'ADNOC Drilling',
  'ADNOC HQ',
  'ADNOC test',
  'ADNOC random',
  'ADNOC fix',
  'ADNOC Drilling 2',
  'ADNOC HQ 2',
  'ADNOC test 2',
  'ADNOC random 2',
  'ADNOC fix 2',
]

// shared services: {GC:12, shared:2}  ==> {GC:12, shared:['G1','G2']}

const SharedServicesSheet = (props: any) => {
  const { open = true, process = { name: 'Define basin framework' }, handleOpenChange } = props

  const isSharedG = (GC: string) => {
    // Check if "GC" is shared
    return GC
  }

  return (
    <ActionSheet
      title="Shared Service"
      open={open}
      onOpenChange={handleOpenChange}
      subTitle="Manage Shared Service status per Group Company."
    >
      <div className="relative flex-1 overflow-hidden">
        {/* ── Main scrollable body ──────────────────────────────────────── */}
        <div className="h-full overflow-y-auto p-6">
          <div className="mb-6 border-b py-[16px]">
            <p className="text-muted-foreground">Process:</p>
            <p>{process.name}</p>
          </div>
          <Separator className="my-4" />

          {/* Companies */}
          {/* Only HQ users can view and edit the shared service process flag, 
while other group companies cannot see this column. */}
          <div className="grid grid-cols-2 gap-4 border-b py-[18px]">
            <p className="text-muted-foreground">Group Company</p>
            <p className="text-muted-foreground">Shared Service process</p>
          </div>
          {/* Copmaines */}
          {GCs.map((GC) => (
            <div className="grid grid-cols-2 gap-4 border-b py-[18px]">
              <p>{GC}</p>
              <div className="text-start">
                <RadioCell value={isSharedG(GC)} />
              </div>
            </div>
          ))}
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
          <Button type="button" className="flex-1 rounded-full" onClick={handleOpenChange}>
            Save
          </Button>
        </div>
      </div>
    </ActionSheet>
  )
}

export default SharedServicesSheet
