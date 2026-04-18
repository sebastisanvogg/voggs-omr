"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OptInDialog } from "@/components/opt-in-dialog";
import { Search, Palette, ArrowRight } from "lucide-react";
import type { Interest } from "@/lib/validation";

interface AuditCardProps {
  title: string;
  tag: string;
  items: string[];
  icon: React.ReactNode;
  interest: Interest;
  onCTA: (interest: Interest) => void;
}

function AuditCard({ title, tag, items, icon, interest, onCTA }: AuditCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-glow">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
          {icon}
        </div>
        <div>
          <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
            {tag}
          </span>
          <h3 className="mt-1 text-lg font-bold">{title}</h3>
        </div>
      </div>

      <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
        {items.map((label) => (
          <li key={label} className="flex items-center gap-2">
            <span className="text-accent">→</span>
            {label}
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        className="mt-5 w-full"
        onClick={() => onCTA(interest)}
      >
        Kostenlos anfragen
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

export function Audits() {
  const [optInOpen, setOptInOpen] = useState(false);
  const [activeInterest, setActiveInterest] = useState<Interest>("account_audit");

  const openLead = (interest: Interest) => {
    setActiveInterest(interest);
    setOptInOpen(true);
  };

  return (
    <section id="audits" className="scroll-mt-20 bg-surface/20 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
              Kostenlose Audits
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Wir schauen <span className="text-accent">drüber.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted">
            Kein Pitch. Konkrete Learnings — du entscheidest.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AuditCard
            title="Account Audit"
            tag="TikTok Account"
            icon={<Search className="h-4 w-4" />}
            interest="account_audit"
            onCTA={openLead}
            items={[
              "Kampagnenstruktur & Setup",
              "Tracking & Attribution",
              "Targeting & Bidding",
            ]}
          />
          <AuditCard
            title="Creative Audit"
            tag="TikTok Creatives"
            icon={<Palette className="h-4 w-4" />}
            interest="creative_audit"
            onCTA={openLead}
            items={[
              "Hook (erste 1,5 Sek.)",
              "Native-Feel & UGC-Score",
              "Sound & CTA",
            ]}
          />
        </div>
      </div>

      <OptInDialog
        open={optInOpen}
        onOpenChange={setOptInOpen}
        params={{ interest: activeInterest, source: "audits_section" }}
        defaultInterests={[activeInterest]}
      />
    </section>
  );
}
