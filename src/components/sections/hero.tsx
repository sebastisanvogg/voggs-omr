"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

const CLIENT_LOGOS = [
  { src: "/logos/carly.png", alt: "Carly", width: 120, height: 32 },
  { src: "/logos/hellofresh.png", alt: "HelloFresh", width: 120, height: 42 },
  { src: "/logos/turtle-beach.png", alt: "Turtle Beach", width: 120, height: 34 },
  { src: "/logos/true-fruits.png", alt: "true fruits", width: 110, height: 24 },
  { src: "/logos/babbel.png", alt: "Babbel", width: 100, height: 26 },
  { src: "/logos/tom-tailor.png", alt: "TOM TAILOR", width: 120, height: 15 },
  { src: "/logos/magenta.png", alt: "Magenta Telekom", width: 110, height: 30 },
  { src: "/logos/yfood.png", alt: "YFood", width: 80, height: 22 },
  { src: "/logos/urlaubsguru.png", alt: "Urlaubsguru", width: 120, height: 28 },
  { src: "/logos/westwing.png", alt: "Westwing", width: 120, height: 30 },
];

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

        {/* Client logos */}
        <div className="mt-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Vertraut von Performance-Teams bei
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-60 grayscale brightness-200">
            {CLIENT_LOGOS.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-6 w-auto object-contain sm:h-8"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
