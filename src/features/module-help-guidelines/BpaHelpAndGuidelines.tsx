import Breadcrumb from '@/shared/components/Breadcrumb'
import chatbg from '../../assets/images/chatbg.gif'
import Chatbot from './components/Chatbot'
import Guides from './components/Guides'

const BpaHelpAndGuidelines = () => {
  return (
    <div className="flex h-[calc(100dvh-28px)] w-full flex-col overflow-hidden px-3 pb-2">
      <Breadcrumb links={[{ title: 'BPA Help & Guidelines', isCurrentPage: true }]} />
      <p className="shrink-0 pt-2 text-[24px] font-[700] text-[#111827]">BPA Help & Guidelines</p>
      <div className="flex min-h-0 flex-1 gap-5 pt-3">
        <div
          className="h-[100%] min-h-0 w-1/3 self-center overflow-hidden rounded-[32px] border-[0.1px] border-[#4EF1E4] bg-cover bg-center bg-no-repeat shadow-[0_4px_8px_0_rgba(209,213,223,0.5)]"
          style={{ backgroundImage: `url(${chatbg})` }}
        >
          <Chatbot />
        </div>

        <div className="min-h-0 w-2/3 overflow-hidden">
          <Guides />
        </div>
      </div>
    </div>
  )
}

export default BpaHelpAndGuidelines
