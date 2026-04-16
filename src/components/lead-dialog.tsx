"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@/components/turnstile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  leadInputSchema,
  type LeadInput,
  type LeadFormInput,
  INTEREST_VALUES,
  SPEND_VALUES,
  type Interest,
} from "@/lib/validation";
import { getTrackingParams } from "@/lib/tracking";

/* -------------------------------------------------------------------------- */
/*  Public API for opening the dialog                                          */
/* -------------------------------------------------------------------------- */

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected interests (e.g. when opened from an audit card). */
  defaultInterests?: Interest[];
  /** Score from the ad analyzer (attached as hidden field). */
  analyzerScore?: number;
  analyzerBlobUrl?: string;
}

const INTEREST_LABELS: Record<Interest, string> = {
  account_audit: "TikTok Account Audit",
  creative_audit: "Creative Audit",
  analyzer_report: "Vollständiger Audit-Report",
};

const SPEND_LABELS: Record<string, string> = {
  "<5k": "< 5.000 €",
  "5k-20k": "5.000 – 20.000 €",
  "20k-100k": "20.000 – 100.000 €",
  ">100k": "> 100.000 €",
  unknown: "Weiß ich nicht",
};

export function LeadDialog({
  open,
  onOpenChange,
  defaultInterests = [],
  analyzerScore,
  analyzerBlobUrl,
}: LeadDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput>({
    resolver: zodResolver(leadInputSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      outboundCallConsent: false,
      monthlySpend: undefined,
      interests: defaultInterests,
      notes: "",
      honeypot: "",
    },
  });

  // Pre-fill tracking params once on mount
  useEffect(() => {
    const t = getTrackingParams();
    if (t.source) setValue("source", t.source);
    if (t.utm) setValue("utm", t.utm);
    if (t.referrer) setValue("referrer", t.referrer);
  }, [setValue]);

  useEffect(() => {
    if (analyzerScore != null) setValue("analyzerScore", analyzerScore);
    if (analyzerBlobUrl) setValue("analyzerBlobUrl", analyzerBlobUrl);
  }, [analyzerScore, analyzerBlobUrl, setValue]);

  // Keep interests in sync when dialog opens with new defaults
  useEffect(() => {
    if (open && defaultInterests.length > 0) {
      setValue("interests", defaultInterests);
    }
  }, [open, defaultInterests, setValue]);

  const interests = watch("interests") ?? [];

  const toggleInterest = (value: Interest) => {
    const current = watch("interests") ?? [];
    const next = current.includes(value)
      ? current.filter((v: Interest) => v !== value)
      : [...current, value];
    setValue("interests", next);
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    const typedData = data as unknown as LeadInput;
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...typedData, turnstileToken }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as Record<string, string>).error ?? `Status ${res.status}`
        );
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Fehler beim Senden.");
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSubmitted(false);
      setServerError(null);
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-3xl font-semibold">Danke!</p>
            <p className="mt-3 text-muted">
              Wir melden uns in Kürze bei dir. Check dein Postfach für die
              Bestätigung.
            </p>
            <Button className="mt-6" onClick={() => handleClose(false)}>
              Schließen
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Kostenlose Analyse anfragen</DialogTitle>
              <DialogDescription>
                Wir schauen uns deinen TikTok Ad Account und deine Creatives
                an — unverbindlich und kostenlos.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
              noValidate
            >
              {/* Honeypot — invisible to humans */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                {...register("honeypot")}
              />

              <Field label="Name *" error={errors.name?.message}>
                <Input placeholder="Max Mustermann" {...register("name")} />
              </Field>

              <Field label="Firma" error={errors.company?.message}>
                <Input placeholder="VOGGSMEDIA GmbH" {...register("company")} />
              </Field>

              <Field label="E-Mail *" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="max@firma.de"
                  {...register("email")}
                />
              </Field>

              <Field label="Telefon (optional)" error={errors.phone?.message}>
                <Input
                  type="tel"
                  placeholder="+49 ..."
                  {...register("phone")}
                />
              </Field>

              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border accent-accent"
                  {...register("outboundCallConsent")}
                />
                <span className="text-muted">
                  Ich bin einverstanden, dass VOGGSMEDIA mich telefonisch
                  kontaktiert.
                </span>
              </label>

              <Field label="Monatliches Ad Spend" error={errors.monthlySpend?.message}>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/60"
                  defaultValue=""
                  {...register("monthlySpend")}
                >
                  <option value="" disabled>
                    Bitte auswählen
                  </option>
                  {SPEND_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {SPEND_LABELS[v]}
                    </option>
                  ))}
                </select>
              </Field>

              <fieldset>
                <legend className="mb-2 text-sm font-medium">
                  Wofür interessierst du dich?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_VALUES.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => toggleInterest(val)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors",
                        interests.includes(val)
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted hover:border-border-strong"
                      )}
                    >
                      {INTEREST_LABELS[val]}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Cloudflare Turnstile (invisible widget) */}
              <Turnstile onToken={handleTurnstileToken} />

              {serverError && (
                <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird gesendet …" : "Absenden"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Wir verwenden deine Daten ausschließlich zur Kontaktaufnahme.{" "}
                <a href="/datenschutz" className="underline">
                  Datenschutz
                </a>
                .
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tiny helper: field wrapper                                                 */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
