-- Create builders table
CREATE TABLE IF NOT EXISTS builders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ticker TEXT NOT NULL UNIQUE,
  website TEXT,
  markets TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create stock_prices table
CREATE TABLE IF NOT EXISTS stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID REFERENCES builders(id),
  price DECIMAL(10, 2),
  market_cap DECIMAL(15, 2),
  change_percent DECIMAL(5, 2),
  date TIMESTAMP DEFAULT NOW()
);

-- Create filings_10k table
CREATE TABLE IF NOT EXISTS filings_10k (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID REFERENCES builders(id),
  filing_date DATE,
  fiscal_year INT,
  summary TEXT,
  key_metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create earnings_calls table
CREATE TABLE IF NOT EXISTS earnings_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID REFERENCES builders(id),
  call_date DATE,
  quarter TEXT,
  transcript TEXT,
  highlights TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create alert_subscriptions table
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  builder_ids UUID[] DEFAULT ARRAY[]::UUID[],
  alert_types TEXT[] DEFAULT ARRAY['10k', 'earnings']::TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert home builders
INSERT INTO builders (name, ticker, website, markets) VALUES
  ('Lennar Corporation', 'LEN', 'https://www.lennar.com', ARRAY['Florida', 'California', 'Texas']),
  ('D.R. Horton', 'DHI', 'https://www.drhorton.com', ARRAY['Texas', 'Arizona', 'Colorado']),
  ('KB Home', 'KBH', 'https://www.kbhome.com', ARRAY['California', 'Nevada', 'Arizona']),
  ('Toll Brothers', 'TOL', 'https://www.tollbrothers.com', ARRAY['Pennsylvania', 'California', 'New Jersey']),
  ('PulteGroup', 'PHM', 'https://www.pulte.com', ARRAY['Florida', 'Texas', 'Arizona']),
  ('NVR Inc', 'NVR', 'https://www.nvrsinc.com', ARRAY['Virginia', 'Maryland', 'Pennsylvania']),
  ('Tri Pointe Homes', 'TPH', 'https://www.tripointehomes.com', ARRAY['California', 'Arizona', 'Colorado']),
  ('M.D.C. Holdings', 'MDC', 'https://www.mdchomes.com', ARRAY['Colorado', 'Arizona', 'Texas']),
  ('Cavco Industries', 'CVCO', 'https://www.cavco.com', ARRAY['Multiple States']),
  ('LGI Homes', 'LGIH', 'https://www.lgihomes.com', ARRAY['Texas', 'Georgia', 'South Carolina'])
ON CONFLICT (ticker) DO NOTHING;

-- Insert sample stock prices (will be updated daily by automation)
INSERT INTO stock_prices (builder_id, price, market_cap, change_percent) 
SELECT id, 100.00 + (RANDOM() * 50), 50000000000 + (RANDOM() * 30000000000), (RANDOM() * 10 - 5)
FROM builders
ON CONFLICT DO NOTHING;
