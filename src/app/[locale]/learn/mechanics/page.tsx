import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Zap, BookOpen, FlaskConical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { ProjectileMotion } from "@/components/simulations/ProjectileMotion";
import { Pendulum } from "@/components/simulations/Pendulum";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function MechanicsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  const concepts = [
    { formula: "F = ma", name: "Newton's 2nd Law", desc: "Net force equals mass times acceleration" },
    { formula: "E_k = ½mv²", name: "Kinetic Energy", desc: "Energy of motion" },
    { formula: "T = 2π√(L/g)", name: "Pendulum Period", desc: "Period of simple pendulum" },
    { formula: "v² = v₀² + 2aΔx", name: "Kinematics", desc: "Velocity-displacement relation" },
    { formula: "p = mv", name: "Momentum", desc: "Linear momentum" },
    { formula: "F = Gm₁m₂/r²", name: "Gravitation", desc: "Universal law of gravity" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href={`/${locale}`} className="hover:text-[var(--text)]">{t("nav.home")}</Link>
          <span>/</span>
          <span>{t("topic.mechanics")}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] flex items-center gap-3">
              <Zap className="h-7 w-7 text-blue-500" />
              {t("topic.mechanics")}
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              Study motion, forces, energy, and the fundamental laws governing physical objects.
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            <Link
              href={`/${locale}/quiz/mechanics`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-[var(--radius)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              <FlaskConical className="h-4 w-4" />
              {t("nav.quiz")}
            </Link>
            <Link
              href={`/${locale}/flashcards/mechanics`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--border)] transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              {t("nav.flashcards")}
            </Link>
          </div>
        </div>
      </div>

      {/* Key Formulas */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text)]">Key Formulas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {concepts.map((c) => (
            <Card key={c.name} className="hover:border-blue-500/40 transition-colors">
              <CardContent className="space-y-2">
                <code className="text-sm font-mono text-[var(--accent)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
                  {c.formula}
                </code>
                <p className="font-medium text-sm text-[var(--text)]">{c.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Simulations */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">Interactive Simulations</h2>
        <div className="space-y-8">
          <Card>
            <CardContent>
              <ProjectileMotion />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Pendulum />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
