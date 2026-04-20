import { create } from 'zustand'

export type DashboardTabValue = 'processSummary' | 'notifications' | 'myTasks'

interface DashboardNavStore {
  activeTab: DashboardTabValue
  setActiveTab: (tab: DashboardTabValue) => void
  navigateToMyTasks: () => void
}

export const useDashboardNavStore = create<DashboardNavStore>((set) => ({
  activeTab: 'processSummary',
  setActiveTab: (activeTab) => set({ activeTab }),
  navigateToMyTasks: () => set({ activeTab: 'myTasks' }),
}))
