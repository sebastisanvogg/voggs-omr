import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { LeadInput } from "@/lib/validation";

/**
 * Lead persistence layer with two backends:
 *
 *   1. **Supabase** — used when both `NEXT_PUBLIC_SUPABASE_URL` and
 *      `SUPABASE_SERVICE_ROLE_KEY` are present. Inserts via service role
 *      (server-side only); the anon key never sees this table.
 *
 *   2. **Local NDJSON** — used otherwise. Appends one JSON line per lead
 *      to `./.data/leads.ndjson`. The `.data/` directory is gitignored.
 *      Intended for local development; do NOT use in production.
 *
 * Both backends return the same `StoredLead` shape.
 */

export interface StoredLead {
  id: string;
  created_at: string;
  data: LeadInput & { user_agent?: string };
}

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return getClient() !== null;
}

function toRow(input: LeadInput, userAgent?: string) {
  return {
    name: input.name,
    company: input.company || null,
    email: input.email,
    phone: input.phone || null,
    outbound_call_consent: input.outboundCallConsent,
    monthly_spend: input.monthlySpend ?? null,
    interests: input.interests ?? [],
    notes: input.notes || null,
    source: input.source ?? null,
    utm_source: input.utm?.source ?? null,
    utm_medium: input.utm?.medium ?? null,
    utm_campaign: input.utm?.campaign ?? null,
    utm_term: input.utm?.term ?? null,
    utm_content: input.utm?.content ?? null,
    referrer: input.referrer ?? null,
    analyzer_score: input.analyzerScore ?? null,
    analyzer_blob_url: input.analyzerBlobUrl ?? null,
    user_agent: userAgent ?? null,
  };
}

export async function insertLead(
  input: LeadInput,
  meta: { userAgent?: string } = {}
): Promise<StoredLead> {
  const client = getClient();

  if (client) {
    const { data, error } = await client
      .from("leads")
      .insert([toRow(input, meta.userAgent)])
      .select("id, created_at")
      .single();
    if (error) {
      throw new Error(`supabase insert failed: ${error.message}`);
    }
    return {
      id: data.id as string,
      created_at: data.created_at as string,
      data: { ...input, user_agent: meta.userAgent },
    };
  }

  return await writeLocal(input, meta.userAgent);
}

const LOCAL_DIR = path.resolve(process.cwd(), ".data");
const LOCAL_FILE = path.join(LOCAL_DIR, "leads.ndjson");

async function writeLocal(
  input: LeadInput,
  userAgent?: string
): Promise<StoredLead> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  const stored: StoredLead = {
    id: cryptoRandomId(),
    created_at: new Date().toISOString(),
    data: { ...input, user_agent: userAgent },
  };
  await fs.appendFile(LOCAL_FILE, JSON.stringify(stored) + "\n", "utf8");
  return stored;
}

function cryptoRandomId(): string {
  return globalThis.crypto.randomUUID();
}
