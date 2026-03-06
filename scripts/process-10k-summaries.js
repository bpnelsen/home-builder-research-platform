#!/usr/bin/env node
/**
 * Process 10-K Filings with AI
 * Fetches raw 10-K content and generates AI summaries
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const claudeKey = process.env.CLAUDE_API_KEY;

if (!supabaseUrl || !supabaseKey || !claudeKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function callClaudeAPI(prompt) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': claudeKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );

    return JSON.parse(response.data.content[0].text);
  } catch (error) {
    console.error('Claude API error:', error.message);
    return null;
  }
}

async function process10KSummaries() {
  try {
    console.log('🔄 Starting 10-K processing...');

    // Get unprocessed 10-K filings
    const { data: filings, error: fetchError } = await supabase
      .from('filings_10k')
      .select('id, builder_id, fiscal_year, raw_content')
      .is('summary', null)
      .limit(5); // Process 5 at a time

    if (fetchError) {
      console.error('❌ Error fetching filings:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${filings.length} unprocessed 10-Ks`);

    // Process each filing
    for (const filing of filings) {
      console.log(
        `\n⏳ Processing filing ${filing.id} (FY ${filing.fiscal_year})...`
      );

      // Get builder name
      const { data: builder } = await supabase
        .from('builders')
        .select('name')
        .eq('id', filing.builder_id)
        .single();

      const prompt = `Analyze this 10-K filing for ${builder.name} (FY ${filing.fiscal_year}). Provide:

1. 2-3 paragraph executive summary
2. Key financial metrics (revenue, net income, margins)
3. Business headwinds (challenges, risks)
4. Business tailwinds (opportunities, growth drivers)
5. Geographic markets focused on

Return valid JSON:
{
  "summary": "...",
  "keyMetrics": { "revenue": "...", "netIncome": "...", "operatingMargin": "...", "grossMargin": "..." },
  "headwinds": ["...", "..."],
  "tailwinds": ["...", "..."],
  "markets": ["...", "..."]
}

10-K Content:
${filing.raw_content.substring(0, 8000)}`;

      const analysis = await callClaudeAPI(prompt);

      if (analysis) {
        // Update filing with summary
        const { error: updateError } = await supabase
          .from('filings_10k')
          .update({
            summary: analysis.summary,
            key_metrics: analysis.keyMetrics,
            headwinds: analysis.headwinds,
            tailwinds: analysis.tailwinds,
            markets_focused: analysis.markets,
          })
          .eq('id', filing.id);

        if (updateError) {
          console.error('❌ Error updating filing:', updateError);
        } else {
          console.log(`✅ Processed ${builder.name} FY ${filing.fiscal_year}`);
        }
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log('\n✅ 10-K processing complete!');
    return true;
  } catch (error) {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  }
}

// Run processing
process10KSummaries();
