import type { FilterOption } from '@/shared/types/filters'

/**
 * Stable section IDs for the process catalog filter sheet.
 * These are passed to useProcessFilters to initialise state — they must
 * never change order or value between renders.
 */
export const FILTER_SECTION_IDS = ['applicability', 'status', 'domain'] as const
export type FilterSectionId = (typeof FILTER_SECTION_IDS)[number]

/**
 * All possible process statuses for the "Filter by status" section.
 * Must stay in sync with the ProcessStatus union in types/index.ts.
 */
export const PROCESS_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { id: 'Ready for Submission', label: 'Ready for Submission' },
  { id: 'Quality Review', label: 'Quality Review' },
  { id: 'Digital VP Review', label: 'Digital VP Review' },
  { id: 'Returned', label: 'Returned' },
  { id: 'Rejected', label: 'Rejected' },
  { id: 'Published', label: 'Published' },
  { id: 'Pending approval', label: 'Pending approval' },
  { id: 'Draft', label: 'Draft' },
]
