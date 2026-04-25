/**
 * BaseModal — shared modal shell used across the app.
 *
 * Renders a full-screen backdrop with a centred card.
 * Consumers provide the header title, optional subtitle, body content,
 * and footer buttons via children + the footer prop.
 *
 * Usage:
 *   <BaseModal
 *     open={open}
 *     onClose={() => onOpenChange(false)}
 *     title="Approve requests"
 *     subtitle="Are you sure?"
 *     footer={<>...</>}
 *   >
 *     {/* body content }
 *   </BaseModal>
 */

import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Button } from './ui/button'

export interface BaseModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  /** Max width of the card — defaults to "max-w-[480px]". Pass "max-w-lg" etc. */
  maxWidth?: string
  children?: React.ReactNode
  /** Slot for footer buttons (Cancel / Confirm etc.) */
  footer: React.ReactNode
}

const BaseModal = ({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = 'max-w-[480px]',
  children,
  footer,
}: BaseModalProps) => {
  if (!open) return null

  return createPortal(
    <div
      className="bg-foreground/40 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl bg-accent p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-foreground text-2xl font-medium">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Body */}
        {children && <div className="mt-5 flex flex-col gap-4">{children}</div>}

        {/* Footer */}
        <div className="mt-6 grid grid-cols-2 gap-3">{footer}</div>
      </div>
    </div>,
    document.body,
  )
}

export default BaseModal
