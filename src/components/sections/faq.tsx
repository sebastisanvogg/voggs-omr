"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Funktioniert TikTok wirklich für Performance-Kampagnen?",
    a: "Ja. TikTok ist kein reiner Reichweiten-Kanal mehr. Wir managen Accounts mit 6-stelligen Tagesbudgets und nahezu 100% Conversion Objective. Die CPMs liegen im DACH-Raum 40–60% unter Meta, und die Attention Time ist 3–5x höher als bei Feed Ads.",
  },
  {
    q: "Was genau macht der Ad Analyzer?",
    a: "Du lädst ein Bild oder Video hoch. Unsere KI (basierend auf Claude von Anthropic) bewertet dein Creative nach TikTok-spezifischen Kriterien: Hook (erste 1,5 Sek.), Pacing, Sound, Captions, CTA und Native-Feel. Du bekommst einen Confidence Score und konkrete Verbesserungsvorschläge.",
  },
  {
    q: "Was passiert mit meiner hochgeladenen Datei?",
    a: "Die Datei wird einmalig zur Analyse verwendet und nach maximal 24 Stunden automatisch gelöscht. Es findet keine dauerhafte Speicherung statt. Details findest du in unserer Datenschutzerklärung.",
  },
  {
    q: "Was kostet der Account- oder Creative-Audit?",
    a: "Nichts. Beide Audits sind kostenlos und unverbindlich. Wir analysieren dein Setup, geben dir konkrete Empfehlungen — und du entscheidest, ob du mit uns weiterarbeiten möchtest.",
  },
  {
    q: "Kann ich meine Meta-Ads einfach auf TikTok schalten?",
    a: "Davon raten wir ab. TikTok ist ein eigenes Performance-Ökosystem mit anderen Regeln. Meta-Assets \"reinzuschmeißen\" ist der häufigste Fehler. Du brauchst eine eigene Creative Strategy: natives Storytelling, UGC-Feel, Hook-Trust-CTA Framework.",
  },
  {
    q: "Ab welchem Budget lohnt sich TikTok?",
    a: "Unsere Empfehlung: Starte mit mindestens 5.000 € / Monat Ad Spend, damit du statistisch signifikante Learnings generierst. Mit unserem Testing-Matrix-Ansatz (4–8 Varianten pro Testlauf) brauchst du genug Budget pro Variante.",
  },
  {
    q: "Wie läuft die Zusammenarbeit mit VOGGSMEDIA?",
    a: "Wir sind Partner, keine klassische Agentur. Langfristig statt Quick-Fix. Typischer Ablauf: kostenloses Audit → Strategie-Call → Testing-Phase (4 Wochen) → Skalierung. Alles transparent und datengetrieben.",
  },
  {
    q: "Was war die OMR Masterclass?",
    a: "Am 5. Mai 2026 hat Sebastian Vogg (CEO, VOGGSMEDIA) auf der OMR eine Masterclass zu TikTok Ads gegeben: 'Unsere Learnings aus 6-stelligen Performance Tagesbudgets'. Diese Seite ist das Begleitmaterial dazu.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Häufige Fragen
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border rounded-xl border border-border">
          {FAQS.map((item, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium hover:bg-surface-2/50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === i ? "max-h-96 pb-4" : "max-h-0"
                )}
              >
                <p className="px-5 text-sm text-muted">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
