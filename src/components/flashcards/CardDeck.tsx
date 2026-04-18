"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { FlipCard } from "./FlipCard";
import type { Flashcard, FlashcardRating } from "@/types";

async function saveProgress(cardId: string, rating: FlashcardRating): Promise<void> {
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: cardId, rating }),
    });
  } catch {
    // silently ignore network errors
  }
}

interface CardDeckProps {
  cards: Flashcard[];
  onComplete?: () => void;
}

// SM-2 algorithm
function calculateNextInterval(
  currentInterval: number,
  easeFactor: number,
  rating: FlashcardRating
): { interval: number; easeFactor: number } {
  const qualityMap: Record<FlashcardRating, number> = {
    again: 0,
    hard: 2,
    good: 4,
    easy: 5,
  };
  const q = qualityMap[rating];

  const newEf = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  let newInterval: number;
  if (q < 3) {
    newInterval = 1;
  } else if (currentInterval === 0) {
    newInterval = 1;
  } else if (currentInterval === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(currentInterval * newEf);
  }

  return { interval: newInterval, easeFactor: newEf };
}

export function CardDeck({ cards, onComplete }: CardDeckProps) {
  const t = useTranslations("flashcards");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState<FlashcardRating[]>([]);

  const currentCard = cards[currentIndex];

  const handleRate = (rating: FlashcardRating) => {
    setHistory((h) => [...h, rating]);
    // Fire-and-forget: silently ignores 401 (not authenticated) and network errors
    void saveProgress(currentCard.id, rating);

    if (currentIndex + 1 >= cards.length) {
      setCompleted(true);
      onComplete?.();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (completed) {
    const goodCount = history.filter((r) => r === "good" || r === "easy").length;
    const accuracy = Math.round((goodCount / cards.length) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-12"
      >
        <div className="text-5xl">🎉</div>
        <h3 className="text-xl font-semibold text-[var(--text)]">{t("completed")}</h3>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-500">{goodCount}</p>
            <p className="text-sm text-[var(--text-muted)]">{t("rating.good")}/{t("rating.easy")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--accent)]">{accuracy}%</p>
            <p className="text-sm text-[var(--text-muted)]">{t("accuracy")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--text)]">{cards.length}</p>
            <p className="text-sm text-[var(--text-muted)]">{t("total")}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setCompleted(false);
            setHistory([]);
          }}
          className="px-5 py-2 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          {t("studyAgain")}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-muted)]">
          {currentIndex + 1} / {cards.length}
        </span>
        <div className="flex-1 flex gap-0.5">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-1.5 rounded-full"
              animate={{
                backgroundColor:
                  i < currentIndex
                    ? "#10b981"
                    : i === currentIndex
                    ? "var(--accent)"
                    : "var(--border)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
        >
          <FlipCard card={currentCard} onRate={handleRate} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
