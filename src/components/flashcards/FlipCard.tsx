"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { KatexRenderer } from "@/components/ui/KatexRenderer";
import { Button } from "@/components/ui/Button";
import type { Flashcard, FlashcardRating } from "@/types";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  card: Flashcard;
  onRate: (rating: FlashcardRating) => void;
}

export function FlipCard({ card, onRate }: FlipCardProps) {
  const t = useTranslations("flashcards");
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);

  const handleFlip = () => setFlipped((f) => !f);

  const handleRate = (rating: FlashcardRating) => {
    setRated(true);
    setTimeout(() => {
      setFlipped(false);
      setRated(false);
      onRate(rating);
    }, 200);
  };

  const topicColorMap: Record<string, string> = {
    mechanics: "accent",
    electricity: "warning",
    waves: "success",
    thermodynamics: "danger",
  };

  const ratingButtons: { rating: FlashcardRating; variant: "ghost" | "danger" | "secondary" | "primary"; label: string }[] = [
    { rating: "again", variant: "danger", label: t("rating.again") },
    { rating: "hard", variant: "secondary", label: t("rating.hard") },
    { rating: "good", variant: "primary", label: t("rating.good") },
    { rating: "easy", variant: "ghost", label: t("rating.easy") },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card */}
      <div
        className="w-full max-w-lg cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-64"
        >
          {/* Front */}
          <div
            className={cn(
              "absolute inset-0 rounded-[var(--radius-lg)] border border-[var(--border)]",
              "bg-[var(--bg-card)] flex flex-col items-center justify-center gap-4 p-8",
              "backface-hidden"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            <Badge variant={topicColorMap[card.topic] as "accent" | "warning" | "success" | "danger"} className="self-start">
              {card.topic}
            </Badge>
            <div className="flex-1 flex items-center justify-center">
              <KatexRenderer formula={card.front} display className="text-3xl" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">{t("flip")}</p>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 rounded-[var(--radius-lg)] border border-[var(--accent)]/30",
              "bg-[var(--bg-card)] flex flex-col justify-between p-6",
              "backface-hidden"
            )}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Badge variant={topicColorMap[card.topic] as "accent" | "warning" | "success" | "danger"} className="self-start">
              {card.topic}
            </Badge>

            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-[var(--text)]">{card.back}</p>
              {card.derivation && (
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-mono bg-[var(--bg-secondary)] px-3 py-2 rounded-[var(--radius)]">
                  {card.derivation}
                </p>
              )}
            </div>

            <KatexRenderer formula={card.front} className="text-lg text-[var(--text-muted)]" />
          </div>
        </motion.div>
      </div>

      {/* Rating buttons */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="flex gap-2 flex-wrap justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {ratingButtons.map(({ rating, variant, label }) => (
            <Button
              key={rating}
              variant={variant}
              size="sm"
              onClick={() => handleRate(rating)}
              disabled={rated}
            >
              {label}
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
