import { create } from 'zustand'
import type { CatalogTabValue } from '../components/CatalogHeader'

// ─── Store ────────────────────────────────────────────────────────────────────

interface CatalogNavStore {
  activeTab: CatalogTabValue
  /** ProcessItem.id to scroll to and highlight after switching to the Processes tab. */
  highlightedProcessId: string | null
  setActiveTab: (tab: CatalogTabValue) => void
  /**
   * Deep-link: switches to the Processes tab and marks the given row for
   * scroll + highlight. Call from any tab's "Go To Affected Record" action.
   */
  navigateToProcess: (processId: string) => void
  clearHighlight: () => void
}

export const useCatalogNavStore = create<CatalogNavStore>((set) => ({
  activeTab: 'processes',
  highlightedProcessId: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  navigateToProcess: (processId) =>
    set({ activeTab: 'processes', highlightedProcessId: processId }),
  clearHighlight: () => set({ highlightedProcessId: null }),
}))
