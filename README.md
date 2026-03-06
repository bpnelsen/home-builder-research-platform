# 🏗️ Home Builder Financial Research Platform

An AI-powered financial research platform tracking residential construction home builders with automated 10-K summaries, earnings call analysis, and real-time stock data.

**Status:** 🚀 Phase 1 Backend - In Development  
**Target Launch:** April 2026  
**Stack:** Next.js 14 | React 18 | TypeScript | Supabase | SEC Edgar API | Yahoo Finance

---

## 🎯 Features

✅ **10-20 Major Home Builders Tracked**
- Lennar, D.R. Horton, KB Home, Toll Brothers, PulteGroup, NVR, and more

✅ **Real-Time Stock Data**
- Daily price updates from Yahoo Finance
- Market cap, % change, volume tracking
- Links to Yahoo Finance profiles

✅ **10-K Filing Analysis**
- Auto-scrape from SEC Edgar
- AI-generated summaries of key metrics
- Business headwinds & tailwinds
- Gross/operating margins by market
- Markets company is focusing on

✅ **Earnings Call Intelligence**
- Full transcripts automatically fetched
- AI-generated summaries & highlights
- Management quotes extracted
- Associated with respective 10-K filings

✅ **Filing Schedule**
- Days until next 10-K release
- Days until next 10-Q release
- Historical filing dates
- Status tracking

✅ **Smart Filtering & Search**
- Filter by company, market, sector
- Side-by-side comparison tool
- Responsive design (desktop-first)

✅ **Opt-In Alerts** (Coming Phase 2)
- New 10-K/10-Q filed
- Earnings call announced
- Major stock movement

---

## 🏗️ Project Phases

### Phase 1: Backend Infrastructure ⏳ (Current)
**Timeline:** 1 week (Est. completion March 14)
- Database schema (Supabase)
- SEC Edgar API integration
- Yahoo Finance API integration
- Daily stock price scraper
- Initial builder data population

**Status:** In progress

### Phase 2: AI Summaries 🤖
**Timeline:** 1 week
- Claude API integration
- 10-K auto-summarization
- Earnings call transcript analysis
- Highlight extraction

### Phase 3: Frontend 🎨
**Timeline:** 1.5 weeks
- Builder list & search
- Detail pages
- Comparison tool
- Filing schedule display

### Phase 4: Automation & Alerts ⚙️
**Timeline:** 3 days
- Daily cron jobs
- Filing detection
- Email alerts (opt-in)

### Phase 5: Testing & Deployment 🚀
**Timeline:** 3 days
- End-to-end testing
- Vercel deployment
- GitHub Actions setup
- Performance optimization

---

## 📊 Database Architecture

```
builders
├── name, ticker, sector
├── website, description
└── markets (array)

stock_prices (daily)
├── ticker, price, market_cap
├── day_change, day_change_percent
└── volume

filings_10k
├── fiscal_year, filing_date
├── raw_content (for AI processing)
├── summary (AI-generated)
├── key_metrics {revenue, earnings, margins}
├── headwinds, tailwinds
└── markets_focused

earnings_calls
├── call_date, fiscal_quarter
├── transcript_text
├── ai_summary, key_highlights
└── ceo_quotes, cfo_quotes

filing_schedule
├── filing_type (10-K / 10-Q)
├── expected_date, filed_date
└── status (pending / filed)

alert_subscriptions
├── email, builder_ids
├── alert_types
└── active (boolean)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- GitHub account (for Actions)

### Installation

```bash
# Clone repo
git clone https://github.com/bpnelsen/home-builder-research-platform.git
cd home-builder-research-platform

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your Supabase credentials

# Initialize database
npm run db:setup

# Run initial data collection
npm run scrape:stocks
npm run scrape:filings

# Start dev server
npm run dev
```

Visit http://localhost:3000

---

## 📚 Documentation

- **[Phase 1 Backend Details](./PHASE1_BACKEND.md)** - Database, APIs, scraping
- **[API Reference](./API.md)** - Endpoint documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Vercel, GitHub Actions setup

---

## 🏢 Home Builders Tracked

**Initial 10 (MVP):**
1. Lennar (LEN)
2. D.R. Horton (DHI)
3. KB Home (KBH)
4. Toll Brothers (TOL)
5. PulteGroup (PHM)
6. NVR Inc (NVR)
7. Tri Pointe Homes (TPH)
8. M.D.C. Holdings (MDC)
9. Cavco Industries (CVCO)
10. LGI Homes (LGIH)

**Planned Additions (10+ more):**
- Standard Pacific, Century Communities, Installed Building Products, Meritage Homes, and others

---

## 🛠️ Tech Stack

**Frontend (Phase 3+)**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

**Backend**
- Node.js API routes
- Supabase (PostgreSQL)
- SEC Edgar API
- Yahoo Finance API

**AI & Automation**
- Claude API (Phase 2)
- GitHub Actions
- Vercel Cron

**Data Collection**
- Axios (HTTP client)
- Cheerio (HTML parsing)
- Supabase Client

---

## 📈 Key Metrics Tracked

**Stock Data:**
- Current price
- Market cap
- 52-week high/low
- P/E ratio
- Dividend yield

**10-K Metrics:**
- Total revenue
- Net income
- Operating margin
- Gross margin (by market)
- Return on equity

**Operational:**
- Homes delivered
- Active communities
- Average selling price
- Gross margin by market
- Geographic exposure

---

## 🔄 Data Update Schedule

| Task | Frequency | Next Phase |
|------|-----------|-----------|
| Stock prices | Daily (9 AM MST) | Phase 1 ✅ |
| 10-K filing check | Every 6 hours | Phase 2 |
| Earnings call check | Real-time | Phase 2 |
| AI summaries | When filing detected | Phase 2 |
| Alert emails | On event | Phase 4 |

---

## 🔐 Privacy & Access

- **No authentication required** - Public access
- **No user tracking** - No analytics (yet)
- **Opt-in alerts only** - Email subscription voluntary
- **No portfolio tracking** - View-only, no logins

---

## 🐛 Contributing

This is a solo project for now. Contact bpnelsen for collaboration interests.

---

## 📞 Support & Questions

- Check [Phase 1 Documentation](./PHASE1_BACKEND.md)
- Review database schema in `lib/database-schema.sql`
- See API wrappers in `lib/edgar-api.ts` and `lib/yahoo-finance-api.ts`

---

## 📜 License

MIT

---

## 🎯 Roadmap

- [x] Phase 1: Backend (In Progress)
- [ ] Phase 2: AI Summaries
- [ ] Phase 3: Frontend UI
- [ ] Phase 4: Automation & Alerts
- [ ] Phase 5: Testing & Deployment
- [ ] Phase 6: Additional Builders (10+ more)
- [ ] Phase 7: Advanced Features (comparisons, alerts, exports)

---

**Built with ❤️ for financial research**

---

**Questions?** See [Phase 1 Backend](./PHASE1_BACKEND.md) for detailed documentation.
