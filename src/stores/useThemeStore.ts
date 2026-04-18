"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, ThemeTransition } from "@/types";

interface ThemeStore {
  theme: Theme;
  transition: ThemeTransition;
  setTheme: (theme: Theme) => void;
  toggleTheme: (x: number, y: number) => void;
  clearTransition: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      transition: { x: 0, y: 0, active: false },

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          document.documentElement.setAttribute("data-theme", theme);
        }
      },

      toggleTheme: (x, y) => {
        const currentTheme = get().theme;
        const nextTheme: Theme = currentTheme === "light" ? "dark" : "light";

        set({ transition: { x, y, active: true } });

        // Apply theme after small delay to let animation start
        setTimeout(() => {
          set({ theme: nextTheme });
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", nextTheme === "dark");
            document.documentElement.setAttribute("data-theme", nextTheme);
          }
        }, 50);

        // Clear transition state after animation completes
        setTimeout(() => {
          set({ transition: { x, y, active: false } });
        }, 700);
      },

      clearTransition: () => {
        set({ transition: { x: 0, y: 0, active: false } });
      },
    }),
    {
      name: "continuum-theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
