"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StreakStore {
  showStreakAnimation: boolean;
  pendingStreakIncrement: boolean;
  triggerStreakAnimation: () => void;
  clearStreakAnimation: () => void;
  setPendingIncrement: (pending: boolean) => void;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set) => ({
      showStreakAnimation: false,
      pendingStreakIncrement: false,

      triggerStreakAnimation: () => {
        set({ showStreakAnimation: true });
        setTimeout(() => set({ showStreakAnimation: false }), 2000);
      },

      clearStreakAnimation: () => set({ showStreakAnimation: false }),

      setPendingIncrement: (pendingStreakIncrement) =>
        set({ pendingStreakIncrement }),
    }),
    {
      name: "continuum-streak",
      partialize: () => ({}),
    }
  )
);
