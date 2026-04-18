"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Trophy, RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { QuizSession } from "@/types";

interface ResultScreenProps {
  session: QuizSession;
  locale: string;
  onPlayAgain: () => void;
}

export function ResultScreen({ session, locale, onPlayAgain }: ResultScreenProps) {
  const t = useTranslations();
  const correctCount = session.answers.filter(
    (ans, i) => ans === session.questions[i].correctIndex
  ).length;
  const total = session.questions.length;
  const accuracy = Math.round((correctCount / total) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-8 py-10"
    >
      {/* Trophy */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-6xl"
        >
          <Trophy className="h-16 w-16 text-amber-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[var(--text)]">
          {t("quiz.result.title")}
        </h2>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {[
          {
            label: t("quiz.result.score"),
            value: `${correctCount}/${total}`,
            sub: `${accuracy}%`,
            color: accuracy >= 70 ? "#10b981" : accuracy >= 40 ? "#f59e0b" : "#ef4444",
          },
          {
            label: t("quiz.result.totalMmr"),
            value:
              session.totalMmrDelta >= 0
                ? `+${session.totalMmrDelta}`
                : `${session.totalMmrDelta}`,
            sub: "MMR",
            color: session.totalMmrDelta >= 0 ? "#10b981" : "#ef4444",
          },
          {
            label: "Accuracy",
            value: `${accuracy}%`,
            sub: `${total} questions`,
            color: "#3b82f6",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)]"
          >
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
            <span className="text-xs text-[var(--text-muted)]">{stat.sub}</span>
            <span className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Question review */}
      <motion.div variants={itemVariants} className="w-full max-w-md space-y-2">
        {session.questions.map((q, i) => {
          const correct = session.answers[i] === q.correctIndex;
          return (
            <div
              key={q.id}
              className="flex items-start gap-3 p-3 rounded-[var(--radius)] bg-[var(--bg-secondary)]"
            >
              <span className={correct ? "text-emerald-500" : "text-red-500"}>
                {correct ? "✓" : "✗"}
              </span>
              <p className="text-sm text-[var(--text)] flex-1 line-clamp-2">{q.question}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex gap-3 flex-wrap justify-center">
        <Button variant="primary" onClick={onPlayAgain} icon={<RotateCcw className="h-4 w-4" />}>
          {t("quiz.result.playAgain")}
        </Button>
        <Button variant="secondary" icon={<BookOpen className="h-4 w-4" />}>
          <Link href={`/${locale}/flashcards/${session.topic}`}>
            {t("nav.flashcards")}
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
