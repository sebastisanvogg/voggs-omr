/**
 * Brand Tokens — single source of truth for VOGGS salespage styling.
 *
 * Edit this file to re-skin the page. Tailwind reads directly from here
 * (see `tailwind.config.ts`). After editing colors, also adjust the matching
 * CSS variables in `src/app/globals.css` if you want CSS-var consumers
 * (e.g. inline styles) to follow.
 *
 * Default look: VOGGSMEDIA — deep black with warm red accent.
 */

export const brandTokens = {
  colors: {
    // Surfaces
    background: "#0A0A0B",          // page background (near-black, slight warmth)
    surface: "#141416",              // elevated cards, dialogs
    "surface-2": "#1C1C20",          // hover / tertiary
    border: "#26262C",               // hairlines, dividers
    "border-strong": "#3A3A42",      // emphasized borders, focus rings (low-contrast)

    // Foreground
    foreground: "#F5F5F7",           // primary text on dark background
    muted: "#A1A1AA",                // secondary text
    "muted-foreground": "#71717A",   // tertiary text / labels

    // Accent (the "TikTok-funktioniert" red — swap to magenta/pink in 5 min by
    // editing these three values).
    accent: "#FF3B30",               // primary red — CTAs, highlights
    "accent-hover": "#FF5A50",       // hover state
    "accent-foreground": "#FFFFFF",  // text on accent surfaces

    // Status
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",

    // Score gauge gradient stops (used by Ad Analyzer ResultCard)
    "score-low": "#EF4444",
    "score-mid": "#F59E0B",
    "score-high": "#22C55E",
  },

  radii: {
    none: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    "2xl": "28px",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.4)",
    DEFAULT: "0 4px 14px rgba(0,0,0,0.45)",
    md: "0 8px 24px rgba(0,0,0,0.5)",
    lg: "0 16px 40px rgba(0,0,0,0.55)",
    glow: "0 0 24px rgba(255,59,48,0.35)",
  },

  fonts: {
    sans: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ],
    mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
  },
} as const;

export type BrandTokens = typeof brandTokens;
