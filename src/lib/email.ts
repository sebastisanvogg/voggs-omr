import "server-only";

import type { LeadInput } from "@/lib/validation";

/**
 * Email stub — sends a lead notification and confirmation.
 *
 * When `RESEND_API_KEY` is set, sends via Resend.
 * Otherwise, logs to the console (dev experience).
 *
 * The confirmation email to the lead is intentionally plain text.
 * TODO: if you want a branded HTML template, add one here.
 */

interface EmailResult {
  notificationSent: boolean;
  confirmationSent: boolean;
  error?: string;
}

export async function sendLeadEmails(lead: LeadInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_TO ?? "sales@voggs.net";
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "no-reply@voggs.net";

  if (!apiKey) {
    console.log("[email-stub] Would send notification to:", to);
    console.log("[email-stub] Lead data:", JSON.stringify(lead, null, 2));
    console.log("[email-stub] Would send confirmation to:", lead.email);
    return { notificationSent: false, confirmationSent: false };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const result: EmailResult = {
    notificationSent: false,
    confirmationSent: false,
  };

  // 1. Internal notification
  try {
    await resend.emails.send({
      from,
      to,
      subject: `Neuer Lead: ${lead.name} (${lead.company ?? "kein Unternehmen"})`,
      text: buildInternalText(lead),
    });
    result.notificationSent = true;
  } catch (err) {
    result.error = String(err);
  }

  // 2. Confirmation to lead
  try {
    await resend.emails.send({
      from,
      to: lead.email,
      subject: "Danke für dein Interesse – VOGGSMEDIA",
      text: buildConfirmationText(lead),
    });
    result.confirmationSent = true;
  } catch (err) {
    result.error = (result.error ? result.error + " | " : "") + String(err);
  }

  return result;
}

function buildInternalText(l: LeadInput): string {
  return [
    `Name: ${l.name}`,
    `Firma: ${l.company ?? "–"}`,
    `E-Mail: ${l.email}`,
    `Telefon: ${l.phone ?? "–"}`,
    `Outbound-Call-Consent: ${l.outboundCallConsent ? "Ja" : "Nein"}`,
    `Monatl. Spend: ${l.monthlySpend ?? "–"}`,
    `Interessen: ${l.interests.join(", ") || "–"}`,
    `Source: ${l.source ?? "–"}`,
    l.analyzerScore != null ? `Analyzer Score: ${l.analyzerScore}` : null,
    `UTM: ${l.utm ? JSON.stringify(l.utm) : "–"}`,
    l.notes ? `Notizen: ${l.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildConfirmationText(l: LeadInput): string {
  return `Hallo ${l.name},

danke, dass du dich bei VOGGSMEDIA gemeldet hast!

Wir melden uns in Kürze bei dir. In der Zwischenzeit findest du mehr Infos
auf voggs.net.

Viele Grüße,
Sebastian & das VOGGSMEDIA Team`;
}
