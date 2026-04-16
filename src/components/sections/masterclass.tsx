"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadDialog } from "@/components/lead-dialog";
import { CalendarDays, Download } from "lucide-react";

export function Masterclass() {
  const [isMasterclassAttendee, setIsMasterclassAttendee] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("src") === "omr-masterclass") {
      setIsMasterclassAttendee(true);
    }
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-surface/60 p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-accent">
            <CalendarDays className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              OMR Masterclass 2026
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            {isMasterclassAttendee
              ? "Du warst dabei — hier sind deine Ressourcen"
              : "TikTok Ads FUNKTIONIEREN"}
          </h2>

          <p className="mt-3 text-muted">
            {isMasterclassAttendee
              ? "Slides, Testing-Matrix-Template und Bonus-Material aus der Masterclass am 5. Mai."
              : "Unsere Learnings aus 6-stelligen Performance-Tagesbudgets. Sebastian Vogg, CEO VOGGSMEDIA — OMR Masterclass, 5. Mai 2026, 15:00 Uhr."}
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {/* TODO: replace href with actual download URL once slides are uploaded */}
            <Button
              variant="outline"
              disabled
              title="Bald verfügbar — Slides werden nach der Masterclass hochgeladen"
            >
              <Download className="mr-2 h-4 w-4" />
              Slides herunterladen
            </Button>
            <Button onClick={() => setLeadOpen(true)}>
              Bonus-Material & Templates anfragen
            </Button>
          </div>

          {isMasterclassAttendee && (
            <p className="mt-4 text-xs text-muted-foreground">
              Du bist als Masterclass-Teilnehmer markiert — deine Anfrage
              wird priorisiert behandelt.
            </p>
          )}
        </div>
      </div>

      <LeadDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        defaultInterests={["account_audit", "creative_audit"]}
      />
    </section>
  );
}
