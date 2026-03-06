# Phase 2: AI Summaries with Claude

**Status:** 🚀 In Development  
**Timeline:** ~1 week  
**Dependencies:** Phase 1 Backend ✅

---

## What Phase 2 Delivers

✅ **Claude API Integration**
- Summarizes 10-K filings automatically
- Analyzes earnings call transcripts
- Extracts key metrics & insights
- Identifies business headwinds/tailwinds
- Detects geographic markets

✅ **Processing Scripts**
- `process-10k-summaries.js` - Batch 10-K analysis
- `process-earnings-calls.js` - Call transcript analysis
- Automated via GitHub Actions

✅ **AI-Powered Data**
- Executive summaries of 10-Ks
- Key financial metrics extracted
- Business headwinds identified
- Growth opportunities flagged
- Markets focused on identified

---

## Files Created

```
lib/
├── claude-ai.ts           # Claude API wrapper

scripts/
├── process-10k-summaries.js        # Process 10-K filings
└── process-earnings-calls.js       # Process call transcripts

PHASE2_AI.md              # This guide
```

---

## Setup

### Environment Variables

```bash
CLAUDE_API_KEY=sk-ant-xxx...
```

Get API key: https://console.anthropic.com

### Run Processing

```bash
# Process pending 10-K filings
npm run process:10k

# Process pending earnings calls
npm run process:earnings
```

---

## AI Processing Pipeline

### 10-K Summaries

1. **Input:** Raw 10-K text from SEC Edgar
2. **Claude Analysis:**
   - Executive summary (2-3 paragraphs)
   - Key metrics (revenue, margins, etc)
   - Business headwinds (risks)
   - Business tailwinds (opportunities)
   - Geographic markets
3. **Output:** Structured JSON → Supabase

### Earnings Calls

1. **Input:** Transcript from investor relations
2. **Claude Analysis:**
   - Call summary
   - Key highlights (top 5)
   - CEO direct quotes
   - CFO direct quotes
   - Key metrics mentioned
3. **Output:** Structured JSON → Supabase

---

## Cost Estimate

- Claude 3.5 Sonnet API: ~$0.003 per 1K input tokens
- 10 builders × 4 filings = 40 documents
- ~$5-10/month for full processing

---

## Next Steps

1. Add CLAUDE_API_KEY to environment
2. Fetch actual 10-K PDFs from Edgar
3. Run `npm run process:10k`
4. Wait for summaries in database
5. Proceed to Phase 3 (Frontend)

---

## GitHub Actions Automation

Create `.github/workflows/process-filings.yml`:

```yaml
name: Process Filings with AI

on:
  schedule:
    - cron: '0 9 * * 0'  # Weekly Sunday morning
  workflow_dispatch:

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run process:10k
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
      - run: npm run process:earnings
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
```

---

## Limitations

- API rate limits (be respectful)
- Cost per summary (~$0.10)
- Processing time (~1 min per document)
- Quality depends on document quality

---

**Next:** Phase 3 - Frontend UI
