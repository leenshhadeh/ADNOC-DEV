import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'

const Chatbot = () => {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 px-5">
      <p className="text-[24px] leading-[32px] font-[700] text-[#111827]">How can we help you?</p>

      <p className="text-[15px] leading-[23px] font-[400] text-[#4A5565]">
        Find guidance, understand workflows, and complete assessments with confidence.
      </p>

      <div className="flex w-full flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#687076]" />
          <Input
            placeholder="Type your question or search a keyword"
            type="text"
            className="pl-10"
          />
        </div>

        <p className="text-[15px] leading-[23px] font-[400] text-[#4A5565]">
          Suggested topics:{' '}
          <span className="cursor-pointer text-blue-600 hover:underline">
            how can I assess a process
          </span>
          ,{' '}
          <span className="cursor-pointer text-blue-600 hover:underline">
            how can I manage process applicability across GCs
          </span>
          ,{' '}
          <span className="cursor-pointer text-blue-600 hover:underline">
            how can I define target automation levels?
          </span>
        </p>
      </div>
    </div>
  )
}

export default Chatbot
