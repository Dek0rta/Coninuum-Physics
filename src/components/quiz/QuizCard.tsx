"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types";
import { KatexRenderer } from "@/components/ui/KatexRenderer";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number, correct: boolean) => void;
  questionNumber: number;
  total: number;
}

export function QuizCard({ question, onAnswer, questionNumber, total }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [question.id]);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
    const correct = index === question.correctIndex;
    setTimeout(() => onAnswer(index, correct), 1200);
  };

  const getOptionAnimation = (i: number) => ({
    initial: { opacity: 0, x: -10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.06, type: "spring" as const, stiffness: 200, damping: 20 },
    },
    exit: { opacity: 0, x: 10 },
  });

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
      className="flex flex-col gap-6"
    >
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-muted)]">
          {questionNumber} / {total}
        </span>
        <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / total) * 100}%` }}
            transition={{ type: "spring", duration: 0.6 }}
          />
        </div>
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">
          Difficulty {question.difficulty}
        </span>
      </div>

      {/* Question */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)]">
        <p className="text-base text-[var(--text)] leading-relaxed">
          {question.question}
        </p>
        {question.questionLatex && (
          <div className="mt-3">
            <KatexRenderer formula={question.questionLatex} display />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-2.5">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === question.correctIndex;
          const showCorrect = revealed && isCorrect;
          const showWrong = revealed && isSelected && !isCorrect;

          const anim = getOptionAnimation(index);
          return (
            <motion.button
              key={index}
              initial={anim.initial}
              animate={anim.animate}
              exit={anim.exit}
              whileTap={!revealed ? { scale: 0.98 } : undefined}
              onClick={() => handleSelect(index)}
              className={cn(
                "relative w-full text-left px-4 py-3.5 rounded-[var(--radius)] border",
                "text-sm transition-all duration-200 cursor-pointer",
                "disabled:cursor-not-allowed",
                !revealed && "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5",
                showCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-600",
                showWrong && "border-red-500 bg-red-500/10 text-red-500",
                revealed && !isSelected && !isCorrect && "opacity-50 border-[var(--border)] bg-[var(--bg-card)]"
              )}
              disabled={revealed}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    !revealed && "border-[var(--border)] text-[var(--text-muted)]",
                    showCorrect && "border-emerald-500 bg-emerald-500 text-white",
                    showWrong && "border-red-500 bg-red-500 text-white",
                    revealed && !isSelected && !isCorrect && "border-[var(--border)] text-[var(--text-muted)]"
                  )}
                >
                  {showCorrect ? "✓" : showWrong ? "✗" : String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>

              {/* Shake animation for wrong */}
              {showWrong && (
                <motion.div
                  className="absolute inset-0 rounded-[var(--radius)]"
                  animate={{ x: [-3, 3, -3, 3, 0] }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "p-4 rounded-[var(--radius)] border text-sm",
                selected === question.correctIndex
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                  : "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400"
              )}
            >
              <p className="font-medium mb-1">
                {selected === question.correctIndex ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-[var(--text-muted)]">{question.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
