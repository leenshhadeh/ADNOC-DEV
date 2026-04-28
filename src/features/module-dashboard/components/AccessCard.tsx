import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { Clock3, ExternalLink, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type IconType = ComponentType<LucideProps> | string
type Types = 'normal' | 'read' | 'video' | 'both'

interface AccessCardProps {
  title: string
  description: string
  icon: IconType
  to?: string
  redirect?: string
  type?: Types
  duration?: number
}

const AccessCard = ({
  title,
  description,
  icon,
  to,
  redirect,
  type = 'normal',
  duration,
}: AccessCardProps) => {
  const isImage = typeof icon === 'string'
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else if (redirect) {
      window.open(redirect, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      onClick={handleClick}
      className="h-full w-full cursor-pointer rounded-[24px] bg-gradient-to-r from-[#4EF1E4]/40 to-[#111827]/40 p-[0.5px] shadow-[0_4px_12px_0_#D1D5DF80]"
    >
      <div className="hover:bg-accent h-full rounded-[23px] bg-white px-5 py-5 md:px-8 md:py-7">
        <div className="flex h-full items-start gap-4 md:gap-5">
          <div className="flex h-full w-full items-start gap-4 justify-self-start md:gap-5">
            <div className="flex h-8 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#DCE8F4]">
              {isImage ? (
                <img src={icon} alt={title} className="h-5 w-5 object-contain" />
              ) : (
                (() => {
                  const Icon = icon
                  return <Icon className="text-brand-blue h-5 w-5" />
                })()
              )}
            </div>

            <div className="flex h-full flex-1 flex-col items-start gap-2 md:gap-3">
              <div className="flex items-center gap-2 pt-1 md:gap-3 md:pt-2">
                <h3 className="text-[15px] leading-none font-normal text-[#151718] md:text-[16px]">
                  {title}
                </h3>

                {redirect && (
                  <a
                    href={redirect}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <p className="max-w-[520px] text-[14px] leading-[1.35] text-[#687076] md:text-[16px]">
                {description}
              </p>

              {type !== 'normal' && (
                <div className="mt-auto flex w-full flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[13px] text-[#687076] md:justify-between md:pt-2 md:text-[14px]">
                  {(type === 'read' || type === 'both') && (
                    <div className="flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      <span>{duration} min read</span>
                    </div>
                  )}

                  {(type === 'video' || type === 'both') && (
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      <span>{duration} min video guide</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessCard
