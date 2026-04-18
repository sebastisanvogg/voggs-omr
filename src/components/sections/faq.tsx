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
    q: "Was macht der Ad Analyzer?",
    a: "Du lädst eine Ad hoch. Die KI bewertet Hook, Trust und CTA — mit Confidence Score und konkreten Verbesserungsvorschlägen.",
  },
  {
    q: "Was passiert mit meiner Datei?",
    a: "Einmalige Analyse, Löschung nach max. 24 Stunden. Details in der Datenschutzerklärung.",
  },
  {
    q: "Was kosten die Audits?",
    a: "Nichts. Kostenlos und unverbindlich.",
  },
  {
    q: "Meta-Ads einfach auf TikTok schalten?",
    a: "Kein guter Plan. TikTok ist ein eigenes Performance-Ökosystem — nativ gebaute Creatives schlagen reingeschmissene Meta-Assets jedes Mal.",
  },
  {
    q: "Ab welchem Budget lohnt sich TikTok?",
    a: "Ab ca. 5.000 € / Monat, damit die Testing-Matrix (4–8 Varianten pro Run) statistisch trägt.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section id="faq" className="scroll-mt-20 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Häufige <span className="text-accent">Fragen</span>
          </h2>
        </div>

        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
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
