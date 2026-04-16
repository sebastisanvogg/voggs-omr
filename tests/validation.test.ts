import { describe, it, expect } from "vitest";
import {
  leadInputSchema,
  analysisResultSchema,
  isAcceptedMime,
  UPLOAD_LIMITS,
} from "../src/lib/validation";

/* -------------------------------------------------------------------------- */
/*  Lead validation                                                            */
/* -------------------------------------------------------------------------- */

describe("leadInputSchema", () => {
  const validLead = {
    name: "Max Mustermann",
    email: "max@firma.de",
    company: "VOGGSMEDIA",
    interests: ["account_audit"] as const,
  };

  it("accepts a valid lead", () => {
    const result = leadInputSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = leadInputSchema.safeParse({ ...validLead, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = leadInputSchema.safeParse({
      ...validLead,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("applies default for outboundCallConsent", () => {
    const result = leadInputSchema.safeParse(validLead);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.outboundCallConsent).toBe(false);
    }
  });

  it("applies default for honeypot", () => {
    const result = leadInputSchema.safeParse(validLead);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.honeypot).toBe("");
    }
  });

  it("rejects filled honeypot (spam detection)", () => {
    const result = leadInputSchema.safeParse({
      ...validLead,
      honeypot: "i-am-a-bot",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid monthly spend", () => {
    const result = leadInputSchema.safeParse({
      ...validLead,
      monthlySpend: "20k-100k",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid monthly spend", () => {
    const result = leadInputSchema.safeParse({
      ...validLead,
      monthlySpend: "1-million",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid interest values", () => {
    const result = leadInputSchema.safeParse({
      ...validLead,
      interests: ["fake_interest"],
    });
    expect(result.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*  Analysis result validation                                                 */
/* -------------------------------------------------------------------------- */

describe("analysisResultSchema", () => {
  const validResult = {
    confidence_score: 73,
    verdict: "ready" as const,
    findings: [
      { dimension: "hook" as const, score: 80, comment: "Guter Hook, greift sofort." },
      { dimension: "pacing" as const, score: 65, comment: "Schnitt ist okay." },
      { dimension: "sound" as const, score: 70, comment: "Musik passt." },
    ],
    recommendations: [
      "Stärkeren Hook testen.",
      "CTA früher platzieren.",
      "Mehr UGC-Elemente einbauen.",
    ],
  };

  it("accepts a valid result", () => {
    const result = analysisResultSchema.safeParse(validResult);
    expect(result.success).toBe(true);
  });

  it("rejects score out of range (negative)", () => {
    const result = analysisResultSchema.safeParse({
      ...validResult,
      confidence_score: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects score out of range (>100)", () => {
    const result = analysisResultSchema.safeParse({
      ...validResult,
      confidence_score: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid verdict", () => {
    const result = analysisResultSchema.safeParse({
      ...validResult,
      verdict: "amazing",
    });
    expect(result.success).toBe(false);
  });

  it("requires at least 3 findings", () => {
    const result = analysisResultSchema.safeParse({
      ...validResult,
      findings: validResult.findings.slice(0, 2),
    });
    expect(result.success).toBe(false);
  });

  it("requires at least 3 recommendations", () => {
    const result = analysisResultSchema.safeParse({
      ...validResult,
      recommendations: validResult.recommendations.slice(0, 2),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid dimension name", () => {
    const bad = {
      ...validResult,
      findings: [
        { dimension: "magic", score: 50, comment: "Does not exist." },
        ...validResult.findings.slice(1),
      ],
    };
    const result = analysisResultSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*  Upload MIME validation                                                     */
/* -------------------------------------------------------------------------- */

describe("isAcceptedMime", () => {
  it("accepts video/mp4", () => {
    expect(isAcceptedMime("video/mp4")).toBe(true);
  });

  it("accepts image/jpeg", () => {
    expect(isAcceptedMime("image/jpeg")).toBe(true);
  });

  it("rejects application/pdf", () => {
    expect(isAcceptedMime("application/pdf")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isAcceptedMime("")).toBe(false);
  });

  it("has a reasonable max byte limit", () => {
    expect(UPLOAD_LIMITS.maxBytes).toBe(100 * 1024 * 1024);
  });
});
