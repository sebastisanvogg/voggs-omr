import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-2xl font-semibold tracking-tight">
              VOGGS<span className="text-accent">MEDIA</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Performance-Agentur mit Fokus auf TikTok Ads & Paid Social.
              Kein Bullshit, sondern Impact.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Rechtliches
              </span>
              <Link href="/impressum" className="hover:text-accent transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-accent transition-colors">
                Datenschutz
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Kontakt
              </span>
              <a
                href="mailto:sebastian@voggs.net"
                className="hover:text-accent transition-colors"
              >
                sebastian@voggs.net
              </a>
              <a
                href="https://www.voggs.net"
                rel="noopener noreferrer"
                target="_blank"
                className="hover:text-accent transition-colors"
              >
                voggs.net
              </a>
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} VOGGSMEDIA. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
