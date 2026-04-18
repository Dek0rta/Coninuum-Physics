import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { FlaskConical, BookOpen, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { RCCircuit } from "@/components/simulations/RCCircuit";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ElectricityPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  const concepts = [
    { formula: "V = IR", name: "Ohm's Law", desc: "Voltage equals current times resistance" },
    { formula: "P = IV", name: "Power", desc: "Electrical power" },
    { formula: "F = kq₁q₂/r²", name: "Coulomb's Law", desc: "Electrostatic force" },
    { formula: "τ = RC", name: "RC Time Constant", desc: "Charging time constant" },
    { formula: "E = ½CV²", name: "Capacitor Energy", desc: "Energy stored in capacitor" },
    { formula: "ε = -dΦ_B/dt", name: "Faraday's Law", desc: "Electromagnetic induction" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8 space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href={`/${locale}`} className="hover:text-[var(--text)]">{t("nav.home")}</Link>
          <span>/</span>
          <span>{t("topic.electricity")}</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] flex items-center gap-3">
              <Zap className="h-7 w-7 text-violet-500" />
              {t("topic.electricity")}
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              Explore electric fields, circuits, capacitors, and electromagnetic phenomena.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${locale}/quiz/electricity`} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-[var(--radius)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
              <FlaskConical className="h-4 w-4" /> {t("nav.quiz")}
            </Link>
            <Link href={`/${locale}/flashcards/electricity`} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--border)] transition-colors">
              <BookOpen className="h-4 w-4" /> {t("nav.flashcards")}
            </Link>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text)]">Key Formulas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {concepts.map((c) => (
            <Card key={c.name} className="hover:border-violet-500/40 transition-colors">
              <CardContent className="space-y-2">
                <code className="text-sm font-mono text-violet-500 bg-[var(--bg-secondary)] px-2 py-0.5 rounded">{c.formula}</code>
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
            <RCCircuit />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
