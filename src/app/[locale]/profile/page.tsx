"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Flame, Trophy, Target, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RankBadge } from "@/components/mmr/RankBadge";
import { useUserStore } from "@/stores/useUserStore";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const STAT_ITEMS = [
  { icon: <Flame className="h-5 w-5 text-orange-500" />, key: "streak", label: "Current Streak", color: "text-orange-500" },
  { icon: <Trophy className="h-5 w-5 text-amber-500" />, key: "max_streak", label: "Best Streak", color: "text-amber-500" },
  { icon: <Target className="h-5 w-5 text-blue-500" />, key: "mmr", label: "MMR", color: "text-blue-500" },
];

export default function ProfilePage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations();
  const { profile, isLoading } = useUserStore();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  // Demo profile when not authenticated
  const displayProfile = profile ?? {
    id: "demo",
    username: "Guest",
    avatar_url: null,
    mmr: 1000,
    rank: "scholar" as const,
    streak: 0,
    max_streak: 0,
    last_active: null,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" }}
      >
        <Card>
          <CardContent className="flex items-start gap-5 py-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-2xl">
              {displayProfile.avatar_url ? (
                <img
                  src={displayProfile.avatar_url}
                  alt={displayProfile.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-[var(--accent)]" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[var(--text)]">{displayProfile.username}</h1>
              {displayProfile.last_active && (
                <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-muted)]">
                  <Calendar className="h-3 w-3" />
                  Last active: {new Date(displayProfile.last_active).toLocaleDateString()}
                </div>
              )}
              <div className="mt-3">
                <RankBadge mmr={displayProfile.mmr} rankName={displayProfile.rank} size="md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {STAT_ITEMS.map(({ icon, key, label, color }) => (
          <Card key={key}>
            <CardContent className="flex flex-col items-center gap-2 py-5">
              {icon}
              <span className={`text-2xl font-bold tabular-nums ${color}`}>
                {displayProfile[key as keyof typeof displayProfile]?.toString() ?? "0"}
              </span>
              <span className="text-xs text-[var(--text-muted)] text-center">{label}</span>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Not authenticated notice */}
      {!profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-[var(--radius-lg)] border border-[var(--accent)]/30 bg-[var(--accent)]/5"
        >
          <p className="text-sm text-[var(--text-muted)]">
            Sign in to save your progress, track streaks, and climb the leaderboard.
          </p>
          <div className="flex gap-2 mt-3">
            <a
              href={`/${locale}/auth/signin`}
              className="px-4 py-1.5 text-sm rounded-[var(--radius)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Sign In
            </a>
            <a
              href={`/${locale}/auth/signup`}
              className="px-4 py-1.5 text-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--border)] transition-colors"
            >
              Sign Up
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
