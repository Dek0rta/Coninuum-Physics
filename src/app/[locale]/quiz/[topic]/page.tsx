"use client";

import { useState, useCallback, use } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { QuizCard } from "@/components/quiz/QuizCard";
import { ResultScreen } from "@/components/quiz/ResultScreen";
import { RankUpOverlay } from "@/components/mmr/RankUpOverlay";
import { MMRDisplay } from "@/components/mmr/MMRDisplay";
import { applyMmrDelta, getRankFromMmr } from "@/lib/mmr";
import { getQuestionsByTopic } from "@/lib/quiz-data";
import { useUserStore } from "@/stores/useUserStore";
import type { TopicSlug, QuizSession, RankName } from "@/types";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; topic: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const { locale, topic } = use(params);
  const t = useTranslations();
  const { profile, updateMmr } = useUserStore();

  const questions = getQuestionsByTopic(topic);

  const createSession = useCallback((): QuizSession => ({
    topic: topic as TopicSlug,
    questions: [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(8, questions.length)),
    currentIndex: 0,
    answers: new Array(Math.min(8, questions.length)).fill(null),
    completed: false,
    totalMmrDelta: 0,
  }), [topic, questions]);

  const [session, setSession] = useState<QuizSession>(createSession);
  const [currentMmr, setCurrentMmr] = useState(profile?.mmr ?? 1000);
  const [lastDelta, setLastDelta] = useState<number | undefined>(undefined);
  const [rankUpTarget, setRankUpTarget] = useState<RankName | null>(null);

  const currentQuestion = session.questions[session.currentIndex];

  const handleAnswer = useCallback((selectedIndex: number, correct: boolean) => {
    const mmrResult = applyMmrDelta(
      currentMmr,
      session.questions[session.currentIndex].difficulty,
      correct
    );

    const newAnswers = [...session.answers];
    newAnswers[session.currentIndex] = selectedIndex;

    setLastDelta(mmrResult.delta);
    setCurrentMmr(mmrResult.after);

    if (mmrResult.rankChanged && mmrResult.newRank) {
      setTimeout(() => setRankUpTarget(mmrResult.newRank!), 1500);
    }

    if (profile) {
      updateMmr(mmrResult.after, getRankFromMmr(mmrResult.after).name);
    }

    toast(correct ? "Correct!" : "Incorrect", {
      description: `MMR ${mmrResult.delta > 0 ? "+" : ""}${mmrResult.delta}`,
      className: correct ? "border-emerald-500" : "border-red-500",
    });

    const isLast = session.currentIndex + 1 >= session.questions.length;

    setTimeout(() => {
      setSession((prev) => ({
        ...prev,
        currentIndex: isLast ? prev.currentIndex : prev.currentIndex + 1,
        answers: newAnswers,
        completed: isLast,
        totalMmrDelta: prev.totalMmrDelta + mmrResult.delta,
      }));
    }, 1500);
  }, [currentMmr, session, profile, updateMmr]);

  const handlePlayAgain = () => {
    setSession(createSession());
    setLastDelta(undefined);
  };

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-[var(--text-muted)]">No questions found for this topic.</p>
        <Link href={`/${locale}`} className="mt-4 inline-block text-[var(--accent)]">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <>
      <RankUpOverlay newRank={rankUpTarget} onDismiss={() => setRankUpTarget(null)} />

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/learn/${topic}`}
            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t(`topic.${topic}`)}
          </Link>
          <MMRDisplay mmr={currentMmr} delta={lastDelta} />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {session.completed ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ResultScreen
                session={session}
                locale={locale}
                onPlayAgain={handlePlayAgain}
              />
            </motion.div>
          ) : (
            <motion.div key={`q-${session.currentIndex}`}>
              <QuizCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                questionNumber={session.currentIndex + 1}
                total={session.questions.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
