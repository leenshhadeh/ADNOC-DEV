import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type IconType = ComponentType<LucideProps> | string

interface AccessCardProps {
  title: string
  description: string
  icon: IconType
  to?: string
  redirect?: string
}

const AccessCard = ({ title, description, icon, to, redirect }: AccessCardProps) => {
  const isImage = typeof icon === 'string'
  const navigate = useNavigate()
  return (
    <div
      onClick={() => {
        if (to) navigate(to)
      }}
      className="h-full w-full cursor-pointer rounded-[24px] bg-gradient-to-r from-[#4EF1E4]/40 to-[#111827]/40 p-[0.5px] shadow-[0_4px_12px_0_#D1D5DF80]"
    >
      <div className="h-full rounded-[23px] bg-white px-8 py-7 hover:bg-accent">
        <div className="flex items-start gap-5">
          <div className="flex items-start gap-5 justify-self-start">
            <div className="flex h-8 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#DCE8F4]">
              {isImage ? (
                <img src={icon} alt={title} className="h-5 w-5 object-contain" />
              ) : (
                (() => {
                  const Icon = icon
                  return <Icon className="h-5 w-5 text-brand-blue" />
                })()
              )}
            </div>

            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3 pt-2">
                <h3 className="text-[16px] leading-none font-normal text-[#151718]">{title}</h3>
                {redirect && (
                  <a href={redirect} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="max-w-[520px] text-[16px] leading-[1.35] text-[#687076]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessCard
