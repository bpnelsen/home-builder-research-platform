-- Migration: Add alert_sent columns to track which filings/calls have been emailed

-- Add alert_sent to filings_10k
ALTER TABLE filings_10k 
ADD COLUMN alert_sent BOOLEAN DEFAULT false;

-- Add alert_sent to earnings_calls
ALTER TABLE earnings_calls 
ADD COLUMN alert_sent BOOLEAN DEFAULT false;

-- Index for efficient queries
CREATE INDEX idx_filings_10k_alert_sent ON filings_10k(alert_sent);
CREATE INDEX idx_earnings_calls_alert_sent ON earnings_calls(alert_sent);

-- Run this in Supabase SQL Editor:
-- Copy all SQL and paste into the editor at: https://app.supabase.com
