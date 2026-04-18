"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  navItems: NavItem[];
  pathname: string;
}

export function MobileNav({ isOpen, onClose, locale, navItems, pathname }: MobileNavProps) {
  const { theme, toggleTheme } = useThemeStore();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const otherLocale = locale === "ru" ? "en" : "ru";
  const langHref = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.nav
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-[var(--bg)] border-l border-[var(--border)] shadow-2xl"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-white text-xs font-bold">
                  ∮
                </div>
                <span className="font-semibold text-[var(--text)]">Continuum</span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm mb-0.5",
                      "transition-colors duration-150",
                      isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Bottom controls */}
            <div className="border-t border-[var(--border)] px-3 py-3 space-y-1">
              {/* Lang toggle */}
              <Link
                href={langHref}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="text-base">🌐</span>
                {locale === "ru" ? "English" : "Русский"}
              </Link>

              {/* Theme toggle */}
              <button
                onClick={() => {
                  toggleTheme(window.innerWidth / 2, window.innerHeight / 2);
                  onClose();
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === "light" ? "Dark mode" : "Light mode"}
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
