import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"


export function InfoTooltip(props:any) {
  const{text}=props
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button className="rounded-full border p-1">
            <Info className="h-4 w-4" color="#EB3865" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}