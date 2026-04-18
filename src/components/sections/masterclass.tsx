"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OptInDialog } from "@/components/opt-in-dialog";
import { CalendarDays, Download } from "lucide-react";

export function Masterclass() {
  const [isMasterclassAttendee, setIsMasterclassAttendee] = useState(false);
  const [optInOpen, setOptInOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("src") === "omr-masterclass") {
      setIsMasterclassAttendee(true);
    }
  }, []);

  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface p-8 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative">
          <div className="flex items-center justify-center gap-2 text-accent">
            <CalendarDays className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              OMR 2026 · Masterclass
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            {isMasterclassAttendee
              ? "Du warst dabei."
              : "6-stellige Tagesbudgets — die Playbooks."}
          </h2>

          <p className="mt-3 text-muted">
            {isMasterclassAttendee
              ? "Slides + Testing-Matrix-Template zum Mitnehmen."
              : "Sebastian Vogg, VOGGSMEDIA · 5. Mai 2026, 15:00."}
          </p>

          <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm text-muted sm:grid-cols-3 sm:text-center">
            <li className="rounded-md border border-border bg-surface-2/50 px-3 py-2">Hook-Trust-CTA</li>
            <li className="rounded-md border border-border bg-surface-2/50 px-3 py-2">Testing-Matrix</li>
            <li className="rounded-md border border-border bg-surface-2/50 px-3 py-2">Intra-Day Scaling</li>
          </ul>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              disabled
              title="Bald verfügbar — Slides werden nach der Masterclass hochgeladen"
            >
              <Download className="mr-2 h-4 w-4" />
              Slides
            </Button>
            <Button onClick={() => setOptInOpen(true)}>
              Templates anfragen
            </Button>
          </div>

          {isMasterclassAttendee && (
            <p className="mt-4 text-xs text-muted-foreground">
              Als Teilnehmer:in wird deine Anfrage priorisiert.
            </p>
          )}
          </div>
        </div>
      </div>

      <OptInDialog
        open={optInOpen}
        onOpenChange={setOptInOpen}
        params={{ interest: "account_audit", source: "masterclass" }}
        defaultInterests={["account_audit", "creative_audit"]}
      />
    </section>
  );
}
