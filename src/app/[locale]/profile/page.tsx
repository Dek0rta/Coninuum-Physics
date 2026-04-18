"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Flame, Trophy, Target, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { RankBadge } from "@/components/mmr/RankBadge";
import { SkeletonProfileHeader, SkeletonStatGrid } from "@/components/ui/Skeleton";
import { useUserStore } from "@/stores/useUserStore";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations();
  const { profile, setProfile } = useUserStore();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data && !cancelled) {
          setProfile(data as Profile);
        }
      } catch {
        // Supabase not configured — keep demo fallback
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, [setProfile]);

  // Show skeleton while fetching
  if (isFetching) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        <SkeletonProfileHeader />
        <SkeletonStatGrid />
      </div>
    );
  }

  // Demo profile when not authenticated
  const displayProfile = profile ?? {
    id: "demo",
    username: t("profile.guestName"),
    avatar_url: null,
    mmr: 1000,
    rank: "scholar" as const,
    streak: 0,
    max_streak: 0,
    last_active: null,
    created_at: new Date().toISOString(),
  };

  const statItems = [
    {
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      key: "streak" as const,
      label: t("profile.streak"),
      color: "text-orange-500",
    },
    {
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      key: "max_streak" as const,
      label: t("profile.maxStreak"),
      color: "text-amber-500",
    },
    {
      icon: <Target className="h-5 w-5 text-blue-500" />,
      key: "mmr" as const,
      label: t("profile.mmr"),
      color: "text-blue-500",
    },
  ];

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
                // eslint-disable-next-line @next/next/no-img-element
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
                  {new Date(displayProfile.last_active).toLocaleDateString()}
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
        {statItems.map(({ icon, key, label, color }) => (
          <Card key={key}>
            <CardContent className="flex flex-col items-center gap-2 py-5">
              {icon}
              <span className={`text-2xl font-bold tabular-nums ${color}`}>
                {displayProfile[key]?.toString() ?? "0"}
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
            {t("profile.signInNotice")}
          </p>
          <div className="flex gap-2 mt-3">
            <a
              href={`/${locale}/auth/signin`}
              className="px-4 py-1.5 text-sm rounded-[var(--radius)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              {t("auth.signIn")}
            </a>
            <a
              href={`/${locale}/auth/signup`}
              className="px-4 py-1.5 text-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--border)] transition-colors"
            >
              {t("auth.signUp")}
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
