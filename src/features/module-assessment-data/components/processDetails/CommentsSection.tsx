import Avatar from '@/shared/components/ui/Avatar'
import { Input } from '@/shared/components/ui/input'
import { SendHorizontal, X } from 'lucide-react'
import { useEffect } from 'react'
import {
  useGetProcessComments,
  useGetProcessCommentsByField,
} from '../../hooks/useGetProcessComments'
import { useCurrentUser } from '@/shared/auth/useUserStore'

// TODO: read comments from API + save the new added comment
const CommentsSection = (props: any) => {
  const { onCloseComments, commentField , processId } = props
  const { name } = useCurrentUser()
  const { data, isLoading } = commentField
    ? useGetProcessCommentsByField(processId,commentField)
    : useGetProcessComments(processId)

  useEffect(() => {
    console.log('commentField', commentField, data)
  }, [data, commentField])

  return (
    <div className="bg-sidebar-accent col-span-3 mt-[24px] rounded-2xl p-5 min-w-[300px]">
      <div className="flex items-center justify-between">
        <p>Comments</p>
        <X onClick={onCloseComments} />
      </div>

      <div className="mt-3 rounded-2xl border border-[#DFE3E6] bg-white p-4">
        <div className="flex items-center">
          <Avatar name={name} small={true} />
          <span className="ms-1">{name}</span>
        </div>
        <div className="relative mt-4 w-full">
          <Input
            className="bg-sidebar-accent w-full rounded-2xl"
            placeholder="Type here.."
          />
          <SendHorizontal className="text-muted-foreground absolute top-1/2 right-4 size-10 h-4 w-4 -translate-y-1/2 cursor-pointer" />
        </div>
      </div>

      {isLoading && <div className='p-5 text-sm text-center'>Loading comments..</div>}
      {data &&
        data.length > 0 &&
        data.map((comment) => (
          <div key={comment.id} className="mt-3 rounded-2xl border border-[#DFE3E6] bg-white p-4">
            <div className="flex items-center">
              <Avatar name={comment.author} small={true} />
              <span className="ms-1">{'Ali Abdullah'}</span>
            </div>
            <div className="relative mt-4 w-full">
              <div className="mb-3">{comment.text}</div>
              <span className="text-muted-foreground text-[14px]"> {comment.timestamp}</span>
            </div>
          </div>
        ))}
    </div>
  )
}
export default CommentsSection
