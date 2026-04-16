import { NextResponse, type NextRequest } from "next/server";
import { leadInputSchema } from "@/lib/validation";
import { insertLead } from "@/lib/supabase";
import { sendLeadEmails } from "@/lib/email";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // --- Validate ---
  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed." },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // --- Honeypot check ---
  if (data.honeypot && data.honeypot.length > 0) {
    // Spam bot filled the hidden field. Respond 200 to avoid revealing the trap.
    return NextResponse.json({ ok: true, id: "none" });
  }

  // --- Turnstile verification ---
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  const turnstile = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!turnstile.verified) {
    return NextResponse.json(
      { error: "Spam-Schutz fehlgeschlagen. Bitte Seite neu laden." },
      { status: 403 }
    );
  }

  const userAgent = req.headers.get("user-agent") ?? undefined;

  // --- Persist lead ---
  let leadId: string;
  try {
    const stored = await insertLead(data, { userAgent });
    leadId = stored.id;
  } catch (err) {
    console.error("[api/leads] Insert failed:", err);
    return NextResponse.json(
      { error: "Fehler beim Speichern. Bitte versuche es erneut." },
      { status: 500 }
    );
  }

  // --- Send emails (fire-and-forget; do not block the response) ---
  sendLeadEmails(data).catch((err) => {
    console.error("[api/leads] Email sending failed:", err);
  });

  return NextResponse.json({ ok: true, id: leadId });
}
