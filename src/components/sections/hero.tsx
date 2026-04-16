"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Subtle gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          VOGGSMEDIA — TikTok Performance Agentur
        </p>

        <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Findest du in{" "}
          <span className="text-accent">30 Sekunden</span> raus,
          <br className="hidden sm:inline" /> ob deine Ad auf TikTok
          funktioniert
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Lade deine Ad hoch und erhalte sofort einen Confidence Score,
          Detail-Analyse und konkrete Verbesserungsvorschläge —
          kostenlos und KI-gestützt.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => scrollTo("analyzer")}
            className="text-base"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Ad jetzt analysieren
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("audits")}
          >
            Account & Creative Audit
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Client logos placeholder strip */}
        <div className="mt-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Vertraut von Performance-Teams bei
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-8 opacity-40">
            {/* TODO: replace with real client logos */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 rounded bg-border/50"
                aria-label={`Client logo ${i + 1} placeholder`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
