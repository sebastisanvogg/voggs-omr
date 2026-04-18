const STATS = [
  { value: "300+", label: "Kunden", accent: true },
  { value: "300 Mio. €", label: "Ad-Spend verwaltet" },
  { value: "6-stellig", label: "Tagesbudgets", accent: true },
  { value: "4,93 ★", label: "103 ProvenExpert-Reviews" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => {
          const rightBorder =
            i % 2 === 0 || i < STATS.length - 1
              ? "md:border-r md:border-border"
              : "";
          const mobileRight = i % 2 === 0 ? "border-r border-border" : "";
          const mobileBottom = i < 2 ? "border-b border-border md:border-b-0" : "";
          return (
            <div
              key={s.label}
              className={`px-4 py-7 text-center ${mobileRight} ${mobileBottom} ${rightBorder}`.trim()}
            >
              <div className="text-3xl font-black tracking-tight sm:text-4xl">
                {s.accent ? (
                  <span className="text-accent">{s.value}</span>
                ) : (
                  s.value
                )}
              </div>
              <div className="mt-1 text-xs text-muted sm:text-sm">{s.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
