import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Thermometer, FlaskConical, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { IdealGas } from "@/components/simulations/IdealGas";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ThermodynamicsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  const concepts = [
    { formula: "PV = nRT", name: "Ideal Gas Law", desc: "Pressure-volume-temperature relation" },
    { formula: "ΔU = Q - W", name: "First Law", desc: "Conservation of energy" },
    { formula: "η = 1 - T_C/T_H", name: "Carnot Efficiency", desc: "Maximum heat engine efficiency" },
    { formula: "E_k = (3/2)k_BT", name: "Kinetic Energy", desc: "Average molecular kinetic energy" },
    { formula: "Q = mcΔT", name: "Heat Transfer", desc: "Sensible heat equation" },
    { formula: "PV^γ = const", name: "Adiabatic Process", desc: "No heat exchange process" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8 space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href={`/${locale}`} className="hover:text-[var(--text)]">{t("nav.home")}</Link>
          <span>/</span>
          <span>{t("topic.thermodynamics")}</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] flex items-center gap-3">
              <Thermometer className="h-7 w-7 text-amber-500" />
              {t("topic.thermodynamics")}
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              Explore heat, temperature, entropy, and the laws governing thermal systems.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${locale}/quiz/thermodynamics`} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-[var(--radius)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
              <FlaskConical className="h-4 w-4" /> {t("nav.quiz")}
            </Link>
            <Link href={`/${locale}/flashcards/thermodynamics`} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--border)] transition-colors">
              <BookOpen className="h-4 w-4" /> {t("nav.flashcards")}
            </Link>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text)]">Key Formulas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {concepts.map((c) => (
            <Card key={c.name} className="hover:border-amber-500/40 transition-colors">
              <CardContent className="space-y-2">
                <code className="text-sm font-mono text-amber-500 bg-[var(--bg-secondary)] px-2 py-0.5 rounded">{c.formula}</code>
                <p className="font-medium text-sm text-[var(--text)]">{c.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">Interactive Simulations</h2>
        <Card>
          <CardContent>
            <IdealGas />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
