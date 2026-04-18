// ─── Auth & Profile ───────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  mmr: number;
  rank: RankName;
  streak: number;
  max_streak: number;
  last_active: string | null;
  created_at: string;
}

// ─── MMR & Ranks ──────────────────────────────────────────────────────────────

export type RankName =
  | "beginner"
  | "apprentice"
  | "scholar"
  | "physicist"
  | "expert"
  | "master"
  | "grand_master"
  | "legend";

export interface RankInfo {
  name: RankName;
  label: string;
  icon: string;
  minMmr: number;
  maxMmr: number;
  color: string;
}

export interface MmrDelta {
  before: number;
  after: number;
  delta: number;
  newRank?: RankName;
  rankChanged: boolean;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export type TopicSlug = "mechanics" | "electricity" | "waves" | "thermodynamics";

export interface QuizQuestion {
  id: string;
  topic: TopicSlug;
  difficulty: number; // 500–3000
  question: string;
  questionLatex?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationLatex?: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  topic: TopicSlug;
  question_id: string;
  correct: boolean;
  mmr_before: number;
  mmr_after: number;
  mmr_delta: number;
  created_at: string;
}

export interface QuizSession {
  topic: TopicSlug;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  completed: boolean;
  totalMmrDelta: number;
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

export type FlashcardRating = "again" | "hard" | "good" | "easy";

export interface Flashcard {
  id: string;
  topic: TopicSlug;
  front: string;        // Formula (LaTeX)
  back: string;         // Name + description
  derivation?: string;  // Step-by-step derivation
  example?: string;
}

export interface FlashcardProgress {
  id: string;
  user_id: string;
  card_id: string;
  ease_factor: number;
  interval: number;
  next_review: string;
  repetitions: number;
}

// ─── Simulations ──────────────────────────────────────────────────────────────

export interface SimulationControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
}

export interface SimulationState {
  isPlaying: boolean;
  time: number;
  controls: SimulationControl[];
  info: Record<string, number | string>;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

export interface ThemeTransition {
  x: number;
  y: number;
  active: boolean;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export type Locale = "en" | "ru";

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank_position: number;
  user_id: string;
  username: string;
  avatar_url: string | null;
  mmr: number;
  rank: RankName;
  streak: number;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
