import { TrendingUp, Users, Zap } from "lucide-react";

/**
 * Social proof section — case snippets, logos, testimonials.
 * All content is PLACEHOLDER. Replace with real data before launch.
 */

const CASES = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    kpi: "2.3 Mio. € Ad Spend",
    description:
      "Automotive-Tech Brand im DACH-Markt: Nahezu 100% Conversion Objective auf TikTok. Kein Awareness-Play, reine Performance-Skalierung.",
    label: "TODO: Case #1 — Kundenname einsetzen",
  },
  {
    icon: <Users className="h-5 w-5" />,
    kpi: "CPM 40–60% unter Meta",
    description:
      "E-Commerce Brand mit 8–15 Sek. Attention Time vs. 1–3 Sek. bei Feed Ads. Kürzere Conversion-Pfade bei Gen Z & Millennials.",
    label: "TODO: Case #2 — Kundenname einsetzen",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    kpi: "50 € CPA bei 66K Spend",
    description:
      "Ein einzelnes Creative: 66.480 € Spend, 1.000 Complete Payments, CPA 50,29 €. Kein sofortiger Fatigue-Crash dank systematischem Winner-Scaling.",
    label: "TODO: Case #3 — Kundenname einsetzen",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "VOGGSMEDIA hat unsere TikTok-Performance in 3 Monaten komplett gedreht. Vorher war TikTok bei uns ein Testkanal — jetzt ist es unser stärkster Performance-Treiber.",
    name: "TODO: Name einsetzen",
    role: "TODO: Rolle & Firma",
  },
  {
    quote:
      "Das Creative Testing Framework hat bei uns sofort Wirkung gezeigt. Endlich strukturierte Learnings statt random Results.",
    name: "TODO: Name einsetzen",
    role: "TODO: Rolle & Firma",
  },
];

export function SocialProof() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Ergebnisse statt Versprechen
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Warum VOGGSMEDIA?
          </h2>
        </div>

        {/* Case snippets */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CASES.map((c) => (
            <div
              key={c.kpi}
              className="rounded-xl border border-border bg-surface/60 p-6"
            >
              <div className="flex items-center gap-2 text-accent">
                {c.icon}
                <span className="text-lg font-bold">{c.kpi}</span>
              </div>
              <p className="mt-3 text-sm text-muted">{c.description}</p>
              <p className="mt-3 text-xs text-muted-foreground italic">
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {/* Client logos strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40">
          {/* TODO: replace with real SVGs */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded bg-border/50"
              aria-label={`Client logo ${i + 1} placeholder`}
            />
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={i}
              className="rounded-xl border border-border bg-surface/60 p-6"
            >
              <p className="text-sm italic text-muted">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm">
                <span className="font-medium">{t.name}</span>
                <br />
                <span className="text-muted-foreground">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
