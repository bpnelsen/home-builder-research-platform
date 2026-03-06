-- Home Builder Research Platform - Database Schema
-- Supabase PostgreSQL

-- 1. BUILDERS TABLE
CREATE TABLE IF NOT EXISTS builders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  ticker TEXT NOT NULL UNIQUE,
  sector TEXT DEFAULT 'Residential Construction',
  website TEXT,
  description TEXT,
  markets TEXT[], -- e.g. ['Arizona', 'California', 'Texas']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. STOCK PRICES TABLE (daily updates)
CREATE TABLE IF NOT EXISTS stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  market_cap DECIMAL(20, 2),
  change_percent DECIMAL(5, 2),
  volume BIGINT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(builder_id, date)
);

CREATE INDEX idx_stock_prices_date ON stock_prices(date DESC);
CREATE INDEX idx_stock_prices_builder ON stock_prices(builder_id);

-- 3. 10-K FILINGS TABLE
CREATE TABLE IF NOT EXISTS filings_10k (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  filing_date DATE NOT NULL,
  fiscal_year INT NOT NULL,
  sec_url TEXT,
  raw_content TEXT,
  
  -- AI Summaries
  summary TEXT,
  key_metrics JSONB, -- {revenue, earnings, margins, etc}
  headwinds TEXT[],
  tailwinds TEXT[],
  markets_focused TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(builder_id, fiscal_year)
);

CREATE INDEX idx_10k_builder ON filings_10k(builder_id);
CREATE INDEX idx_10k_date ON filings_10k(filing_date DESC);

-- 4. EARNINGS CALLS TABLE
CREATE TABLE IF NOT EXISTS earnings_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  filing_10k_id UUID REFERENCES filings_10k(id) ON DELETE SET NULL,
  call_date DATE NOT NULL,
  fiscal_quarter INT,
  fiscal_year INT,
  
  -- Transcripts & Summaries
  transcript_url TEXT,
  transcript_text TEXT,
  ai_summary TEXT,
  key_highlights TEXT[],
  
  -- Management quotes
  ceo_quotes TEXT[],
  cfo_quotes TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_earnings_builder ON earnings_calls(builder_id);
CREATE INDEX idx_earnings_date ON earnings_calls(call_date DESC);

-- 5. FILING SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS filing_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL, -- '10-K' or '10-Q'
  expected_date DATE,
  fiscal_period TEXT, -- 'FY 2025', 'Q1 2025', etc
  filed_date DATE,
  status TEXT DEFAULT 'pending', -- pending, filed, delayed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_schedule_builder ON filing_schedule(builder_id);
CREATE INDEX idx_schedule_date ON filing_schedule(expected_date);

-- 6. ALERT SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  builder_ids UUID[],
  alert_types TEXT[], -- '10-K Filed', 'Earnings Call', 'Stock Movement'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_alerts_email ON alert_subscriptions(email);
CREATE INDEX idx_alerts_active ON alert_subscriptions(active);

-- 7. COMPARISON DATA TABLE (cache for performance)
CREATE TABLE IF NOT EXISTS builder_comparison (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_ids UUID[],
  comparison_data JSONB, -- cached comparison results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT now() + INTERVAL '7 days'
);

-- ENABLE RLS
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE filings_10k ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE filing_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (Public read access, no auth needed)
CREATE POLICY "Allow public read" ON builders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read" ON stock_prices
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read" ON filings_10k
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read" ON earnings_calls
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read" ON filing_schedule
  FOR SELECT
  TO public
  USING (true);

-- Alert subscriptions - public insert only
CREATE POLICY "Allow public insert alerts" ON alert_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read alerts" ON alert_subscriptions
  FOR SELECT
  TO public
  USING (true);

-- ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE builders;
ALTER PUBLICATION supabase_realtime ADD TABLE stock_prices;
ALTER PUBLICATION supabase_realtime ADD TABLE filings_10k;
ALTER PUBLICATION supabase_realtime ADD TABLE earnings_calls;
