import type { CommentEntry } from '../../../types'

interface CommentsTabProps {
  comments: CommentEntry[]
}

const CommentsTab = ({ comments }: CommentsTabProps) => {
  return (
    <div>
      <h3 className="text-foreground mb-4 text-lg font-semibold">Comments</h3>

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-[#DFE3E6] bg-[#FAFAFA] px-5 py-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-foreground text-sm font-semibold">{comment.author}</span>
                <span className="text-muted-foreground text-xs">— {comment.role}</span>
              </div>
              <p className="text-foreground text-sm leading-relaxed">{comment.text}</p>
              <p className="text-muted-foreground mt-2 text-xs">{comment.timestamp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentsTab
