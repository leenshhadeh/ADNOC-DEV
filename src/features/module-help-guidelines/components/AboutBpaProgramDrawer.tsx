import { Separator } from '@radix-ui/react-separator'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface ActivityItem {
  index: number
  title: string
  content: string
}

interface AboutBpaProgramDrawerProps {
  open: boolean
  onClose: () => void
  activities: ActivityItem[]
}

const AboutBpaProgramDrawer = ({
  open,
  onClose,
  activities,
}: AboutBpaProgramDrawerProps) => {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-end transition-colors duration-300',
        open ? 'pointer-events-auto bg-black/40' : 'pointer-events-none bg-black/0',
      )}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'flex h-full w-full max-w-[620px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <p className="text-[23px] leading-[32px] font-[500] text-[#151718]">
            About the BPA Program
          </p>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#151718] hover:bg-[#F3F4F6]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="h-px w-full bg-[#DFE3E6]" />

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            <div>
              <p className="pb-2 text-[14px] leading-[24px] font-[500] text-[#687076]">
                Introduction to the BPA Program:
              </p>
              <div className="space-y-5 text-[16px] leading-[22px] font-[400] text-[#151718]">
                <p>
                  ADNOC Group is fully committed to its <b>digital transformation goals.</b>{' '}
                  Central to this commitment is ADNOC&apos;s Business Process Automation Program,
                  launched by <b>Group Digital & Cybersecurity in 2024.</b>
                </p>
                <p>
                  The program aims to accelerate digital transformation by continuously monitoring
                  automation maturity across the Group and supporting digital ideation of automation
                  opportunities. It focuses on measuring process automation maturity, identifying
                  AI-powered processes and opportunities for enhancement, assessing human effort,
                  and setting automation targets to maximize efficiency.
                </p>
                <p>
                  In its first year, the program drew insights from over <b>1,000 contributors,</b>{' '}
                  including subject matter experts, business, and digital focal points, analyzing
                  more than <b>5,500 business</b> processes across <b>27 business domains</b> that
                  span ADNOC&apos;s entire value chain.
                </p>
                <p className="font-[700]">
                  Together, we are paving the way for the future of automation-one insight, one
                  process at a time.
                </p>
              </div>
            </div>

            <Separator orientation="horizontal" className="h-px w-full bg-[#DFE3E6]" />

            <div>
              <p className="pb-2 text-[14px] leading-[24px] font-[500] text-[#687076]">
                Business Process Hierarchy and Domain Overview:
              </p>
              <div className="space-y-5 text-[16px] leading-[22px] font-[400] text-[#151718]">
                <p>
                  The BPA Assessment Tool is a web-based interface designed to streamline the
                  management of BPA assessments and the BPA Framework across ADNOC&apos;s group
                  companies and business domains. It makes the data collection process easier,
                  faster, and more user-friendly, ensuring data is always up-to-date.
                </p>
              </div>
            </div>

            <Separator orientation="horizontal" className="h-px w-full bg-[#DFE3E6]" />

            <div>
              <p className="pb-2 text-[14px] leading-[24px] font-[500] text-[#687076]">
                Introduction to the BPA Tool:
              </p>
              <div className="space-y-5 text-[16px] leading-[22px] font-[400] text-[#151718]">
                <p className="font-[700]">What is the BPA Tool?</p>
                <p>
                  The BPA Assessment Tool is a web-based interface designed to streamline the
                  management of BPA assessments and the BPA Framework across ADNOC&apos;s group
                  companies and business domains. It makes the data collection process easier,
                  faster, and more user-friendly, ensuring data is always up-to-date.
                </p>

                <p className="font-[700]">Key Activities on the BPA Tool:</p>

                <div className="flex flex-col gap-3 pb-4">
                  {activities.map((item) => (
                    <div
                      className="flex gap-5 rounded-[10px] border border-[#DFE1E7] px-3 py-3"
                      key={item.index}
                    >
                      <p className="flex h-[50px] w-[120px] items-center justify-center rounded-[10px] border border-[#DFE3E6] bg-[linear-gradient(180deg,rgba(255,255,255,0.40)_0%,#FFF_100%)] text-center shadow-[inset_-1px_-1px_5.3px_0_rgba(156,156,156,0.25)]">
                        {item.index}
                      </p>
                      <div className="flex flex-col gap-2 pt-1">
                        <p className="font-[700]">{item.title}</p>
                        <p>{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutBpaProgramDrawer
