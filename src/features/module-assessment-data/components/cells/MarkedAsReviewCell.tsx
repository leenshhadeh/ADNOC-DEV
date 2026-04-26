
import { useEffect, useState } from 'react'
import { Check, CheckCheck } from 'lucide-react'

interface MarkedAsReviewCellProps {
  date?: string
  id: string
  handleMarkAsReviewed: (id: string) => void
}

const formatMarkedDate = (value?: string) => {
  if (!value)  return ''
  const parsed = /^\d+$/.test(value) ? new Date(Number(value)) : new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

const MarkedAsReviewCell = ({ date, id, handleMarkAsReviewed }: MarkedAsReviewCellProps) => {
  const [isMarked, setIsMarked] = useState(false)
  const [markedDate, setMarkedDate] = useState(date)

  useEffect(() => {
    setMarkedDate(date)
  }, [date])

  const onMarkAsReviewed = () => {
    const nextMarkedDate = new Date().toISOString()

    handleMarkAsReviewed(id)
    setMarkedDate(nextMarkedDate)
    setIsMarked(true)

    // the “Marked” state remains for 10 seconds, after which the “Mark as reviewed” button becomes available again
    window.setTimeout(() => {
      setIsMarked(false)
    }, 10000)
  }

  if (isMarked) {
    return (
      <div className="space-y-1">
        <div className="flex items-start justify-start gap-1">
          <CheckCheck className="text-muted-foreground size-4" />
          <div>
            <p className="text-sm font-medium text-[#889096]">Marked</p>
            {/* <p className="text-xs text-emerald-600">Process marked as reviewed successfully.</p> */}
            {markedDate ? (
              <p className="text-[12px] text-[#687076]">Marked on: {formatMarkedDate(markedDate)}</p>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <button
        className="flex cursor-pointer items-center justify-start gap-1"
        onClick={onMarkAsReviewed}
        type="button"
      >
        <Check className="text-primary size-4" />
        <span className="text-primary text-sm font-medium">Mark as reviewed</span>
      </button>
      {markedDate ? (
        <p className="text-[12px] text-[#687076]">Marked on: {formatMarkedDate(markedDate)}</p>
      ) : null}
    </div>
  )
}

export default MarkedAsReviewCell
