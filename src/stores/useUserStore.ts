"use client";

import { create } from "zustand";
import type { Profile } from "@/types";

interface UserStore {
  profile: Profile | null;
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  updateMmr: (newMmr: number, newRank: string) => void;
  incrementStreak: () => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  profile: null,
  isLoading: true,

  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  updateMmr: (newMmr, newRank) => {
    const profile = get().profile;
    if (!profile) return;
    set({ profile: { ...profile, mmr: newMmr, rank: newRank as Profile["rank"] } });
  },

  incrementStreak: () => {
    const profile = get().profile;
    if (!profile) return;
    const newStreak = profile.streak + 1;
    set({
      profile: {
        ...profile,
        streak: newStreak,
        max_streak: Math.max(newStreak, profile.max_streak),
        last_active: new Date().toISOString().split("T")[0],
      },
    });
  },
}));
