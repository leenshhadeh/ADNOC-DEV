import Avatar from "@/shared/components/ui/Avatar"
import { Input } from "@/shared/components/ui/input"
import { SendHorizontal, X } from "lucide-react"

// TODO: read comments from API + save the new added comment
const CommentsSection=(props:any)=>{
    const {onCloseComments} = props

    return(
        <div className="bg-sidebar-accent col-span-3 mt-[24px] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <p>Comments</p>
          <X onClick={onCloseComments} />
        </div>

        <div className="mt-3 rounded-2xl border-[#DFE3E6] bg-white p-4 border">
          <div className="flex items-center">
            <Avatar name="Maryam Al Shamsi" small={true} />
            <span className='ms-1'>{'Maryam Al Shamsi'}</span>
          </div>
          <div className="relative w-full mt-4">
            <Input
              className="bg-sidebar-accent w-full rounded-2xl"
              placeholder="Type your message here"
            />
            <SendHorizontal className="text-muted-foreground absolute top-1/2 right-4 size-10 h-4 w-4 -translate-y-1/2 cursor-pointer" />
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-[#DFE3E6] bg-white p-4">
          <div className="flex items-center">
            <Avatar name="Ali Abdullah" small={true} />
            <span className='ms-1'>{'Ali Abdullah'}</span>
          </div>
          <div className="relative w-full mt-4">
         <div className='mb-3'>
         Lorem ipsum dolor sit amet, consectetur adipiscing zlit, sed do eiusmod tempor.
         </div>
         <span className='text-muted-foreground text-[14px]'>01 Mar 2024 at 12:30</span>
          </div>
        </div>
      </div>
    )
}
export default CommentsSection