"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadDialog } from "@/components/lead-dialog";
import {
  Search,
  Palette,
  BarChart3,
  Target,
  MonitorPlay,
  Volume2,
  FileText,
  Layers,
} from "lucide-react";
import type { Interest } from "@/lib/validation";

interface AuditCardProps {
  title: string;
  description: string;
  items: Array<{ icon: React.ReactNode; label: string }>;
  interest: Interest;
  onCTA: (interest: Interest) => void;
}

function AuditCard({ title, description, items, interest, onCTA }: AuditCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface/60 p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <ul className="mt-5 flex-1 space-y-3">
        {items.map(({ icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span className="text-accent">{icon}</span>
            {label}
          </li>
        ))}
      </ul>
      <Button
        className="mt-6 w-full"
        onClick={() => onCTA(interest)}
      >
        Kostenlos anfragen
      </Button>
    </div>
  );
}

export function Audits() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<Interest[]>([]);

  const openLead = (interest: Interest) => {
    setSelectedInterest([interest]);
    setLeadOpen(true);
  };

  return (
    <section id="audits" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Kostenlose Audits
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Wir schauen uns deinen Account an
          </h2>
          <p className="mt-3 text-muted">
            Keine Verkaufsgespräche. Wir analysieren, geben dir konkrete
            Empfehlungen — und du entscheidest.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <AuditCard
            title="TikTok Account Audit"
            description="Wir prüfen dein gesamtes TikTok-Ad-Setup und zeigen dir, wo Performance auf dem Tisch liegt."
            interest="account_audit"
            onCTA={openLead}
            items={[
              { icon: <Search className="h-4 w-4" />, label: "Kampagnenstruktur & Setup" },
              { icon: <BarChart3 className="h-4 w-4" />, label: "Tracking & Attribution" },
              { icon: <Target className="h-4 w-4" />, label: "Targeting & Audiences" },
              { icon: <Layers className="h-4 w-4" />, label: "Bidding & Budget-Strategie" },
            ]}
          />
          <AuditCard
            title="Creative Audit"
            description="Wir bewerten deine bestehenden Creatives auf TikTok-Tauglichkeit und geben dir ein klares Scoring."
            interest="creative_audit"
            onCTA={openLead}
            items={[
              { icon: <MonitorPlay className="h-4 w-4" />, label: "Hook-Analyse (erste 1,5 Sek.)" },
              { icon: <Palette className="h-4 w-4" />, label: "Native-Feel & UGC-Score" },
              { icon: <Volume2 className="h-4 w-4" />, label: "Sound-Strategie" },
              { icon: <FileText className="h-4 w-4" />, label: "Format-Mix & Varianten" },
            ]}
          />
        </div>
      </div>

      <LeadDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        defaultInterests={selectedInterest}
      />
    </section>
  );
}
