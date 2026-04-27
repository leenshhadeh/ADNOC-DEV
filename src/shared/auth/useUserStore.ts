import { create } from 'zustand'
import type { Role } from '@/shared/lib/permissions'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CurrentUser {
  name: string
  role: Role
}

interface UserStore {
  user: CurrentUser
  setUser: (user: CurrentUser) => void
  setRole: (role: Role) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────
// When VITE_MOCK_AUTH=true the initial values below are used as-is.
// In production, ProtectedRoute's useSyncAuthUser hook overwrites them
// with the real MSAL account name & role claims.

export const useUserStore = create<UserStore>((set) => ({
  user: {
    name: 'Jane Doe',
    role: 'BPA Process Catalog Custodian',
    // role: 'Quality Manager',
    // role: 'Business Focal Point',
  },
  setUser: (user) => set({ user }),
  setRole: (role) => set((state) => ({ user: { ...state.user, role } })),
}))

// ─── Convenience selector ─────────────────────────────────────────────────────

/** Returns the current user. Prefer this over selecting the whole store. */
export function useCurrentUser(): CurrentUser {
  return useUserStore((state) => state.user)
}
