const ITEMS = [
  "OMR Masterclass 2026 · TikTok Ads FUNKTIONIEREN",
  "6-stellige Performance-Tagesbudgets · bewiesen",
  "Hook · Trust · CTA — das Framework aus unserer Masterclass",
];

export function MarqueeBanner() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="relative z-50 overflow-hidden bg-accent py-[10px]">
      <div className="animate-marquee flex w-max">
        {track.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 whitespace-nowrap px-10 text-[13px] font-semibold text-white"
          >
            {item}
            <span className="h-1 w-1 shrink-0 rounded-full bg-white/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
