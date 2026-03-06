-- Create investor_presentations table
CREATE TABLE IF NOT EXISTS investor_presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  presentation_date DATE NOT NULL,
  presentation_title TEXT NOT NULL,
  presentation_url TEXT NOT NULL,
  presentation_source TEXT DEFAULT 'company_ir',
  presentation_type TEXT DEFAULT 'quarterly',
  presentation_summary TEXT,
  key_slides TEXT[],
  financial_guidance TEXT,
  pdf_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(builder_id, presentation_date, presentation_title)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_presentations_builder ON investor_presentations(builder_id);
CREATE INDEX IF NOT EXISTS idx_presentations_date ON investor_presentations(presentation_date);

-- Enable RLS
ALTER TABLE investor_presentations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS allow_public_read_presentations ON investor_presentations;
CREATE POLICY allow_public_read_presentations ON investor_presentations
  FOR SELECT USING (true);

-- Update earnings_calls table to support transcript URLs
ALTER TABLE earnings_calls ADD COLUMN IF NOT EXISTS transcript_url TEXT;
ALTER TABLE earnings_calls ADD COLUMN IF NOT EXISTS transcript_source TEXT DEFAULT 'seeking_alpha';

-- Create indexes for earnings_calls if they don't exist
CREATE INDEX IF NOT EXISTS idx_earnings_calls_builder ON earnings_calls(builder_id);
CREATE INDEX IF NOT EXISTS idx_earnings_calls_date ON earnings_calls(call_date);
