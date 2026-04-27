import { Input } from '@/shared/components/ui/input'
import { Select } from '@/shared/components/ui/select'

// TODO: to be updated after having the opportunites data 
const EstimationAndPrioritization = () => {
  return (<>
  
    <div className="flex w-full flex-col gap-2 my-2">
      <label className="text-muted-foreground text-sm">Proposed Priority</label>
      <Select options={[{ label: 'proprity1', value: 'proprity1' }]} value={'proprity1'} disabled={true} />
     </div> 
     
     <div className="flex w-full flex-col gap-2">
      <label className="text-muted-foreground text-sm my-2">
        Estimated Implementation Duration, months
      </label>
      
      <div className="flex justify-between gab-3">
      <div className="w-full me-3">
          <label className="text-muted-foreground text-sm">Min</label>
          <Input value={'AED 0.0'} disabled />
        </div>
        <div className="w-full ">
          <label className="text-muted-foreground text-sm">Max</label>
          <Input value={'AED 10.0'} disabled />
        </div>
      </div>
    </div>
    </>
  )
}
export default EstimationAndPrioritization
