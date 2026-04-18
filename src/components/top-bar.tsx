"use client";

import { Button } from "@/components/ui/button";

const LINKS = [
  { label: "Analyzer", href: "#analyzer" },
  { label: "Cases", href: "#cases" },
  { label: "Audits", href: "#audits" },
  { label: "FAQ", href: "#faq" },
];

export function TopBar() {
  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
        <a href="#top" className="text-lg font-extrabold tracking-tight">
          VOGGS<span className="text-accent">MEDIA</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => scrollTo(l.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <Button size="sm" onClick={() => scrollTo("#analyzer")}>
          Ad prüfen
        </Button>
      </div>
    </nav>
  );
}
