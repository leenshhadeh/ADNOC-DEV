import { create } from 'zustand'

export type AssessmentTabValue = 'processes' | 'my-tasks' | 'submittedRequests'

interface AssessmentNavStore {
  activeTab: AssessmentTabValue
  setActiveTab: (tab: AssessmentTabValue) => void
}

export const useAssessmentNavStore = create<AssessmentNavStore>((set) => ({
  activeTab: 'processes',
  setActiveTab: (activeTab) => set({ activeTab }),
}))
