import { StatusBadgeCell, type CatalogStatus } from '@/shared/components/cells'
import Avatar from '@/shared/components/ui/Avatar'
import { Input } from '@/shared/components/ui/input'
import { SendHorizontal } from 'lucide-react'

interface CommentType {
  username: string
  userPrfileImg: string
  comment: string
  date: string
  status: string
  markedAsReviewed?: boolean | string
}

const CommentsTab = (props: any) => {
  const { comments } = props

  return (
    <div className="relative h-100 w-full">
      {comments &&
        comments.length > 0 &&
        comments.map((comment: CommentType) => (
          <div key={comment.date} className="w-full border-b py-3 last:border-0">
              <div className="mb-5 inline-flex items-start gap-4">
                {comment.userPrfileImg ? (
                  <img
                    src={comment.userPrfileImg}
                    alt={comment.username}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : <Avatar name={comment.username} />
                }
                <div>
                  <p className="text-muted-foreground text-md font-medium">{comment.username}</p>
                  <p className="text-md my-1 text-[#151718]">{comment.comment || ''}</p>
                  <div className="inline-flex items-center gap-2">
                    <p className="text-sm text-[#687076]">{comment.date || ''}</p>
                    <p className="text-sm text-[#687076]">
                      {comment.markedAsReviewed ? '- Marked as reviewed' : ''}
                    </p>
                    <StatusBadgeCell status={comment.status as CatalogStatus} isSmall />
                  </div>
                </div>
              </div>
            </div>
        ))}

      {/* input for the comment  */}
      <div className="absolute bottom-4 w-full">
        <Input
          className="bg-sidebar-accent w-full rounded-2xl"
          placeholder="Type your message here"
        />
        <SendHorizontal className="text-muted-foreground absolute top-1/2 right-4 size-10 h-4 w-4 -translate-y-1/2 cursor-pointer" />
      </div>
    </div>
  )
}

export default CommentsTab
