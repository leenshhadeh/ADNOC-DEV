import { useState } from 'react'
import { Check } from 'lucide-react'
import copyIcon from '../../assets/icons/copy.svg'

const CopyText = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)

    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="text-sidebar-primary flex items-center gap-1">
      <span>{text}</span>

      <button onClick={handleCopy} className="rounded p-1 transition hover:bg-gray-100">
        {copied ? <Check className="text-sidebar-primary h-4 w-4" /> : <img src={copyIcon} />}
      </button>
    </div>
  )
}

export default CopyText
