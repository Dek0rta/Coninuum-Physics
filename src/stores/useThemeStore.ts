"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          document.documentElement.setAttribute("data-theme", theme);
        }
      },

      toggleTheme: () => {
        const nextTheme: Theme = get().theme === "light" ? "dark" : "light";
        set({ theme: nextTheme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", nextTheme === "dark");
          document.documentElement.setAttribute("data-theme", nextTheme);
        }
      },
    }),
    {
      name: "continuum-theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
