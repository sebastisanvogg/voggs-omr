"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OptInDialog } from "@/components/opt-in-dialog";
import { LinkedInFollow } from "@/components/linkedin-follow";
import { ArrowRight, Search, BarChart3, Target, CheckCircle2, Clock } from "lucide-react";

const POINTS = [
  { icon: <Search className="h-4 w-4" />, label: "Kampagnenstruktur & Setup" },
  { icon: <BarChart3 className="h-4 w-4" />, label: "Tracking & Attribution" },
  { icon: <Target className="h-4 w-4" />, label: "Targeting & Bidding" },
];

export function AuditCta() {
  const [optInOpen, setOptInOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="audit" className="scroll-mt-20 px-6 pb-16">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-accent/30 bg-surface p-8 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <Clock className="h-3 w-3" />
            Nur während OMR 2026
          </span>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-accent">
            Kostenloser Ad Account Audit
          </p>

          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Wir ersetzen kein Inhouse.<br />
            <span className="text-accent">Wir machen es besser.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Wir prüfen dein TikTok-Ad-Setup kostenlos und zeigen dir, wo
            Performance liegt.
          </p>

          <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm text-muted sm:grid-cols-3 sm:text-center">
            {POINTS.map((p) => (
              <li
                key={p.label}
                className="flex items-center gap-2 rounded-md border border-border bg-surface-2/50 px-3 py-2 sm:flex-col sm:gap-1.5"
              >
                <span className="text-accent">{p.icon}</span>
                <span className="text-xs">{p.label}</span>
              </li>
            ))}
          </ul>

          {submitted ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                Anfrage abgeschickt — wir melden uns.
              </div>
              <Button size="lg" disabled className="w-full sm:w-auto">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Audit-Anfrage verschickt
              </Button>
              <LinkedInFollow variant="post_optin" className="text-left" />
            </div>
          ) : (
            <>
              <Button
                size="lg"
                className="mt-6"
                onClick={() => setOptInOpen(true)}
              >
                Account Audit anfragen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="mt-3 text-xs text-muted-foreground">
                Kostenlos · unverbindlich · Rückmeldung innerhalb 1 Werktag
              </p>
              <p className="mt-1 text-[11px] font-medium text-accent/90">
                Nur begrenzte Slots während OMR 2026 (5.–7. Mai) verfügbar.
              </p>
            </>
          )}
        </div>
      </div>

      <OptInDialog
        open={optInOpen}
        onOpenChange={setOptInOpen}
        params={{ interest: "account_audit", source: "audit_cta" }}
        onComplete={() => setSubmitted(true)}
        defaultInterests={["account_audit"]}
      />
    </section>
  );
}
