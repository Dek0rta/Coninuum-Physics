"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Home,
  User,
  Trophy,
  Zap,
  LayoutGrid,
  BookOpen,
  BookMarked,
  FlaskConical,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { getRankFromMmr } from "@/lib/mmr";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SidebarProps {
  locale: string;
}

export function Sidebar({ locale }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { profile } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleThemeToggle = () => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (shouldReduceMotion || !doc.startViewTransition) {
      toggleTheme();
      return;
    }

    const btn = themeButtonRef.current;
    const rect = btn?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const maxR = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const vt = doc.startViewTransition(() => {
      toggleTheme();
    });
    void vt.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxR}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  };

  const rank = profile ? getRankFromMmr(profile.mmr) : null;

  const overviewItems = [
    {
      href: `/${locale}`,
      label: t("nav.home"),
      icon: <Home className="h-4 w-4" />,
      exact: true,
    },
    {
      href: `/${locale}/profile`,
      label: t("sidebar.cabinet"),
      icon: <User className="h-4 w-4" />,
      exact: false,
    },
    {
      href: `/${locale}/leaderboard`,
      label: t("sidebar.community"),
      icon: <Trophy className="h-4 w-4" />,
      exact: false,
    },
  ];

  const practiceItems = [
    {
      href: `/${locale}/quiz/mechanics`,
      label: t("sidebar.training"),
      icon: <Zap className="h-4 w-4" />,
      match: `/${locale}/quiz`,
      badge: null,
    },
    {
      href: `/${locale}/quiz/mechanics`,
      label: t("sidebar.problemBank"),
      icon: <LayoutGrid className="h-4 w-4" />,
      match: null,
      badge: null,
    },
    {
      href: `/${locale}/flashcards/mechanics`,
      label: t("nav.flashcards"),
      icon: <BookOpen className="h-4 w-4" />,
      match: `/${locale}/flashcards`,
      badge: "NEW",
    },
    {
      href: `/${locale}/learn/mechanics`,
      label: t("nav.learn"),
      icon: <BookMarked className="h-4 w-4" />,
      match: `/${locale}/learn`,
      badge: null,
    },
    {
      href: `/${locale}/learn/mechanics`,
      label: t("sidebar.simulations"),
      icon: <FlaskConical className="h-4 w-4" />,
      match: null,
      badge: null,
    },
  ];

  const isActiveOverview = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isActivePractice = (match: string | null, href: string) => {
    if (match) return pathname.startsWith(match);
    return pathname === href;
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-r border-[var(--border)] bg-[var(--bg)] overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--border)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white text-sm font-bold shrink-0">
          ∮
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm text-[var(--text)] leading-tight">
            Continuum
          </span>
          <span className="text-[10px] text-[var(--text-muted)] leading-tight">
            {t("sidebar.tagline")}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {/* ОБЗОР */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-2 mb-1.5">
            {t("sidebar.overview")}
          </p>
          <ul className="space-y-0.5">
            {overviewItems.map((item) => {
              const active = isActiveOverview(item.href, item.exact);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors duration-150",
                      active
                        ? "bg-[var(--bg-secondary)] text-[var(--text)] font-medium"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
                    )}
                  >
                    <span className={active ? "text-[var(--accent)]" : ""}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ПРАКТИКА */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-2 mb-1.5">
            {t("sidebar.practice")}
          </p>
          <ul className="space-y-0.5">
            {practiceItems.map((item, i) => {
              const active = isActivePractice(item.match, item.href);
              return (
                <li key={i}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors duration-150",
                      active
                        ? "bg-[var(--bg-secondary)] text-[var(--text)] font-medium"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
                    )}
                  >
                    <span className={active ? "text-[var(--accent)]" : ""}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-semibold bg-[var(--accent)]/15 text-[var(--accent)] px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* РОСТ */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-2">
            {t("sidebar.growth")}
          </p>
        </div>
      </nav>

      {/* Bottom: user card + controls */}
      <div className="px-3 pb-4 border-t border-[var(--border)] pt-3 space-y-3">
        {profile && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-[var(--bg-secondary)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-bold shrink-0 select-none">
              {profile.username[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-[var(--text)] truncate">
                {profile.username}
              </span>
              {rank && (
                <span className="text-[11px]" style={{ color: rank.color }}>
                  {profile.mmr} MMR · {rank.icon} {rank.label}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            ref={themeButtonRef}
            onClick={handleThemeToggle}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs",
              "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
              "transition-colors duration-150 border border-[var(--border)]",
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
                  <Moon className="h-3.5 w-3.5" />
                ) : (
                  <Sun className="h-3.5 w-3.5" />
                )}
              </motion.div>
            </AnimatePresence>
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </button>

          {profile && (
            <button
              onClick={handleSignOut}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-lg shrink-0",
                "text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10",
                "transition-colors duration-150 border border-[var(--border)]",
              )}
              aria-label={t("auth.signOut")}
              title={t("auth.signOut")}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
