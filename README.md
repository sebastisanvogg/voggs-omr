# OMR Salespage — VOGGSMEDIA

Next.js 14 single-page salespage for the **OMR Masterclass on 2026-05-05**.
The hero feature is the **TikTok Ad Analyzer**: upload a creative, get a
confidence score and structured findings powered by Claude.

## Quick Start

```bash
pnpm install
cp .env.example .env.local      # defaults to mock mode — no API keys needed
pnpm dev                         # → http://localhost:3000
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                 # composes all sections
│   ├── layout.tsx               # root layout + consent banner + footer
│   ├── api/
│   │   ├── analyze-ad/route.ts  # POST: upload → analysis (mock or live)
│   │   ├── leads/route.ts       # POST: lead form → Supabase + email
│   │   └── cleanup/route.ts     # POST: delete uploads >24h (cron)
│   ├── datenschutz/page.tsx     # legal stub
│   └── impressum/page.tsx       # legal stub
│
├── components/
│   ├── sections/                # hero, ad-analyzer, audits, social-proof,
│   │                            # masterclass, faq, footer
│   ├── analyzer/                # upload-box, progress-steps, result-card
│   ├── lead-dialog.tsx          # one form for all CTAs
│   ├── consent-banner.tsx       # cookie-consent STUB
│   ├── reveal.tsx               # Framer Motion scroll reveal
│   └── ui/                      # button, input, dialog
│
├── lib/
│   ├── ad-analyzer-prompt.ts    # Claude system prompt + tool schema
│   ├── analyzer.ts              # mock + live (Anthropic Vision + Tool Use)
│   ├── validation.ts            # Zod schemas for leads, analysis, uploads
│   ├── supabase.ts              # Supabase client + local NDJSON fallback
│   ├── storage.ts               # Vercel Blob / local file storage
│   ├── video-frames.ts          # ffmpeg frame extraction from videos
│   ├── rate-limit.ts            # Upstash Redis / in-memory fallback
│   ├── email.ts                 # Resend / console stub
│   ├── tracking.ts              # UTM / source param extraction
│   └── utils.ts                 # cn() helper
│
brand/
├── brand-tokens.ts              # colors, radii, shadows, fonts — Tailwind reads this
└── README.md                    # "How to swap brand in 5 min"

supabase/
└── schema.sql                   # leads table DDL (apply to your Supabase project)

tests/
├── validation.test.ts           # 21 tests (lead + analysis + upload schemas)
├── rate-limit.test.ts           # 6 tests (in-memory rate limiter)
└── analyzer-schema.test.ts      # 23 tests (mock conformance + score boundaries)
```

## Environment Variables

All external services are **optional**. The app runs fully in mock mode
with zero API keys:

| Variable | Required? | What it does |
|---|---|---|
| `ANALYZER_MODE` | No (default: `mock`) | `mock` = dummy scores. `live` = Claude API. |
| `ANTHROPIC_API_KEY` | Only for `live` | Anthropic API key for Claude Vision analysis. |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL. Without it, leads write to `.data/leads.ndjson`. |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key (server-side only). |
| `RESEND_API_KEY` | No | Resend API key. Without it, emails are console-logged. |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token. Without it, uploads go to `.data/uploads/`. |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL. Without it, rate limit is in-memory (dev only). |
| `CLEANUP_CRON_SECRET` | No | Auth secret for `/api/cleanup` POST endpoint. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile (stub — not wired). |

See `.env.example` for the full list with comments.

## Deploy to Vercel (on `omr.voggs.net`)

1. Push this repo to GitHub.
2. Create a new Vercel project → import → select this repo.
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SITE_URL=https://omr.voggs.net`
   - `ANALYZER_MODE=live`
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - `RESEND_API_KEY=re_...`
   - `BLOB_READ_WRITE_TOKEN=...`
   - `NEXT_PUBLIC_PERSPECTIVE_REPORT_URL=https://vm-media.perspectivefunnel.com/voggs/page_iquhkx`
   - `NEXT_PUBLIC_PERSPECTIVE_AUDIT_URL=https://vm-media.perspectivefunnel.com/voggs/page_b2gdvt/`
   - `NEXT_PUBLIC_PERSPECTIVE_FUNNEL_URL=https://vm-media.perspectivefunnel.com/voggs/page_b2gdvt/`
   - (optional) `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
   - `CLEANUP_CRON_SECRET=<random-long-string>`
4. `vercel.json` already wires a Cron Job at `/api/cleanup` hourly — no UI
   setup needed.
5. Apply `supabase/schema.sql` to your Supabase project.
6. Custom domain: Vercel → Project → Settings → Domains → add
   `omr.voggs.net`. Vercel shows a CNAME target; add that as a DNS record
   (see "DNS on Cloudflare" below).
7. Deploy. Done.

## DNS on Cloudflare (for `omr.voggs.net`)

Assuming `voggs.net` is on Cloudflare:

1. Cloudflare dashboard → `voggs.net` zone → **DNS → Records** → Add record
   - Type: `CNAME`
   - Name: `omr`
   - Target: `cname.vercel-dns.com` (Vercel shows the exact target in the
     Domains panel)
   - Proxy status: **DNS only** (orange cloud OFF — Vercel issues its own
     SSL certificate, and the orange cloud interferes with Vercel's
     domain-verification flow)
   - TTL: Auto
2. Wait ~1–5 min for propagation. Vercel marks the domain as "Valid
   Configuration".
3. Test: `https://omr.voggs.net` → the OMR salespage.

## Framer redirect `voggs.net/omr` → `omr.voggs.net`

In your Framer project for `voggs.net`:

- Settings → **Redirects** → new rule:
  - From: `/omr`
  - To: `https://omr.voggs.net`
  - Type: `301 (Permanent)`

QR codes can now point at `voggs.net/omr` — visitors land on the Vercel app.

## How to Swap Brand

See [`brand/README.md`](brand/README.md). The short version:

1. Edit `brand/brand-tokens.ts` (colors, fonts, radii).
2. Mirror changes in `src/app/globals.css` `:root` block.
3. Drop new `public/favicon.ico` and `public/logo.svg`.
4. `pnpm dev` — changes are instant.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm lint` | ESLint (next/core-web-vitals) |
| `pnpm test` | Vitest (50 unit tests) |

## Key Design Decisions

- **Mock-first**: `ANALYZER_MODE=mock` (default) returns realistic dummy
  data, so the full UX works without any API keys. Live mode is opt-in.
- **No Supabase required for dev**: leads fall back to `.data/leads.ndjson`
  (gitignored). Same for blob storage → `.data/uploads/`.
- **Rate limit**: 5 analyses per IP per hour. In-memory for dev, Upstash
  Redis for production.
- **Anthropic Tool Use**: the live analyzer forces a `tiktok_ad_analysis`
  tool call so Claude always returns structured JSON matching the Zod
  schema. Belt-and-suspenders validation on the output.
- **Video handling**: ffmpeg-static extracts 2–6 keyframes, sends them as
  multi-image to Claude Vision. Max 60s processing time on Vercel.
- **German copy**: all user-facing text is in German (matching the OMR
  Masterclass audience).

## What I'd Improve Next

- [ ] Replace client-logo placeholders with real brand-approved SVGs
- [ ] Replace testimonials with real quotes (after customer approval)
- [ ] Wire Cloudflare Turnstile for form spam protection
- [ ] Add a real Cookie Consent Manager (Cookiebot / Usercentrics) before
      adding any tracking pixels
- [ ] Upload Masterclass slides PDF and enable the download button
- [ ] Add real Datenschutz / Impressum copy (legal review)
- [ ] Consider streaming the analysis result for perceived speed
- [ ] A/B test the Hero headline
- [ ] Wire the planned German AI phone agent for outbound follow-up
      (the lead schema already has `phone` + `outbound_call_consent`)
