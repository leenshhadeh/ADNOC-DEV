import { Textarea } from '@/shared/components/ui/textarea'

// TODO: to be updated after having the opportunites data

const PrimaryInformation = () => {
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <label className="text-muted-foreground text-sm">Description</label>
        <Textarea
          name="Description"
          value={'Description'}
          disabled={true}
          className="text-sm"
          rows={5}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <label className="text-muted-foreground text-sm">Functional Capabilities</label>
        <Textarea
          name="Description"
          value={
            '1. Real-Time Analytics and Reporting: Provides instant insights and detailed reports on control performance and risk indicators.'
          }
          disabled={true}
          className="text-sm"
          rows={4}
        />
      </div>
    </>
  )
}
export default PrimaryInformation
