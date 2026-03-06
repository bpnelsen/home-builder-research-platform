# Phase 2: AI Summaries - Complete Implementation Guide

**Status:** 🚀 Ready to Deploy  
**Timeline:** ~1 week  
**Estimated Cost:** $5-10/month

---

## Phase 2 Delivered

✅ **Claude API Integration**
- Full wrapper in `lib/claude-ai.ts`
- 10-K summarization function
- Earnings call analysis function
- Key metrics extraction

✅ **Processing Scripts**
- `process-10k-summaries.js` - Batch 10-K analysis
- `process-earnings-calls.js` - Earnings call processing
- Rate limiting built in
- Error handling included

✅ **Automation (GitHub Actions)**
- `daily-stocks.yml` - Daily stock updates (9 AM MST)
- `process-filings.yml` - Weekly AI processing (Sunday 10 AM)
- Fully serverless, no infrastructure needed

✅ **Documentation**
- .env.example for setup
- Complete configuration guide
- Script documentation

---

## Quick Start

### 1. Get Claude API Key
```
Go to: https://console.anthropic.com
Create account → Generate API key
```

### 2. Set Environment Variables
```bash
# In .env.local
CLAUDE_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_SUPABASE_URL=your-url
SUPABASE_SERVICE_KEY=your-key
```

### 3. Test Locally
```bash
npm run process:10k    # Process pending 10-Ks
npm run process:earnings  # Process pending calls
npm run process:all    # Process both
```

### 4. Add GitHub Secrets
Go to: https://github.com/bpnelsen/home-builder-research-platform/settings/secrets/actions

Add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `CLAUDE_API_KEY`

### 5. Enable GitHub Actions
- Go to Actions tab
- Enable workflows
- They'll run automatically on schedule

---

## What Each Script Does

### scrape-stocks.js
**When:** Daily at 9 AM MST  
**What:** Fetches current stock prices from Yahoo Finance  
**Output:** Updates `stock_prices` table

```bash
npm run scrape:stocks
```

### process-10k-summaries.js
**When:** Manual or via GitHub Actions (weekly)  
**What:** Finds 10-K filings without summaries and uses Claude to:
- Generate executive summary
- Extract key metrics
- Identify headwinds
- Identify tailwinds
- Find markets focused on

**Output:** Updates `filings_10k` table with summaries

```bash
npm run process:10k
```

### process-earnings-calls.js
**When:** Manual or via GitHub Actions (weekly)  
**What:** Finds earnings calls without summaries and uses Claude to:
- Summarize call
- Extract top 5 highlights
- Pull CEO direct quotes
- Pull CFO direct quotes
- Identify key metrics

**Output:** Updates `earnings_calls` table with analysis

```bash
npm run process:earnings
```

---

## Data Flow Diagram

```
SEC Edgar
    ↓
scrape-filings.js (fetches raw 10-K)
    ↓
Supabase: filings_10k (raw_content)
    ↓
process-10k-summaries.js
    ↓
Claude API (claude-3-5-sonnet)
    ↓
AI Summary → Supabase: filings_10k (summary, metrics, headwinds, tailwinds)
```

---

## Claude API Prompts

### 10-K Summarization Prompt

```
Analyze this 10-K filing for [Company] (FY [Year]). Provide:

1. 2-3 paragraph executive summary
2. Key financial metrics (revenue, net income, margins)
3. Business headwinds (challenges, risks)
4. Business tailwinds (opportunities, growth drivers)
5. Geographic markets focused on

Return JSON: {
  "summary": "...",
  "keyMetrics": {...},
  "headwinds": [...],
  "tailwinds": [...],
  "markets": [...]
}
```

### Earnings Call Prompt

```
Analyze this earnings call transcript for [Company] ([Date]). Provide:

1. 2-3 paragraph summary
2. Top 5 key highlights
3. CEO quotes (direct quotes)
4. CFO quotes (direct quotes)
5. Key metrics mentioned

Return JSON: {
  "summary": "...",
  "highlights": [...],
  "ceoQuotes": [...],
  "cfoQuotes": [...],
  "keyMetrics": {...}
}
```

---

## Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Claude 3.5 Sonnet | ~$0.003/1K tokens | Input tokens |
| Claude 3.5 Sonnet | ~$0.015/1K tokens | Output tokens |
| Per 10-K | ~$0.10-0.15 | Avg 3-5K tokens |
| Per Earnings Call | ~$0.05-0.10 | Avg 2-3K tokens |
| 10 builders × 4/year | ~$5-10/month | Rough estimate |

**Budget:** $5-20/month depending on volume

---

## Quality Assurance

### What Claude Extracts Well
✅ Summary paragraphs  
✅ Revenue & income numbers  
✅ Direct management quotes  
✅ Key initiatives  
✅ Market mentions  
✅ Growth factors  

### What Needs Review
⚠️ Exact precision of large numbers  
⚠️ Complex margin calculations  
⚠️ Industry-specific jargon  
⚠️ Forward guidance precision  

### Validation Steps
1. Spot-check 10-20% of summaries
2. Compare metrics to published data
3. Verify quotes match transcript
4. Ensure markets are correct

---

## GitHub Actions Setup

### Daily Stocks Workflow
```yaml
Trigger: Every day at 9 AM MST (4 PM UTC)
Action: npm run scrape:stocks
Output: Stock prices updated in Supabase
```

### Weekly Processing Workflow
```yaml
Trigger: Every Sunday at 10 AM MST
Actions:
  1. npm run process:10k
  2. npm run process:earnings
Output: New 10-K summaries + earnings analyses
```

### Manual Trigger
Go to: Actions → Process Filings with AI → Run workflow

---

## Troubleshooting

### "Claude API rate limited"
- Reduce concurrent requests
- Add longer delays between calls
- Process fewer items per run

### "Cannot connect to Supabase"
- Check SUPABASE_SERVICE_KEY
- Verify Supabase URL
- Ensure RLS policies allow inserts

### "Invalid JSON from Claude"
- Claude sometimes returns text instead of JSON
- Script has fallback to handle this
- Check logs for exact response

### "Timeout errors"
- Increase timeout in axios config
- Process fewer items at once
- Check network connectivity

---

## Next Steps

### Immediate
1. ✅ Add CLAUDE_API_KEY to GitHub secrets
2. ✅ Enable GitHub Actions
3. ✅ Test locally with: `npm run process:10k`

### This Week
4. Monitor first weekly run (Sunday)
5. Validate quality of summaries
6. Adjust prompts if needed
7. Test earnings call processing

### Ready for Phase 3
8. Start building frontend pages
9. Connect pages to AI-generated data
10. Deploy to Vercel

---

## Key Files

```
lib/claude-ai.ts              # Main AI wrapper
scripts/process-10k-summaries.js    # 10-K processor
scripts/process-earnings-calls.js   # Earnings processor
.github/workflows/daily-stocks.yml  # Daily automation
.github/workflows/process-filings.yml # Weekly automation
.env.example                  # Config template
PHASE2_COMPLETE.md            # This file
```

---

## Database Updates

### Tables Affected

**filings_10k**
- `summary` - AI-generated summary
- `key_metrics` - JSONB object
- `headwinds` - Array of text
- `tailwinds` - Array of text
- `markets_focused` - Array of markets

**earnings_calls**
- `ai_summary` - AI-generated summary
- `key_highlights` - Array of highlights
- `ceo_quotes` - Array of quotes
- `cfo_quotes` - Array of quotes

---

## Performance Expectations

| Task | Time | Cost |
|------|------|------|
| Stock update | 30 sec | $0 |
| Process 1 10-K | 30-60 sec | $0.10-0.15 |
| Process 1 earnings | 20-40 sec | $0.05-0.10 |
| Weekly full run | 5-10 min | $1-2 |

---

## Advanced: Custom Prompts

Modify prompts in scripts to extract different data:

```javascript
// In process-10k-summaries.js
const prompt = `... YOUR CUSTOM PROMPT HERE ...`;
```

Examples:
- Risk factor analysis
- Competitive positioning
- ESG metrics
- Geographic profitability
- Segment performance

---

## Success Metrics

By end of Phase 2:
- ✅ 40 10-K summaries (10 builders × 4 years)
- ✅ 40 earnings call summaries (10 × 4 calls/year)
- ✅ All data in Supabase
- ✅ Daily stock prices updated
- ✅ Weekly AI processing automated
- ✅ Total spend: <$15/month

---

**Phase 2 Status:** 🚀 **READY TO LAUNCH**

Next: Phase 3 Frontend 🎨
