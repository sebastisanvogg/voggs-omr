import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: false },
};

/**
 * STUB — replace with real Impressum copy before launch.
 * Required by §5 TMG. The real values should mirror voggs.net.
 */
export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Impressum</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p className="rounded-md border border-border bg-surface p-4 text-foreground">
          <strong>TODO:</strong> Diese Seite enthält noch kein vollständiges
          Impressum. Vor Launch mit den Daten von voggs.net abgleichen.
        </p>
        <p>
          <strong className="text-foreground">Verantwortlich i.S.d. §5 TMG:</strong>
          <br />
          Sebastian Vogg
          <br />
          VOGGSMEDIA
          <br />
          {/* TODO: vollständige Anschrift einsetzen */}
        </p>
        <p>
          <strong className="text-foreground">Kontakt:</strong>
          <br />
          E-Mail:{" "}
          <a className="underline" href="mailto:sebastian@voggs.net">
            sebastian@voggs.net
          </a>
        </p>
      </div>
    </main>
  );
}
