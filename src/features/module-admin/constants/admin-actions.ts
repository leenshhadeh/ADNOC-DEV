import type { ToolbarAction } from '@/shared/components/ModuleToolbar'
import { Plus, Download, Layers, Check, Ban } from 'lucide-react'
export const USER_PERMISSONS_ACTIONS: ToolbarAction[] = [
  {
    id: 'add-new',
    label: 'Add new',
    icon: Plus,
    onClick: () => {},
  },
  {
    id: 'bulk-action',
    label: 'Bulk action',
    icon: Layers,
    onClick: () => {},
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    onClick: () => {},
  },
]

export const GROUP_COMPANIES_ACTIONS: ToolbarAction[] = [
  {
    id: 'add-new',
    label: 'Add new',
    icon: Plus,
    onClick: () => {},
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    onClick: () => {},
  },
]
export const DOMAINS_ACTIONS: ToolbarAction[] = [
  {
    id: 'add-new',
    label: 'Add new',
    icon: Plus,
    onClick: () => {},
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    onClick: () => {},
  },
]
export const ASSESSMENT_CYCLE_ACTIONS: ToolbarAction[] = [
  {
    id: 'add-new',
    label: 'Add new',
    icon: Plus,
    onClick: () => {},
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    onClick: () => {},
  },
]
export const RATE_CARDS_ACTIONS: ToolbarAction[] = [
  {
    id: 'bulk-action',
    label: 'Bulk action',
    icon: Layers,
    onClick: () => {},
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    onClick: () => {},
  },
]
export const EMAIL_NOTIFICATION_ACTIONS: ToolbarAction[] = [
  {
    id: 'enable-all',
    label: 'Enable all',
    icon: Check,
    onClick: () => {},
  },
  {
    id: 'disable-all',
    label: 'Disable all',
    icon: Ban,
    onClick: () => {},
  },
]

export const tabActions = {
  'user-permissions': USER_PERMISSONS_ACTIONS,
  'group-companies': GROUP_COMPANIES_ACTIONS,
  domains: DOMAINS_ACTIONS,
  'rate-cards': RATE_CARDS_ACTIONS,
}
