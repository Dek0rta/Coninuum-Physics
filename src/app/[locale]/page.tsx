"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Zap,
  Waves,
  Thermometer,
  FlaskConical,
  ArrowRight,
  Flame,
  BookOpen,
} from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { getRankFromMmr } from "@/lib/mmr";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TOPICS = [
  {
    slug: "mechanics" as const,
    icon: <Zap className="h-3.5 w-3.5" />,
    color: "#3b82f6",
    bg: "bg-blue-500/10",
    questionCount: 8,
  },
  {
    slug: "electricity" as const,
    icon: <FlaskConical className="h-3.5 w-3.5" />,
    color: "#8b5cf6",
    bg: "bg-violet-500/10",
    questionCount: 6,
  },
  {
    slug: "waves" as const,
    icon: <Waves className="h-3.5 w-3.5" />,
    color: "#10b981",
    bg: "bg-emerald-500/10",
    questionCount: 5,
  },
  {
    slug: "thermodynamics" as const,
    icon: <Thermometer className="h-3.5 w-3.5" />,
    color: "#f59e0b",
    bg: "bg-amber-500/10",
    questionCount: 5,
  },
];

const DEMO_TOP3 = [
  { rank_position: 1, username: "PhysicsGuru", mmr: 2850 },
  { rank_position: 2, username: "QuantumLeap", mmr: 2601 },
  { rank_position: 3, username: "Newton42", mmr: 2399 },
];

const WEEK_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type WeekDayKey = (typeof WEEK_DAY_KEYS)[number];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 28 },
  },
};

export default function DashboardPage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations();
  const { profile, isLoading } = useUserStore();

  const [weekBars, setWeekBars] = useState<number[]>(Array(7).fill(0));
  const [todayIndex, setTodayIndex] = useState(-1);

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun
    const adjusted = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0=Mon, 6=Sun
    setTodayIndex(adjusted);

    const todayStr = now.toISOString().split("T")[0];
    const activeToday = profile?.last_active === todayStr;
    const streak = profile?.streak ?? 0;

    const bars = Array(7)
      .fill(0)
      .map((_, i) => {
        if (i === adjusted && activeToday) return 88;
        if (streak > 0 && i < adjusted) {
          return 22 + ((streak * 7 + i * 13) % 58);
        }
        return 0;
      });
    setWeekBars(bars);
  }, [profile]);

  const rank = profile ? getRankFromMmr(profile.mmr) : null;
  const mmr = profile?.mmr ?? 1000;
  const streak = profile?.streak ?? 0;

  const stats = [
    {
      label: t("dashboard.statMmr"),
      value: mmr.toLocaleString(),
      highlight: false,
    },
    {
      label: t("dashboard.statStreak"),
      value: `${streak} ${t("dashboard.statStreakUnit")}`,
      highlight: streak > 0,
    },
    { label: t("dashboard.statAccuracy"), value: "--", highlight: false },
    { label: t("dashboard.statToday"), value: "0", highlight: false },
  ];

  return (
    <motion.div
      className="px-4 lg:px-8 py-8 space-y-5 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Card */}
      <motion.div variants={cardVariants}>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 lg:p-6 flex flex-col lg:flex-row gap-5">
          {/* Left */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium">
              <Flame className="h-3 w-3" />
              {t("dashboard.greeting")}
            </div>

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text)] flex items-center gap-2 flex-wrap">
                {isLoading ? (
                  <span className="inline-block h-8 w-40 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
                ) : (
                  <>
                    {profile?.username ?? t("profile.guestName")}
                    {rank && (
                      <span
                        className="text-xl font-medium"
                        style={{ color: rank.color }}
                      >
                        {rank.icon}
                      </span>
                    )}
                  </>
                )}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-2 max-w-lg leading-relaxed">
                {t("dashboard.subtitle")}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-5 pt-1">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    {stat.label}
                  </span>
                  <span
                    className={cn(
                      "text-xl font-bold tabular-nums leading-tight",
                      stat.highlight ? "text-orange-500" : "text-[var(--text)]",
                    )}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Daily Goal */}
          <div className="w-full lg:w-52 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex flex-col gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {t("dashboard.dailyGoal")}
              </p>
              <p className="text-2xl font-bold text-[var(--text)] mt-1">
                0{" "}
                <span className="text-sm font-normal text-[var(--text-muted)]">
                  {t("dashboard.of")} 10
                </span>
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                <div className="h-full w-0 bg-[var(--accent)] rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={`/${locale}/quiz/mechanics`}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
              >
                <span>{t("sidebar.training")}</span>
                <Zap className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/${locale}/flashcards/mechanics`}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
              >
                <span>{t("nav.flashcards")}</span>
                <BookOpen className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column grid */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        {/* Topic Progress */}
        <motion.div variants={cardVariants}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 lg:p-6 space-y-5 h-full">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {t("dashboard.topicProgress")}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {t("dashboard.covered")}
              </p>
            </div>
            <div className="space-y-4">
              {TOPICS.map((topic, i) => (
                <motion.div
                  key={topic.slug}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-md flex items-center justify-center shrink-0",
                          topic.bg,
                        )}
                        style={{ color: topic.color }}
                      >
                        {topic.icon}
                      </div>
                      <span className="text-sm font-medium text-[var(--text)] truncate">
                        {t(`topic.${topic.slug}`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-[var(--text-muted)] tabular-nums">
                        0 {t("dashboard.of")} {topic.questionCount}
                      </span>
                      <Link
                        href={`/${locale}/quiz/${topic.slug}`}
                        className="text-xs text-[var(--accent)] hover:underline underline-offset-2"
                      >
                        {t("dashboard.openBank")}
                      </Link>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: topic.color }}
                      initial={{ width: 0 }}
                      animate={{ width: "0%" }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Week Rhythm */}
          <motion.div variants={cardVariants}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  {t("dashboard.weekRhythm")}
                </p>
                <span className="text-[9px] font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full">
                  {t("dashboard.days7")}
                </span>
              </div>
              {/* Bars */}
              <div className="flex items-end gap-1.5" style={{ height: 64 }}>
                {WEEK_DAY_KEYS.map((dayKey: WeekDayKey, i) => {
                  const barPx = Math.max(3, Math.round((weekBars[i] / 100) * 56));
                  const isToday = i === todayIndex;
                  return (
                    <div
                      key={dayKey}
                      className="flex-1 flex flex-col items-center justify-end"
                      style={{ height: 64 }}
                    >
                      <motion.div
                        className={cn(
                          "w-full rounded-t-sm",
                          isToday
                            ? "bg-[var(--accent)]"
                            : weekBars[i] > 0
                              ? "bg-[var(--accent)]/30"
                              : "bg-[var(--bg-secondary)]",
                        )}
                        initial={{ height: 3 }}
                        animate={{ height: barPx }}
                        transition={{
                          delay: 0.3 + i * 0.04,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Labels */}
              <div className="flex gap-1.5 mt-1.5">
                {WEEK_DAY_KEYS.map((dayKey: WeekDayKey, i) => (
                  <span
                    key={dayKey}
                    className={cn(
                      "flex-1 text-center text-[9px] font-medium",
                      i === todayIndex
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)]",
                    )}
                  >
                    {t(`weekDays.${dayKey}`)}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mini Leaderboard */}
          <motion.div variants={cardVariants}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  {t("dashboard.leaderboardSection")}
                </p>
                <Link
                  href={`/${locale}/leaderboard`}
                  className="flex items-center gap-0.5 text-xs text-[var(--accent)] hover:underline underline-offset-2"
                >
                  {t("dashboard.allPlayers")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {DEMO_TOP3.map((entry) => {
                  const entryRank = getRankFromMmr(entry.mmr);
                  const medal =
                    entry.rank_position === 1
                      ? "🥇"
                      : entry.rank_position === 2
                        ? "🥈"
                        : "🥉";
                  return (
                    <div
                      key={entry.rank_position}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                        entry.rank_position === 1
                          ? "bg-[var(--accent)]/10 border border-[var(--accent)]/20"
                          : "bg-[var(--bg-secondary)]",
                      )}
                    >
                      <span className="text-sm leading-none select-none">
                        {medal}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] truncate">
                          {entry.username}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className="text-sm font-medium"
                          style={{ color: entryRank.color }}
                        >
                          {entryRank.icon}
                        </span>
                        <span className="text-sm font-bold text-[var(--text)] tabular-nums">
                          {entry.mmr.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
