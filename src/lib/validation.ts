import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Lead form                                                                 */
/* -------------------------------------------------------------------------- */

export const INTEREST_VALUES = [
  "account_audit",
  "creative_audit",
  "analyzer_report",
] as const;
export type Interest = (typeof INTEREST_VALUES)[number];

export const SPEND_VALUES = [
  "<5k",
  "5k-20k",
  "20k-100k",
  ">100k",
  "unknown",
] as const;
export type Spend = (typeof SPEND_VALUES)[number];

export const utmSchema = z
  .object({
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(120).optional(),
    term: z.string().max(120).optional(),
    content: z.string().max(120).optional(),
  })
  .partial();

export const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Bitte vollständigen Namen angeben.").max(120),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("Bitte gültige E-Mail-Adresse angeben."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  outboundCallConsent: z.boolean().default(false),
  monthlySpend: z.enum(SPEND_VALUES).optional(),
  interests: z.array(z.enum(INTEREST_VALUES)).max(3).default([]),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),

  // Attribution (filled client-side from URL + referrer)
  source: z.string().max(80).optional(),
  utm: utmSchema.optional(),
  referrer: z.string().max(500).optional(),

  // Optional analyzer artifact
  analyzerScore: z.number().int().min(0).max(100).optional(),
  analyzerBlobUrl: z.string().url().max(2048).optional(),

  // Anti-spam: must be empty string (honeypot field).
  honeypot: z
    .string()
    .max(0, "Spam suspected.")
    .optional()
    .default(""),
  // Cloudflare Turnstile token (verified server-side; ignored if no key set).
  turnstileToken: z.string().max(2048).optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
export type LeadFormInput = z.input<typeof leadInputSchema>;

/* -------------------------------------------------------------------------- */
/*  Ad Analyzer result                                                        */
/* -------------------------------------------------------------------------- */

export const FINDING_DIMENSIONS = [
  "hook",
  "pacing",
  "sound",
  "captions",
  "cta",
  "native_feel",
] as const;
export type FindingDimension = (typeof FINDING_DIMENSIONS)[number];

export const VERDICTS = ["ready", "needs-work", "not-tiktok"] as const;
export type Verdict = (typeof VERDICTS)[number];

export const findingSchema = z.object({
  dimension: z.enum(FINDING_DIMENSIONS),
  score: z.number().int().min(0).max(100),
  comment: z.string().min(4).max(280),
});

export const analysisResultSchema = z.object({
  confidence_score: z.number().int().min(0).max(100),
  verdict: z.enum(VERDICTS),
  findings: z.array(findingSchema).min(3).max(6),
  recommendations: z.array(z.string().min(4).max(280)).min(3).max(5),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type Finding = z.infer<typeof findingSchema>;

/* -------------------------------------------------------------------------- */
/*  Upload validation                                                         */
/* -------------------------------------------------------------------------- */

export const UPLOAD_LIMITS = {
  maxBytes: 100 * 1024 * 1024, // 100 MB
  acceptedMime: [
    "video/mp4",
    "video/quicktime",
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const,
} as const;

export type AcceptedMime = (typeof UPLOAD_LIMITS.acceptedMime)[number];

export function isAcceptedMime(value: string): value is AcceptedMime {
  return (UPLOAD_LIMITS.acceptedMime as readonly string[]).includes(value);
}
