import { Maximize2, Tally1 } from "lucide-react"

const SharedServices = (props:any) => {
  const {val} =props
  
    if (val?.services && val?.shared) {
      return (
        <div className="flex items-center justify-between">
          <span className="pe-[7px]">{val?.services}</span>
          <Tally1 className="mt-[7px] rotate-[25deg] text-[#DFE3E6]" />
          <span className="text-muted-foreground pe-[7px]">{val?.shared} Shared</span>
          <Tally1 className="text-[#DFE3E6]" />
          <Maximize2
            className="size-4 cursor-pointer"
            strokeWidth={2}
            onClick={props.onExpand}
          />
        </div>
      )
    }
    return <></>
  }
  export default SharedServices