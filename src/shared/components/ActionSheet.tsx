/**
 * ActionSheet — generic accessible slide-over panel.
 *
 * Provides the Sheet container, visible title header, and a scrollable body slot.
 * Compose specific sheets (ProcessFilterSheet, RequestDetailsSheet, etc.) on top of this.
 */
import type { ReactNode } from 'react'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'

interface ActionSheetProps {
  title: string
  subTitle?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}

const ActionSheet = ({ title, open, onOpenChange, subTitle, children }: ActionSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      className="flex w-full flex-col p-0 sm:max-w-[460px] lg:max-w-[600px]"
    >
      <SheetHeader className="border-border shrink-0 border-b px-6 py-5">
        <SheetTitle className="text-foreground text-2xl font-semibold">{title}</SheetTitle>
        {subTitle && <p className="text-muted-foreground text-[14px]">{subTitle}</p>}
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
)

export default ActionSheet
