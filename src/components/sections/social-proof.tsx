import { TrendingUp, Users, Zap, Rocket } from "lucide-react";

const CASES = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    brand: "CARLY",
    handle: "Connected Car · 2025",
    tag: "Performance Skalierung",
    kpis: [
      { value: "2,37 Mio. €", label: "Ad Spend" },
      { value: "~100%", label: "Conv. Objective" },
      { value: "50 €", label: "CPA Winner" },
    ],
  },
  {
    icon: <Zap className="h-5 w-5" />,
    brand: "Winner Creative",
    handle: "66.480 € Single-Ad Spend",
    tag: "Creative Resilience",
    kpis: [
      { value: "1.000", label: "Payments" },
      { value: "8,47 €", label: "CPM" },
      { value: "76", label: "Conv. Score" },
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    brand: "Turtle Beach",
    handle: "Gaming · Global",
    tag: "Creative + Scale",
    kpis: [
      { value: "+95,3%", label: "CTR" },
      { value: "+34,8%", label: "Conv. Rate" },
      { value: "+95,5%", label: "Budget" },
    ],
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    brand: "TikTok vs. Meta",
    handle: "DACH Benchmark",
    tag: "Plattform-Vorteil",
    kpis: [
      { value: "–40–60%", label: "CPM" },
      { value: "8–15 Sek.", label: "Attention" },
      { value: "3–5×", label: "vs. Feed" },
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "Aus unserem Marketing nicht mehr wegzudenken!",
    name: "Christian Bozic",
    role: "Head of Marketing",
    company: "Carly Connected Car",
  },
  {
    quote:
      "Collaborating with VOGGSMEDIA is an absolute pleasure, and I wholeheartedly recommend them as a partner.",
    name: "Marcin Zawisza",
    role: "Agency Partnerships Manager",
    company: "TikTok",
  },
  {
    quote:
      "Super happy to be working with VOGGS for our paid media content.",
    name: "Bram Colaris",
    role: "Director, Global Performance Marketing",
    company: "Turtle Beach",
  },
  {
    quote:
      "Wir würden Voggs GmbH als Berater und Service weiterempfehlen.",
    name: "Polina Micheva",
    role: "Team Lead Performance Marketing",
    company: "YFood",
  },
];

export function SocialProof() {
  return (
    <section id="cases" className="scroll-mt-20 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
              Case Studies
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Zahlen, die <span className="text-accent">für sich sprechen</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted">
            TikTok skaliert — wenn Creative stimmt und das System sitzt.
          </p>
        </div>

        <div className="space-y-4">
          {CASES.map((c) => (
            <div
              key={c.brand}
              className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-glow md:grid-cols-[260px_1fr] md:items-center md:gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  {c.icon}
                </div>
                <div>
                  <div className="text-base font-bold">{c.brand}</div>
                  <div className="text-xs text-muted">{c.handle}</div>
                  <span className="mt-2 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                    {c.tag}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {c.kpis.map((k) => (
                  <div key={k.label} className="text-center md:text-left">
                    <div className="text-xl font-extrabold tracking-tight sm:text-2xl">
                      {k.value}
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {k.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-xl border border-border bg-surface/60 p-5"
            >
              <p className="text-sm italic leading-relaxed text-muted">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 text-xs">
                <span className="font-medium text-foreground">{t.name}</span>
                <br />
                <span className="text-muted-foreground">
                  {t.role}, {t.company}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
