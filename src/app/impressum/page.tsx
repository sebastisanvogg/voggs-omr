import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Impressum</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Angaben gemäß § 5 TMG
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
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Vertreten durch
          </h2>
          <p className="mt-2">
            Geschäftsführer: Matthias Vogg & Sebastian Vogg
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Kontakt</h2>
          <p className="mt-2">
            Telefon: +49 1579 237 1241
            <br />
            E-Mail:{" "}
            <a className="text-accent underline" href="mailto:hi@voggs.net">
              hi@voggs.net
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Umsatzsteuer-ID
          </h2>
          <p className="mt-2">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a
            Umsatzsteuergesetz:
            <br />
            <strong className="text-foreground">DE328835202</strong>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            EU-Streitschlichtung
          </h2>
          <p className="mt-2">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .
            <br />
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Haftung für Inhalte
          </h2>
          <p className="mt-2">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht unter der Pflicht, übermittelte oder
            gespeicherte fremde Informationen zu überwachen oder nach
            Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
            hinweisen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Haftung für Links
          </h2>
          <p className="mt-2">
            Unser Angebot enthält Links zu externen Websites Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die
            Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Urheberrecht</h2>
          <p className="mt-2">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>
      </div>
    </main>
  );
}
