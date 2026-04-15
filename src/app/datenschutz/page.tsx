import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: false },
};

/**
 * STUB — replace with real GDPR-compliant copy before launch.
 * VOGGSMEDIA's Datenschutzerklärung from voggs.net should be referenced or
 * mirrored here. Nothing on this page is a substitute for legal review.
 */
export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Datenschutz</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p className="rounded-md border border-border bg-surface p-4 text-foreground">
          <strong>TODO:</strong> Diese Seite enthält noch keine
          rechtsverbindliche Datenschutzerklärung. Bitte vor Launch durch
          finale Fassung von voggs.net oder durch Anwalt geprüfte Fassung
          ersetzen.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-foreground">
          Was wir verarbeiten (Stand der Implementierung)
        </h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>Lead-Formular:</strong> Name, Firma, E-Mail, optional
            Telefon, Spend-Bereich, Interessen. Speicherung in Supabase
            (EU-Region empfohlen). Versand einer Bestätigungs-E-Mail über
            Resend.
          </li>
          <li>
            <strong>Ad Analyzer:</strong> Hochgeladene Datei wird einmalig
            zur Analyse an die Anthropic API (USA, Standard Contractual
            Clauses) übermittelt und nach 24 Stunden serverseitig gelöscht.
          </li>
          <li>
            <strong>Tracking:</strong> Es findet kein Drittanbieter-Tracking
            statt. Server-seitige Logs enthalten IP-Adressen für
            Rate-Limiting (Aufbewahrung max. 1 Stunde).
          </li>
        </ul>
      </div>
    </main>
  );
}
