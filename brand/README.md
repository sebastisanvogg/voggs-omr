# Brand

Single source of truth for the salespage's visual identity.

## How to swap the brand in 5 minutes

1. **Colors**: edit `brand/brand-tokens.ts`. The three values to know:
   - `colors.background` — page background
   - `colors.foreground` — body text
   - `colors.accent` — CTAs and highlights (the "TikTok red")
2. **CSS variables**: also adjust the matching values in
   `src/app/globals.css` (`:root` block). They mirror the TS tokens for
   any inline-style or SVG consumer.
3. **Fonts**: replace the `fonts.sans` entries. If using a hosted font
   (e.g. `next/font/google`), wire it in `src/app/layout.tsx`.
4. **Logo / favicon**: drop a new `public/favicon.ico` and (if you have one)
   `public/logo.svg`. Both are referenced from the header.

After a change, run `pnpm dev` — Tailwind picks up tokens automatically.

## Why this structure

Tailwind's `theme.extend` reads from `brand-tokens.ts`, so every utility
(`bg-background`, `text-accent`, `rounded-lg`, etc.) compiles to the right
value. Components reference the semantic name (`text-foreground`), not the
raw hex — meaning a brand change touches **one file** for the typical case.

## Asset placeholders

- `public/placeholders/client-logo-1.svg` ... `client-logo-6.svg`
- `public/placeholders/testimonial-avatar-{1,2}.svg`

These are explicitly NOT real customer logos — replace them with your own
once you have brand-approved assets.
