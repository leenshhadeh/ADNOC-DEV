import { Select } from '@/shared/components/ui/select'

// TODO: to be updated after having the opportunites data 

const ValueEstimation = () => {
  return (
    <>
      <div className="flex w-full flex-col my-2">
        <label className="text-muted-foreground text-sm">Impact Type</label>
        <Select options={[{ label: 'Intangible', value: 'Intangible' }]} value={'Intangible'} disabled={true} />
      </div>
      <div className="flex w-full flex-col my-2">
        <label className="text-muted-foreground text-sm">Impact Reason</label>
        <Select
          options={[{ label: 'IntaEnsured Regulatory Compliancengible', value: '1' }]}
          value={'IntaEnsured Regulatory Compliancengible'}
          disabled={true}
        />
      </div>
    </>
  )
}
export default ValueEstimation
