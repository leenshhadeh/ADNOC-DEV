/**
 * ActionSheet — generic accessible slide-over panel.
 *
 * Provides the Sheet container, visible title header, and a scrollable body slot.
 * Compose specific sheets (ProcessFilterSheet, RequestDetailsSheet, etc.) on top of this.
 */
import type { ReactNode } from 'react'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { cn } from '../lib/utils'

interface ActionSheetProps {
  title: string
  subTitle?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
  large?: boolean
}
const ActionSheet = ({
  title,
  open,
  onOpenChange,
  subTitle,
  large = false,
  children,
}: ActionSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      className={cn(
        'flex w-full flex-col p-0 sm:max-w-[460px]',
        large ? 'lg:max-w-[600px]' : 'lg:max-w-[500px]',
      )}
    >
      <SheetHeader className="border-border shrink-0 px-4 pt-4 sm:px-6">
        <SheetTitle className="text-foreground text-xl font-semibold sm:text-2xl">
          {title}
        </SheetTitle>
        {subTitle && <p className="text-muted-foreground text-[14px]">{subTitle}</p>}
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
)

export default ActionSheet
