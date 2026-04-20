"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Zap, ShieldCheck, LogIn } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-12 pt-14 sm:pt-20"
    >
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          OMR Masterclass 2026 · Sebastian Vogg
        </span>

        <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-[56px]">
          TikTok Ads<br />
          <span className="text-accent">FUNKTIONIEREN.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Lade dein Video hoch — KI-Scoring in 30 Sekunden nach Hook · Trust · CTA.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3">
          <Button size="lg" onClick={() => scrollTo("analyzer")}>
            Video analysieren · 30 Sek.
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-accent" />
              Ergebnis in 30 Sek.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LogIn className="h-3 w-3 text-accent" />
              Kein Login
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-accent" />
              Datei-Löschung nach 24h
            </span>
          </div>

          <button
            type="button"
            onClick={() => scrollTo("audit")}
            className="mt-1 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            oder: kostenlosen Account Audit anfragen →
          </button>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            <span className="text-warning">★★★★★</span>
            <span>
              <strong className="text-foreground">4,93/5</strong> ProvenExpert
              · 300+ Kunden · 300 Mio. € Ad-Spend
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
