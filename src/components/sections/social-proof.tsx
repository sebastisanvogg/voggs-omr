import Image from "next/image";
import { TrendingUp, Users, Zap } from "lucide-react";

const CASES = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    kpi: "2,3 Mio. € Ad Spend",
    image: "/testimonials/case-carly.png",
    client: "Carly Connected Car",
    description:
      "Automotive-Tech im DACH-Markt: Nahezu 100% Conversion Objective auf TikTok. Kein Awareness-Play — reine Performance-Skalierung mit 6-stelligen Tagesbudgets.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    kpi: "CPM 40–60% unter Meta",
    image: "/testimonials/case-turtle-beach.png",
    client: "Turtle Beach",
    description:
      "Global Performance Marketing mit 8–15 Sek. Attention Time vs. 1–3 Sek. bei klassischen Feed Ads. High-performing Content für den Gaming-Markt.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    kpi: "50 € CPA bei 66K Spend",
    image: "/testimonials/case-qlf.png",
    client: "Quantum Leap Fitness",
    description:
      "Ein einzelnes Creative: 66.480 € Spend, 1.000 Complete Payments, CPA 50,29 €. Kein Fatigue-Crash dank systematischem Winner-Scaling.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Sehr angenehme und effiziente Zusammenarbeit mit VOGGS und dem Team! Auch über Landesgrenzen hinweg und rein digital haben wir sehr gute Erfahrungen gemacht!",
    name: "Christian Schwarz",
    role: "Performance Marketing Manager",
    company: "Magenta Telekom",
  },
  {
    quote:
      "Wir würden Voggs GmbH als Berater und Service weiterempfehlen, weil wir mit dem Ergebnis der Zusammenarbeit sehr zufrieden sind.",
    name: "Polina Micheva",
    role: "Team Lead Performance Marketing",
    company: "YFood",
  },
  {
    quote:
      "Das gesamte Team sind absolut kompetent, gut vernetzt und immer auf dem neuesten Stand der Dinge. Absolut empfehlenswert!",
    name: "Sjard Roscher",
    role: "CEO",
    company: "Quantum Leap Fitness",
  },
  {
    quote:
      "Aus unserem Marketing nicht mehr wegzudenken!",
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
      "Super happy to be working with VOGGS for our paid media content. They have been a great partner in getting high performing content.",
    name: "Bram Colaris",
    role: "Director, Global Performance Marketing & Social Media",
    company: "Turtle Beach",
  },
  {
    quote:
      "Ich war überrascht von solch einem unglaublich agilen und intelligenten Ansatz, der mit ausgezeichneter Kundenbetreuung kombiniert wurde.",
    name: "Marina Guarino",
    role: "Group Marketing",
    company: "Generali",
  },
  {
    quote:
      "Ich kann die Zusammenarbeit mit dem gesamten VOGGS Team uneingeschränkt empfehlen. Die Zusammenarbeit ist hervorragend.",
    name: "Fadi Siouri",
    role: "CEO",
    company: "Vernasche die Welt",
  },
  {
    quote:
      "Wir haben bereits einige Projekte gemeinsam mit dem VOGGS Team vollendet und hatten jedes Mal nicht nur jede Menge Spaß.",
    name: "Jonas Nagel",
    role: "CEO",
    company: "MAINMENT",
  },
];

const CLIENT_LOGOS = [
  { src: "/logos/carly.png", alt: "Carly" },
  { src: "/logos/hellofresh.png", alt: "HelloFresh" },
  { src: "/logos/turtle-beach.png", alt: "Turtle Beach" },
  { src: "/logos/true-fruits.png", alt: "true fruits" },
  { src: "/logos/babbel.png", alt: "Babbel" },
  { src: "/logos/tom-tailor.png", alt: "TOM TAILOR" },
  { src: "/logos/magenta.png", alt: "Magenta Telekom" },
  { src: "/logos/yfood.png", alt: "YFood" },
  { src: "/logos/urlaubsguru.png", alt: "Urlaubsguru" },
  { src: "/logos/westwing.png", alt: "Westwing" },
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
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            4.93/5 Sterne bei 103 Bewertungen auf ProvenExpert.
            Hier sind ein paar der Marken, mit denen wir arbeiten.
          </p>
        </div>

        {/* Case snippets with images */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CASES.map((c) => (
            <div
              key={c.kpi}
              className="group overflow-hidden rounded-xl border border-border bg-surface/60"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.client}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-accent">
                  {c.icon}
                  <span className="text-lg font-bold">{c.kpi}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {c.client}
                </p>
                <p className="mt-2 text-sm text-muted">{c.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Client logos strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-50 grayscale brightness-200">
          {CLIENT_LOGOS.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={100}
              height={28}
              className="h-6 w-auto object-contain"
            />
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-xl border border-border bg-surface/60 p-5"
            >
              <p className="text-sm italic text-muted leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm">
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
