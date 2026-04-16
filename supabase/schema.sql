-- =============================================================================
-- VOGGS Salespage — Supabase schema
-- Apply via: `psql $SUPABASE_DB_URL -f supabase/schema.sql`
-- (or paste into the SQL editor in the Supabase dashboard)
-- =============================================================================

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS leads (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               timestamptz NOT NULL DEFAULT now(),

  -- Contact
  name                     text        NOT NULL,
  company                  text,
  email                    text        NOT NULL,
  phone                    text,
  -- Required for the planned German AI phone-agent follow-up layer.
  -- Only true when user explicitly opted in to outbound calls.
  outbound_call_consent    boolean     NOT NULL DEFAULT false,

  -- Qualification
  monthly_spend            text,        -- '<5k' | '5k-20k' | '20k-100k' | '>100k' | 'unknown'
  interests                text[]       NOT NULL DEFAULT '{}', -- subset of allowed slugs
  notes                    text,

  -- Source / attribution
  source                   text,        -- e.g. 'omr-masterclass'
  utm_source               text,
  utm_medium               text,
  utm_campaign             text,
  utm_term                 text,
  utm_content              text,
  referrer                 text,

  -- Optional analyzer artifact (last analysis user ran in the same session)
  analyzer_score           integer CHECK (analyzer_score IS NULL OR (analyzer_score BETWEEN 0 AND 100)),
  analyzer_blob_url        text,

  -- Internal
  user_agent               text,
  status                   text        NOT NULL DEFAULT 'new'
                                       CHECK (status IN ('new', 'contacted', 'qualified', 'closed'))
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx     ON leads (source);
CREATE INDEX IF NOT EXISTS leads_email_idx      ON leads (lower(email));

-- Row Level Security: only the service role can read/write.
-- The anon key NEVER touches this table; inserts go through the API route
-- which uses the service role on the server side.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- (Intentionally no policies — all access via service role from server.)
