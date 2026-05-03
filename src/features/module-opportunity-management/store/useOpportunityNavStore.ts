import { create } from 'zustand'
import type { OpportunityTabValue } from '../types'

interface OpportunityNavStore {
  activeTab: OpportunityTabValue
  setActiveTab: (tab: OpportunityTabValue) => void
}

export const useOpportunityNavStore = create<OpportunityNavStore>((set) => ({
  activeTab: 'opportunities',
  setActiveTab: (activeTab) => set({ activeTab }),
}))
