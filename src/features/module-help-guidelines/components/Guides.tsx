import { useState } from 'react'
import { AccessCard } from '@/features/module-dashboard'
import { Separator } from '@radix-ui/react-separator'
import { Sheet, Target, Files, BriefcaseBusiness, Folder, ExternalLink } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import logoIcon from '../../../assets/logoicon.svg'
import AboutBpaProgramDrawer from './AboutBpaProgramDrawer'
import { useAppConfig } from '@/shared/hooks/useAppConfig'
type IconType = ComponentType<LucideProps> | string
type Types = 'normal' | 'read' | 'video' | 'both'

interface AccessCardItem {
  title: string
  description: string
  icon: IconType
  to: string
  type: Types
  duration: number
}

const Guides = () => {
  const [open, setOpen] = useState(false)
  const config = useAppConfig()

  const accessCardItems: AccessCardItem[] = [
    {
      title: 'Assessment Data',
      description: 'Learn how to fill in assessment data fields accurately.',
      icon: Sheet,
      to: '',
      type: 'read',
      duration: 5,
    },
    {
      title: 'Target Automation',
      description: 'Learn how to define target automation levels for business processes.',
      icon: Target,
      to: '',
      type: 'read',
      duration: 2,
    },
    {
      title: 'Process Catalog',
      description: 'Learn how to manage process applicability across GCs.',
      icon: Files,
      to: '',
      type: 'video',
      duration: 3,
    },
    {
      title: 'Opportunities',
      description: 'Learn how to document, and track automation opportunities effectively.',
      icon: BriefcaseBusiness,
      to: '',
      type: 'both',
      duration: 8,
    },
  ]
  const activities = [
    {
      index: 1,
      title: 'Collect/Update Assessment Data:',
      content:
        'Efficiently update and manage assessment data for business processes, including automation levels and the volume of manual operations, across all ADNOC group companies.',
    },
    {
      index: 2,
      title: 'Manage Automation Targets:',
      content:
        'Set "north star" automation targets for each business process, ensuring alignment with leading best practices and ADNOC\'s broader digital transformation goals across different business domains. (only for digital experts and SMEs).',
    },
    {
      index: 3,
      title: 'Add/Manage Automation Opportunities:',
      content:
        'Add and map identified automation opportunities to specific business processes, while tracking their progress and status to drive continual process automation optimization (in phase 2 of the BPA Tool roll-out).',
    },
    {
      index: 4,
      title: 'Update BPA Program Framework:',
      content:
        'Update the applicability of business processes in the BPA framework to align with changing needs and requirements across targeted ADNOC group companies and business domains (in phase 2 of the BPA Tool roll-out).',
    },
  ]

  return (
    <>
      <div className="flex h-full w-full flex-col gap-3 overflow-hidden px-4 pb-2">
        <p className="text-[17px] leading-[20px] font-[500] text-[#151718]">
          About the BPA Program
        </p>
        <p className="text-[14px] leading-[23px] font-normal tracking-[-0.2px] text-[#687076]">
          The ADNOC Business Process Automation (BPA) Program supports the Group’s digital
          transformation by monitoring automation maturity across business processes and identifying
          opportunities for improvement.
          <br />
          <br />
          Launched by Group Digital & Cybersecurity in 2024, the program helps measure automation
          levels, assess manual effort, and define targets to improve operational efficiency across
          ADNOC’s value chain. {'   '}
          <span
            className="cursor-pointer text-[16px] leading-[24px] font-[600] text-[#0047BA] hover:underline"
            onClick={() => setOpen(true)}
          >
            Read more
          </span>
        </p>
        <Separator orientation="horizontal" className="h-px w-full shrink-0 bg-[#DFE3E6]" />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {accessCardItems.map((item, index) => (
            <AccessCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
              to={item.to}
              type={item.type}
              duration={item.duration}
            />
          ))}
        </div>
        <Separator orientation="horizontal" className="h-px w-full shrink-0 bg-[#DFE3E6]" />
        <div className="w-full px-1 py-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
            <div className="flex min-w-0 items-start">
              <div className="flex gap-4 md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#D9E8FF] md:h-16 md:w-16">
                  <img
                    src={logoIcon}
                    className="h-7 w-7 fill-red-500 text-[#0047BA] md:h-8 md:w-8"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-2 md:gap-5">
                  <p className="text-[18px] leading-[28px] font-[500] text-[#151718]">
                    BPA AI Assistant
                  </p>
                  <p className="text-[14px] leading-[22px] font-[400] text-[#687076] md:max-w-[320px] md:text-[16px] md:leading-[24px]">
                    Ask BPA Copilot questions and get instant guidance
                  </p>
                </div>
              </div>
            </div>
            <Separator
              orientation="horizontal"
              className="h-px w-full shrink-0 bg-[#DFE3E6] xl:hidden"
            />
            <Separator
              orientation="vertical"
              className="hidden h-20 w-px shrink-0 bg-[#DFE3E6] lg:block"
            />
            <div
              className="flex min-w-0 cursor-pointer gap-4 md:gap-6"
              onClick={() => window.open(config?.SERVICENOW_URL, '_blank', 'noopener,noreferrer')}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#D9E8FF] md:h-16 md:w-16">
                <Folder className="h-7 w-7 text-[#0047BA] md:h-8 md:w-8" />
              </div>

              <div className="flex min-w-0 flex-col gap-2 md:gap-5">
                <div className="flex items-center gap-2">
                  <p className="text-[18px] leading-[28px] font-[500] text-[#151718]">
                    Service Now Support
                  </p>
                  <ExternalLink className="h-5 w-5 shrink-0 text-black" />
                </div>

                <p className="text-[14px] leading-[22px] font-[400] text-[#687076] md:max-w-[320px] md:text-[16px] md:leading-[24px]">
                  Track assessment progress for your domains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutBpaProgramDrawer open={open} onClose={() => setOpen(false)} activities={activities} />
    </>
  )
}

export default Guides
