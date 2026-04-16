import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Datenschutzerklärung</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted">
        {/* 1. Überblick */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Datenschutz auf einen Blick
          </h2>
          <h3 className="mt-4 font-semibold text-foreground">
            Allgemeine Hinweise
          </h3>
          <p className="mt-2">
            Die folgenden Hinweise geben einen einfachen Überblick darüber,
            was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
            Website besuchen. Personenbezogene Daten sind alle Daten, mit
            denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        {/* 2. Verantwortlicher */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Verantwortliche Stelle
          </h2>
          <p className="mt-2">
            VOGGS GmbH
            <br />
            Ellerbachstraße 11
            <br />
            89335 Ichenhausen
            <br />
            Deutschland
          </p>
          <p className="mt-2">
            Telefon: +49 1579 237 1241
            <br />
            E-Mail:{" "}
            <a className="text-accent underline" href="mailto:hi@voggs.net">
              hi@voggs.net
            </a>
          </p>
          <p className="mt-2">
            Geschäftsführer: Matthias Vogg & Sebastian Vogg
          </p>
        </section>

        {/* 3. Hosting */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Hosting
          </h2>
          <p className="mt-2">
            Diese Website wird bei <strong className="text-foreground">Vercel Inc.</strong>{" "}
            (440 N Baxter St, Los Angeles, CA 90012, USA) gehostet. Vercel
            verarbeitet in unserem Auftrag personenbezogene Daten (u.a.
            IP-Adressen). Die Datenverarbeitung erfolgt auf Grundlage von
            Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
            zuverlässigen Hosting).
          </p>
          <p className="mt-2">
            Ein Auftragsverarbeitungsvertrag (AVV) mit Vercel wurde
            geschlossen. Die Datenübermittlung in die USA erfolgt auf
            Grundlage der EU-Standardvertragsklauseln.
          </p>
        </section>

        {/* 4. Datenerfassung auf dieser Website */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Datenerfassung auf dieser Website
          </h2>

          <h3 className="mt-4 font-semibold text-foreground">
            a) Server-Log-Dateien
          </h3>
          <p className="mt-2">
            Der Hosting-Provider erhebt automatisch folgende Daten in
            Server-Log-Dateien, die Ihr Browser automatisch übermittelt:
          </p>
          <ul className="mt-2 ml-6 list-disc space-y-1">
            <li>Browsertyp und Browserversion</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>IP-Adresse (anonymisiert für Rate-Limiting, max. 1 Stunde gespeichert)</li>
            <li>Uhrzeit der Serveranfrage</li>
          </ul>
          <p className="mt-2">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse).
          </p>

          <h3 className="mt-4 font-semibold text-foreground">
            b) Kontaktformular / Lead-Formular
          </h3>
          <p className="mt-2">
            Wenn Sie uns über das Lead-Formular auf dieser Seite
            kontaktieren, werden Ihre Angaben (Name, Firma, E-Mail, optional
            Telefon, monatliches Ad-Spend, Interessen) zur Bearbeitung der
            Anfrage gespeichert. Die Daten werden in{" "}
            <strong className="text-foreground">Supabase</strong> (Supabase
            Inc., EU-Region) gespeichert.
          </p>
          <p className="mt-2">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
            Maßnahmen) und Art. 6 Abs. 1 lit. a DSGVO (Einwilligung bei
            optionalem Telefonkontakt).
          </p>
          <p className="mt-2">
            Sie können der Speicherung jederzeit widersprechen. In diesem
            Fall kann Ihre Anfrage nicht weiter bearbeitet werden.
          </p>

          <h3 className="mt-4 font-semibold text-foreground">
            c) TikTok Ad Analyzer
          </h3>
          <p className="mt-2">
            Wenn Sie eine Datei (Bild oder Video) über den TikTok Ad
            Analyzer hochladen, wird diese einmalig zur Analyse an die{" "}
            <strong className="text-foreground">Anthropic API</strong>{" "}
            (Anthropic PBC, San Francisco, USA) übermittelt. Anthropic
            verarbeitet die Datei ausschließlich für die Analyse und speichert
            sie nicht dauerhaft (Zero Data Retention Policy für API-Nutzung).
          </p>
          <p className="mt-2">
            Die hochgeladene Datei wird serverseitig nach maximal{" "}
            <strong className="text-foreground">24 Stunden</strong>{" "}
            automatisch gelöscht. Es findet keine dauerhafte Speicherung
            Ihrer Werbemittel statt.
          </p>
          <p className="mt-2">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch
            aktiven Upload).
          </p>

          <h3 className="mt-4 font-semibold text-foreground">
            d) E-Mail-Versand
          </h3>
          <p className="mt-2">
            Bestätigungs-E-Mails werden über{" "}
            <strong className="text-foreground">Resend</strong> (Resend Inc.,
            USA) versendet. Die Datenübermittlung in die USA erfolgt auf
            Grundlage der EU-Standardvertragsklauseln.
          </p>
        </section>

        {/* 5. Cookies */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Cookies
          </h2>
          <p className="mt-2">
            Diese Website verwendet ausschließlich{" "}
            <strong className="text-foreground">technisch notwendige Cookies</strong>.
            Es werden keine Tracking-Cookies, Marketing-Cookies oder
            Cookies von Drittanbietern gesetzt.
          </p>
          <p className="mt-2">
            Der einzige Cookie speichert Ihre Consent-Entscheidung
            (localStorage, Key: <code className="text-foreground">voggs-consent-v1</code>).
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse).
          </p>
        </section>

        {/* 6. Drittanbieter */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Drittanbieter-Dienste
          </h2>

          <h3 className="mt-4 font-semibold text-foreground">
            Cloudflare Turnstile
          </h3>
          <p className="mt-2">
            Zum Schutz vor automatisierten Anfragen (Spam) nutzen wir
            Cloudflare Turnstile (Cloudflare Inc., 101 Townsend St, San
            Francisco, CA 94107, USA). Dabei kann Ihre IP-Adresse an
            Cloudflare übermittelt werden. Rechtsgrundlage: Art. 6 Abs. 1
            lit. f DSGVO (berechtigtes Interesse am Schutz vor Missbrauch).
          </p>
        </section>

        {/* 7. Rechte */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Ihre Rechte
          </h2>
          <p className="mt-2">
            Sie haben jederzeit das Recht auf:
          </p>
          <ul className="mt-2 ml-6 list-disc space-y-1">
            <li>
              <strong className="text-foreground">Auskunft</strong> über Ihre
              gespeicherten Daten (Art. 15 DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Berichtigung</strong>{" "}
              unrichtiger Daten (Art. 16 DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Löschung</strong> Ihrer
              Daten (Art. 17 DSGVO)
            </li>
            <li>
              <strong className="text-foreground">
                Einschränkung der Verarbeitung
              </strong>{" "}
              (Art. 18 DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Datenübertragbarkeit</strong>{" "}
              (Art. 20 DSGVO)
            </li>
            <li>
              <strong className="text-foreground">Widerspruch</strong> gegen
              die Verarbeitung (Art. 21 DSGVO)
            </li>
          </ul>
          <p className="mt-2">
            Richten Sie Ihre Anfrage an:{" "}
            <a className="text-accent underline" href="mailto:hi@voggs.net">
              hi@voggs.net
            </a>
          </p>
        </section>

        {/* 8. Beschwerderecht */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. Beschwerderecht bei einer Aufsichtsbehörde
          </h2>
          <p className="mt-2">
            Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer
            personenbezogenen Daten gegen die DSGVO verstößt, haben Sie das
            Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren
            (Art. 77 DSGVO). Zuständig ist die Aufsichtsbehörde des
            Bundeslandes, in dem unser Unternehmen seinen Sitz hat (Bayern).
          </p>
        </section>

        {/* 9. SSL */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. SSL- bzw. TLS-Verschlüsselung
          </h2>
          <p className="mt-2">
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
            Übertragung eine SSL- bzw. TLS-Verschlüsselung. Eine
            verschlüsselte Verbindung erkennen Sie daran, dass die
            Adresszeile des Browsers von &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt
            und an dem Schloss-Symbol.
          </p>
        </section>

        <p className="pt-4 text-xs text-muted-foreground">
          Stand: April 2026
        </p>
      </div>
    </main>
  );
}
