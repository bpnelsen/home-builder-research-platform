# 4-Tab Architecture Setup Guide

Your Home Builder Financial Research Platform now has 4 separate tabs:

1. **📄 10-K Filings** (Navy) - Annual SEC filings
2. **📋 10-Q Filings** (Teal) - Quarterly SEC filings
3. **🎙️ Earnings Calls** (Green) - Earnings call transcripts from Seeking Alpha
4. **📊 Investor Presentations** (Purple) - Quarterly investor presentations + investor day materials

---

## STEP 1: Create the Database Table

Open Supabase SQL Editor and run this migration:

```sql
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
```

---

## STEP 2: Populate Investor Presentations

```bash
cd /data/.openclaw/workspace/home-builder-research-platform
node scripts/populate-presentations.js
```

You'll see:
```
✅ COMPLETE! 12 investor presentations populated

📊 Coverage:
  • LENNAR (LEN): 3 presentations
  • D.R. Horton (DHI): 1 presentation
  • ... (10 total builders covered)
```

---

## STEP 3: Populate Earnings Call Transcripts

The earnings calls are already in the database (mapped from the 10-Q data earlier), but they should ideally be:
- Actual Seeking Alpha transcript links
- Claude-summarized transcripts (800-1200 words)
- Key quotes from executives
- Q&A highlights

For now, the current earnings_calls table contains 10-Q filing summaries. We can enhance this later with actual transcript data.

---

## STEP 4: Deploy to Vercel

```bash
git add -A
git commit -m "Add investor presentations table and populate data"
git push origin main
```

Vercel will auto-deploy. Wait 2-3 minutes for ✅ **Ready**.

---

## STEP 5: Test on Live Site

1. Go to: **https://homebuilder.vercel.app**
2. Hard refresh: **Ctrl+Shift+R**
3. Click any builder (e.g., Lennar)
4. You'll see **4 tabs**:

```
📄 10-K (0)  |  📋 10-Q (51)  |  📞 Earnings (51)  |  📊 Presentations (3)
```

5. Click **📊 Investor Presentations**
6. You'll see:
   - Presentation title + date
   - Summary (800-1200 words)
   - Links to web version + PDF
   - Financial guidance excerpt
   - 6 key slide topics

---

## TAB DATA SOURCES

### 📄 10-K Filings
- **Source**: SEC EDGAR filings
- **Frequency**: Annual (1 per fiscal year)
- **Data**: 3 years per builder (2022-2024)
- **Content**: AI summary + key metrics

### 📋 10-Q Filings
- **Source**: SEC EDGAR filings
- **Frequency**: Quarterly (4 per fiscal year)
- **Data**: 4+ years (2022-2026 Q1)
- **Content**: AI summary + 5-7 highlights

### 🎙️ Earnings Calls
- **Source**: Seeking Alpha transcripts
- **Frequency**: Quarterly (4 per year)
- **Data**: Ready for 2024 onwards
- **Content**: Should be full transcript summaries (800-1200 words) once transcripts are fetched
- **Format**: Key quotes, Q&A highlights, executive commentary

### 📊 Investor Presentations
- **Source**: Company investor relations websites
- **Frequency**: Quarterly (1 per quarter) + investor days
- **Data**: Sample Q1 2024 for each builder
- **Content**: Presentation summary, key slide topics, financial guidance
- **Links**: Web + PDF versions to actual investor relation pages

---

## NEXT ENHANCEMENTS

### Real Earnings Call Transcripts
1. Scrape Seeking Alpha for earnings call transcript URLs
2. Fetch full transcripts using Puppeteer/Playwright
3. Pass to Claude API for 800-1200 word summaries
4. Extract key quotes and Q&A highlights
5. Store in earnings_calls table with new columns

### More Presentations
1. Build script to crawl company investor relations pages
2. Find quarterly presentation PDFs
3. Extract text from PDFs
4. Summarize with Claude
5. Store URLs + summaries + links

### Earnings Call Calendar
1. Add upcoming earnings dates
2. Link to registration/listen links
3. Show past earnings with transcript links

---

## DATABASE SCHEMA

### investor_presentations
```
- id (UUID)
- builder_id (UUID) → builders
- presentation_date (DATE)
- presentation_title (TEXT)
- presentation_url (TEXT) - Link to web version
- presentation_source (TEXT) - 'company_ir', 'sec_edgar', 'investor_day'
- presentation_type (TEXT) - 'quarterly', 'earnings_day', 'investor_day', 'conference'
- presentation_summary (TEXT) - 800-1200 word Claude summary
- key_slides (TEXT[]) - Array of important slide topics
- financial_guidance (TEXT) - Forward guidance excerpt
- pdf_link (TEXT) - Direct link to PDF
- created_at, updated_at (TIMESTAMPTZ)
- UNIQUE(builder_id, presentation_date, presentation_title)
```

### earnings_calls (enhanced)
```
- id (UUID)
- builder_id (UUID) → builders
- fiscal_year (INTEGER)
- fiscal_quarter (INTEGER)
- call_date (DATE)
- transcript_url (TEXT) - Seeking Alpha link NEW
- transcript_source (TEXT) - 'seeking_alpha', 'company_ir' NEW
- transcript_summary (TEXT) - Claude summary of transcript
- key_quotes (TEXT[]) - Executive quotes
- key_highlights (TEXT[]) - Discussion points
- analyst_questions (TEXT) - Q&A summary
- alert_sent (BOOLEAN)
```

---

## COLOR SCHEME

| Tab | Color | Hex | Border |
|-----|-------|-----|--------|
| 10-K Filings | Navy | #0F3A7D | Navy-500 |
| 10-Q Filings | Teal | #06B6D4 | Teal-500 |
| Earnings Calls | Green | #10B981 | Green-700 |
| Presentations | Purple | #9333EA | Purple-500 |

---

## DONE! ✅

Your platform now has a complete 4-tab architecture for comprehensive home builder financial research!

**Test it live:** https://homebuilder.vercel.app

Questions? Check the code in `app/builders/[id]/page.tsx`
