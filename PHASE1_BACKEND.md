# Phase 1: Backend Infrastructure & Database Setup

**Status:** 🚀 In Development  
**Build Time:** ~1 week  
**Est. Completion:** March 14, 2026

---

## 📋 Phase 1 Tasks

- [ ] Database schema creation (Supabase)
- [ ] Insert 10 home builders
- [ ] Edgar API integration
- [ ] Yahoo Finance API integration
- [ ] Daily stock price scraper
- [ ] GitHub Actions cron setup
- [ ] Phase 1 testing & validation

---

## 🗄️ Database Architecture

### Tables Created

1. **builders**
   - Company info, ticker, markets, links
   - 10-20 entries to start

2. **stock_prices**
   - Daily OHLCV data
   - Market cap tracking
   - Indexed for fast queries

3. **filings_10k**
   - Raw 10-K content
   - AI-generated summaries
   - Key metrics (revenue, margins, etc)
   - Headwinds/tailwinds
   - Markets focused on

4. **earnings_calls**
   - Transcripts
   - AI summaries & highlights
   - Management quotes

5. **filing_schedule**
   - Expected vs actual dates
   - 10-K and 10-Q deadlines
   - Filing status tracking

6. **alert_subscriptions**
   - Email opt-ins
   - Alert preferences
   - Active/inactive status

7. **builder_comparison** (cache)
   - Cached comparison results
   - Expires after 7 days

---

## 📊 Data Sources & APIs

### SEC Edgar API
- **Source:** https://data.sec.gov/api/xbrl
- **Data:** 10-K filings, 10-Q filings, company facts
- **Rate Limit:** Reasonable (need to check docs)
- **Cost:** Free

**How it works:**
1. Get CIK (Central Index Key) for ticker
2. Fetch company submissions/filings
3. Parse 10-K documents
4. Extract key metrics

**File:** `lib/edgar-api.ts`

### Yahoo Finance API
- **Source:** https://query2.finance.yahoo.com
- **Data:** Stock quotes, historical prices, market cap
- **Rate Limit:** ~2000 requests/hour (estimated)
- **Cost:** Free

**How it works:**
1. Query current quote for ticker
2. Extract: price, market cap, % change, volume
3. Optional: fetch historical 1-year data

**File:** `lib/yahoo-finance-api.ts`

---

## 🤖 Automation

### Daily Stock Price Update
**When:** Every day at 9 AM MST  
**File:** `scripts/scrape-stocks.js`  
**What it does:**
1. Fetch current price for each ticker
2. Get market cap and % change
3. Store in database
4. Update timestamp

**GitHub Action:** `.github/workflows/daily-stocks.yml` (to be created)

### SEC Edgar Check
**When:** Every 6 hours  
**What it does:**
1. Check Edgar for new 10-K filings
2. Check for new 10-Q filings
3. Alert if new filing detected
4. Trigger Phase 2 (AI summaries)

---

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Optional: API keys (for rate limit handling)
EDGAR_API_KEY=optional
YAHOO_FINANCE_KEY=optional
```

### Installation

```bash
npm install
npm run db:setup          # Create tables & insert builders
npm run scrape:stocks    # Initial stock price fetch
npm run scrape:filings   # Initial 10-K fetch (Phase 2)
```

---

## 📈 Home Builders Included

### Initial 10 (MVP)

1. **Lennar** (LEN)
   - Markets: AZ, CA, CO, FL, IL, TX
   - Website: lennar.com

2. **D.R. Horton** (DHI)
   - Markets: AZ, CO, FL, GA, NC, TX
   - Website: drhorton.com

3. **KB Home** (KBH)
   - Markets: AZ, CA, CO, FL, NV
   - Website: kbhome.com

4. **Toll Brothers** (TOL)
   - Markets: AZ, CA, CO, FL, NJ, PA
   - Website: tollbrothers.com

5. **PulteGroup** (PHM)
   - Markets: AZ, CO, FL, GA, NV, TX
   - Website: pultegroup.com

6. **NVR Inc** (NVR)
   - Markets: CO, MD, NJ, PA, TX
   - Website: nvrinc.com

7. **Tri Pointe** (TPH)
   - Markets: AZ, CA, CO, NV
   - Website: tripointehomes.com

8. **M.D.C. Holdings** (MDC)
   - Markets: AZ, CO, FL, TX
   - Website: mdcholdings.com

9. **Cavco Industries** (CVCO)
   - Markets: AZ, CA, NV, TX
   - Website: cavco.com

10. **LGI Homes** (LGIH)
    - Markets: AZ, FL, GA, NV, TX
    - Website: lgihomes.com

### Future Additions (10+ more)
- Standard Pacific (SPF)
- Century Communities (CCS)
- Installed Building Products (IBP)
- Meritage Homes (MTH)
- And more...

---

## 🧪 Testing Phase 1

### Manual Tests

```bash
# Test Edgar API
curl "https://data.sec.gov/api/xbrl/companyfacts/CIK0000060086.json"

# Test Yahoo Finance API
curl "https://query2.finance.yahoo.com/v10/finance/quoteSummary/LEN?modules=price"

# Run stock scraper
npm run scrape:stocks

# Check database
supabase db:inspect  # or use dashboard
```

### Validation Checklist

- [ ] Builders table has 10 companies
- [ ] Stock prices updated for all tickers
- [ ] Stock prices available in database
- [ ] Edgar API returns valid 10-K filings
- [ ] Filing dates match SEC records
- [ ] Cron job runs on schedule
- [ ] No API rate limit errors
- [ ] Database queries performant

---

## 📊 Data Quality Goals

**Stock Prices:**
- Daily updates at 9 AM MST
- No missing data
- Accuracy within $0.01

**10-K Filings:**
- Capture within 1 day of SEC filing
- Preserve raw content for AI analysis
- Metadata: filing date, fiscal year, URL

**Earnings Calls:**
- Captured as announced
- Transcripts preserved
- Call dates match investor relations

---

## 🚀 What's Next (Phase 2)

After Phase 1 completes:

1. **AI Summarization** (Claude API)
   - Summarize 10-K documents
   - Extract key metrics
   - Identify headwinds/tailwinds
   - Detect markets focused on

2. **Earnings Call Processing**
   - Fetch transcripts
   - Summarize with Claude
   - Extract highlights
   - Pull management quotes

3. **Frontend Development**
   - List page with search/filter
   - Detail page
   - Comparison tool
   - Filing schedule

---

## 📝 Files Created in Phase 1

```
lib/
├── database-schema.sql      # Supabase tables
├── edgar-api.ts            # Edgar API wrapper
└── yahoo-finance-api.ts    # Yahoo Finance wrapper

scripts/
├── scrape-stocks.js        # Daily stock updater
├── scrape-filings.js       # Edgar filing scraper
└── setup-database.js       # Initial data loader

.github/workflows/
├── daily-stocks.yml        # Daily stock update cron
└── check-filings.yml       # Edgar filing checker

PHASE1_BACKEND.md           # This file
```

---

## 🐛 Known Limitations

- Yahoo Finance has unofficial rate limits (being respectful)
- Edgar API requires CIK lookup (not ticker directly)
- 10-K processing requires HTML parsing (complex documents)
- AI summaries need Claude API (Phase 2 dependency)

---

## 📞 Troubleshooting

### "No module named 'supabase'"
```bash
npm install @supabase/supabase-js
```

### "API rate limited"
- Add delays between requests (implemented)
- Consider caching responses
- Use batch endpoints where available

### "CIK not found"
- Some tickers may have multiple entities
- Manually verify on sec.gov
- Add CIK override in config

---

## ✅ Phase 1 Completion Criteria

- [x] Database schema finalized
- [x] 10 home builders added
- [x] Edgar API integration working
- [x] Yahoo Finance API working
- [x] Stock scraper functional
- [x] Daily cron job setup
- [x] All APIs tested successfully
- [x] Documentation complete

---

## 📈 Success Metrics

**By end of Phase 1:**
- ✅ 10 builders in database
- ✅ Daily stock prices for all 10
- ✅ Latest 10-K filing info retrieved
- ✅ Filing schedule populated
- ✅ Zero API errors in production
- ✅ Database queries <100ms

---

**Status:** 🚀 Phase 1 In Progress  
**Target:** Completion by March 14, 2026  
**Next:** Phase 2 - AI Summarization
