import type { RankInfo, RankName, MmrDelta } from "@/types";

const K = 32;

export function calculateMmrDelta(
  currentMmr: number,
  questionDifficulty: number,
  correct: boolean
): number {
  const expected = 1 / (1 + Math.pow(10, (questionDifficulty - currentMmr) / 400));
  const score = correct ? 1 : 0;
  return Math.round(K * (score - expected));
}

export const RANKS: RankInfo[] = [
  {
    name: "beginner",
    label: "Beginner",
    icon: "○",
    minMmr: 0,
    maxMmr: 499,
    color: "#6b7280",
  },
  {
    name: "apprentice",
    label: "Apprentice",
    icon: "◐",
    minMmr: 500,
    maxMmr: 999,
    color: "#10b981",
  },
  {
    name: "scholar",
    label: "Scholar",
    icon: "●",
    minMmr: 1000,
    maxMmr: 1499,
    color: "#3b82f6",
  },
  {
    name: "physicist",
    label: "Physicist",
    icon: "⬡",
    minMmr: 1500,
    maxMmr: 1999,
    color: "#8b5cf6",
  },
  {
    name: "expert",
    label: "Expert",
    icon: "★",
    minMmr: 2000,
    maxMmr: 2499,
    color: "#f59e0b",
  },
  {
    name: "master",
    label: "Master",
    icon: "◆",
    minMmr: 2500,
    maxMmr: 2999,
    color: "#ef4444",
  },
  {
    name: "grand_master",
    label: "Grand Master",
    icon: "❋",
    minMmr: 3000,
    maxMmr: 3499,
    color: "#ec4899",
  },
  {
    name: "legend",
    label: "Legend",
    icon: "✦",
    minMmr: 3500,
    maxMmr: Infinity,
    color: "#f97316",
  },
];

export function getRankFromMmr(mmr: number): RankInfo {
  return (
    RANKS.slice()
      .reverse()
      .find((r) => mmr >= r.minMmr) ?? RANKS[0]
  );
}

export function applyMmrDelta(
  currentMmr: number,
  questionDifficulty: number,
  correct: boolean
): MmrDelta {
  const delta = calculateMmrDelta(currentMmr, questionDifficulty, correct);
  const newMmr = Math.max(0, currentMmr + delta);
  const oldRank = getRankFromMmr(currentMmr);
  const newRank = getRankFromMmr(newMmr);
  const rankChanged = oldRank.name !== newRank.name;

  return {
    before: currentMmr,
    after: newMmr,
    delta,
    newRank: rankChanged ? newRank.name : undefined,
    rankChanged,
  };
}

export function getRankProgress(mmr: number): {
  rank: RankInfo;
  nextRank: RankInfo | null;
  progress: number; // 0-100
} {
  const rank = getRankFromMmr(mmr);
  const rankIndex = RANKS.findIndex((r) => r.name === rank.name);
  const nextRank = rankIndex < RANKS.length - 1 ? RANKS[rankIndex + 1] : null;

  if (!nextRank || rank.maxMmr === Infinity) {
    return { rank, nextRank: null, progress: 100 };
  }

  const rangeSize = rank.maxMmr - rank.minMmr + 1;
  const progressInRange = mmr - rank.minMmr;
  const progress = Math.round((progressInRange / rangeSize) * 100);

  return { rank, nextRank, progress };
}

export function getRankName(name: RankName): RankInfo {
  return RANKS.find((r) => r.name === name) ?? RANKS[0];
}
