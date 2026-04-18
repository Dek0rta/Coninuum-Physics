import { getTranslations } from "next-intl/server";
import { Trophy, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getRankFromMmr, getRankName } from "@/lib/mmr";
import type { LeaderboardEntry } from "@/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Demo leaderboard data — in production this would come from Supabase
const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { rank_position: 1, user_id: "1", username: "PhysicsGuru", avatar_url: null, mmr: 2850, rank: "master", streak: 42 },
  { rank_position: 2, user_id: "2", username: "QuantumLeap", avatar_url: null, mmr: 2601, rank: "master", streak: 18 },
  { rank_position: 3, user_id: "3", username: "Newton42", avatar_url: null, mmr: 2399, rank: "expert", streak: 27 },
  { rank_position: 4, user_id: "4", username: "EinsteinFan", avatar_url: null, mmr: 2104, rank: "expert", streak: 7 },
  { rank_position: 5, user_id: "5", username: "WaveRider", avatar_url: null, mmr: 1847, rank: "physicist", streak: 14 },
  { rank_position: 6, user_id: "6", username: "ThermoDyn", avatar_url: null, mmr: 1652, rank: "physicist", streak: 3 },
  { rank_position: 7, user_id: "7", username: "CircuitHero", avatar_url: null, mmr: 1441, rank: "scholar", streak: 9 },
  { rank_position: 8, user_id: "8", username: "VectorField", avatar_url: null, mmr: 1234, rank: "scholar", streak: 5 },
  { rank_position: 9, user_id: "9", username: "AtomSmasher", avatar_url: null, mmr: 987, rank: "apprentice", streak: 2 },
  { rank_position: 10, user_id: "10", username: "GravityWell", avatar_url: null, mmr: 756, rank: "apprentice", streak: 1 },
];

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default async function LeaderboardPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Trophy className="h-7 w-7 text-amber-500" />
        <h1 className="text-3xl font-bold text-[var(--text)]">{t("leaderboard.title")}</h1>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {[DEMO_LEADERBOARD[1], DEMO_LEADERBOARD[0], DEMO_LEADERBOARD[2]].map((entry, i) => {
          const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
          const rank = getRankFromMmr(entry.mmr);
          return (
            <div
              key={entry.user_id}
              className={`flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] border ${
                pos === 1
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-[var(--border)] bg-[var(--bg-card)]"
              } ${pos === 1 ? "order-2" : pos === 2 ? "order-1" : "order-3"}`}
            >
              <span className="text-2xl">{MEDAL[pos]}</span>
              <span className="font-semibold text-sm text-[var(--text)] text-center">{entry.username}</span>
              <span className="text-xs font-medium" style={{ color: rank.color }}>
                {rank.icon} {entry.mmr.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <div className="divide-y divide-[var(--border)]">
          {DEMO_LEADERBOARD.map((entry) => {
            const rank = getRankFromMmr(entry.mmr);
            return (
              <div
                key={entry.user_id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                {/* Position */}
                <span className="w-8 text-center text-sm font-medium text-[var(--text-muted)]">
                  {MEDAL[entry.rank_position] ?? `#${entry.rank_position}`}
                </span>

                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-sm font-medium text-[var(--text)]">
                  {entry.username[0].toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text)]">{entry.username}</p>
                  <p className="text-xs" style={{ color: rank.color }}>
                    {rank.icon} {rank.label}
                  </p>
                </div>

                {/* MMR */}
                <span className="text-sm font-bold tabular-nums text-[var(--text)]">
                  {entry.mmr.toLocaleString()}
                </span>

                {/* Streak */}
                {entry.streak > 0 && (
                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{entry.streak}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
