import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Zap, Waves, Thermometer, FlaskConical, ArrowRight, Trophy, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TOPICS = [
  {
    slug: "mechanics",
    icon: <Zap className="h-5 w-5" />,
    color: "#3b82f6",
    bg: "bg-blue-500/10",
    questionCount: 8,
    cardCount: 10,
  },
  {
    slug: "electricity",
    icon: <FlaskConical className="h-5 w-5" />,
    color: "#8b5cf6",
    bg: "bg-violet-500/10",
    questionCount: 6,
    cardCount: 10,
  },
  {
    slug: "waves",
    icon: <Waves className="h-5 w-5" />,
    color: "#10b981",
    bg: "bg-emerald-500/10",
    questionCount: 5,
    cardCount: 8,
  },
  {
    slug: "thermodynamics",
    icon: <Thermometer className="h-5 w-5" />,
    color: "#f59e0b",
    bg: "bg-amber-500/10",
    questionCount: 5,
    cardCount: 8,
  },
] as const;

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  const features = [
    {
      icon: "⬡",
      titleKey: "home.mmrRanking" as const,
      descKey: "home.mmrRankingDesc" as const,
      color: "#3b82f6",
    },
    {
      icon: "🔬",
      titleKey: "home.simulations" as const,
      descKey: "home.simulationsDesc" as const,
      color: "#10b981",
    },
    {
      icon: "🃏",
      titleKey: "home.spacedRepetition" as const,
      descKey: "home.spacedRepetitionDesc" as const,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10 space-y-16">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 pt-8">
        <Badge variant="accent" className="text-xs">
          ∮ Interactive Physics Platform
        </Badge>
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text)] leading-tight">
            {t("home.title")}
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            {t("home.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/${locale}/learn/mechanics`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            {t("home.startLearning")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/leaderboard`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius)] bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text)] text-sm font-medium hover:bg-[var(--border)] transition-colors"
          >
            <Trophy className="h-4 w-4" />
            {t("home.viewLeaderboard")}
          </Link>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-[var(--text)]">{t("home.topics")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOPICS.map((topic) => (
            <Card key={topic.slug} variant="interactive">
              <CardContent className="flex flex-col gap-4">
                <div
                  className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center ${topic.bg}`}
                  style={{ color: topic.color }}
                >
                  {topic.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">
                    {t(`topic.${topic.slug}`)}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {topic.questionCount} questions · {topic.cardCount} cards
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/${locale}/learn/${topic.slug}`}
                    className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    <Zap className="h-3 w-3" />
                    {t("home.learn")}
                  </Link>
                  <span className="text-[var(--border)]">·</span>
                  <Link
                    href={`/${locale}/quiz/${topic.slug}`}
                    className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    <FlaskConical className="h-3 w-3" />
                    {t("nav.quiz")}
                  </Link>
                  <span className="text-[var(--border)]">·</span>
                  <Link
                    href={`/${locale}/flashcards/${topic.slug}`}
                    className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    <BookOpen className="h-3 w-3" />
                    {t("nav.flashcards")}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature highlights */}
      <section className="grid sm:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.titleKey}
            className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] space-y-3 hover:border-[var(--accent)]/40 transition-colors duration-200"
          >
            <div
              className="text-3xl"
              style={{ filter: `drop-shadow(0 0 10px ${feature.color}40)` }}
            >
              {feature.icon}
            </div>
            <h3 className="font-semibold text-[var(--text)]">{t(feature.titleKey)}</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t(feature.descKey)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
