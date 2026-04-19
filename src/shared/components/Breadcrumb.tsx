import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import React from 'react'

interface BreadcrumbLink {
  title: string
  url?: string
  isCurrentPage?: boolean
}
interface BreadcrumbLinks {
  links: BreadcrumbLink[]
}

const Breadcrumb = (props: BreadcrumbLinks) => {
  const { links = [] } = props

  const homeLink = { title: 'Home', url: '/dashboard', isCurrentPage: false }
  const allLinks: BreadcrumbLink[] = [homeLink, ...links]

  return (
    <div className="pt-5 pb-1">
      <BreadcrumbContainer>
        <BreadcrumbList>
          {allLinks.map((link, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {link.isCurrentPage || !link.url ? (
                  <BreadcrumbPage>{link.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={link.url}>
                    {link.title}
                    </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < allLinks.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </BreadcrumbContainer>
    </div>
  )
}

export default Breadcrumb
