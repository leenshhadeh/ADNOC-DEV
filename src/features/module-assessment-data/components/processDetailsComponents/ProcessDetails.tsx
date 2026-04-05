const ProcessDetails = (props:any) => {

const {data}=props
debugger
  return (
    // inline details view for the process
    <div className="flex flex-wrap items-center justify-between gap-3 my-[24px]">
      {data?.map((item: any) => (
        <div key={item.label} className="border-l border-gray-300 px-4 first:border-l-0">
          <span className="text-muted-foreground text-sm">{item.label}:</span>
          <div>
            <span className="text-foreground text-sm">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProcessDetails
