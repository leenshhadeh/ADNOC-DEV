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
// TODO: replace the initial mock user with the authenticated user from your
//       auth provider (e.g. MSAL, Okta). Call setUser() after login resolves.

export const useUserStore = create<UserStore>((set) => ({
  user: {
    name: 'Jane Doe',
    // role: 'BPA Program Manager',
    // role: 'Business Focal Point',
    role: 'BPA Process Catalog Custodian',
  },
  setUser: (user) => set({ user }),
  setRole: (role) => set((state) => ({ user: { ...state.user, role } })),
}))

// ─── Convenience selector ─────────────────────────────────────────────────────

/** Returns the current user. Prefer this over selecting the whole store. */
export function useCurrentUser(): CurrentUser {
  return useUserStore((state) => state.user)
}
