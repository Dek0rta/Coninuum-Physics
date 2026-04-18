"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sun, Moon, Flame, User, Trophy, BookOpen, Zap, FlaskConical, Menu, X } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useUserStore } from "@/stores/useUserStore";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme, transition } = useThemeStore();
  const { profile } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleThemeToggle = () => {
    const btn = themeButtonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    toggleTheme(x, y);
  };

  const navItems = [
    { href: `/${locale}`, label: t("nav.home"), icon: null },
    {
      href: `/${locale}/learn/mechanics`,
      label: t("topic.mechanics"),
      icon: <Zap className="h-3.5 w-3.5" />,
    },
    {
      href: `/${locale}/quiz/mechanics`,
      label: t("nav.quiz"),
      icon: <FlaskConical className="h-3.5 w-3.5" />,
    },
    {
      href: `/${locale}/flashcards/mechanics`,
      label: t("nav.flashcards"),
      icon: <BookOpen className="h-3.5 w-3.5" />,
    },
    {
      href: `/${locale}/leaderboard`,
      label: t("nav.leaderboard"),
      icon: <Trophy className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <>
      {/* Theme transition overlay */}
      <div
        className="theme-transition-overlay"
        style={
          {
            "--t-x": `${transition.x}px`,
            "--t-y": `${transition.y}px`,
          } as React.CSSProperties
        }
        aria-hidden="true"
        data-active={transition.active}
        ref={(el) => {
          if (el) {
            if (transition.active) {
              el.classList.add("active");
            } else {
              el.classList.remove("active");
            }
          }
        }}
      />

      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-white text-xs font-bold">
              ∮
            </div>
            <span className="font-semibold text-[var(--text)] hidden sm:block">
              Continuum
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius)] text-sm",
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
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            {profile && profile.streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium">
                <Flame className="h-4 w-4" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={profile.streak}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="tabular-nums"
                  >
                    {profile.streak}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            {/* Desktop: Lang toggle */}
            <Link
              href={pathname.replace(`/${locale}`, `/${locale === "ru" ? "en" : "ru"}`)}
              className={cn(
                "hidden md:block px-2 py-1 rounded-[var(--radius)] text-xs font-medium uppercase",
                "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
                "transition-colors duration-150"
              )}
            >
              {locale === "ru" ? "EN" : "RU"}
            </Link>

            {/* Desktop: Theme toggle */}
            <button
              ref={themeButtonRef}
              onClick={handleThemeToggle}
              className={cn(
                "hidden md:flex h-9 w-9 items-center justify-center rounded-[var(--radius)]",
                "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
                "transition-colors duration-150"
              )}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Desktop: Profile */}
            <Link
              href={`/${locale}/profile`}
              className={cn(
                "hidden md:flex h-9 w-9 items-center justify-center rounded-[var(--radius)]",
                "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
                "transition-colors duration-150"
              )}
              aria-label={t("nav.profile")}
            >
              <User className="h-4 w-4" />
            </Link>

            {/* Mobile: Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "flex md:hidden h-9 w-9 items-center justify-center rounded-[var(--radius)]",
                "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
                "transition-colors duration-150"
              )}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
        navItems={navItems}
        pathname={pathname}
      />
    </>
  );
}
