
import { Check, CheckCheck } from 'lucide-react'


const MarkedAsReviewCell = (props:any) => {
    const { marked, date , id , handleMarkAsReviewed} = props
    if (marked) {
      return (
        <div>
          <div className="flex items-start justify-start gap-1">
            <CheckCheck className="text-muted-foreground size-4" />
            <div>
              <p className="text-sm font-medium text-[#889096]">Marked</p>
              {date && <p className="text-[12px] text-[#687076]">Marked on: {date || 'N/A'}</p>}
            </div>
          </div>
        </div>
      )
    }
    return (
      <button
        className="flex cursor-pointer items-center justify-start gap-1"
        onClick={() => handleMarkAsReviewed(id)}
      >
        <Check className="text-primary size-4" />
        <span className="text-primary text-sm font-medium">Mark as reviewed</span>
      </button>
    )
  }

export default MarkedAsReviewCell

