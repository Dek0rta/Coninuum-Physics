import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CardDeck } from "@/components/flashcards/CardDeck";
import { getFlashcardsByTopic } from "@/lib/flashcard-data";

interface PageProps {
  params: Promise<{ locale: string; topic: string }>;
}

export default async function FlashcardsPage({ params }: PageProps) {
  const { locale, topic } = await params;
  const t = await getTranslations();
  const cards = getFlashcardsByTopic(topic);

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-[var(--text-muted)]">No flashcards for this topic yet.</p>
        <Link href={`/${locale}`} className="mt-4 inline-block text-[var(--accent)]">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/learn/${topic}`}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t(`topic.${topic as "mechanics" | "electricity" | "waves" | "thermodynamics"}`)}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">{cards.length} cards</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">
          {t("flashcards.title")} — {t(`topic.${topic as "mechanics" | "electricity" | "waves" | "thermodynamics"}`)}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Tap cards to flip. Rate them to track your progress.
        </p>
      </div>

      <CardDeck cards={cards} />
    </div>
  );
}
