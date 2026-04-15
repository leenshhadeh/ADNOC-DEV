// TODO: to be updated after having the opportunites data 

const PrimaryInformation = () => {
  return (
    <>
      <div className="flex w-full flex-col">
        <label className="text-muted-foreground text-sm">Description</label>
        <textarea
          name="Description"
          value={'Description'}
          disabled={true}
          className="rounded-md border p-2 text-sm"
          rows={5}
        />
      </div>
      <div className="flex w-full flex-col my-2">
        <label className="text-muted-foreground text-sm">Functional Capabilities</label>
        <textarea
          name="Description"
          value={
            '1. Real-Time Analytics and Reporting: Provides instant insights and detailed reports on control performance and risk indicators.'
          }
          disabled={true}
          className="rounded-md border p-2 text-sm"
          rows={4}
        />
      </div>
    </>
  )
}
export default PrimaryInformation
