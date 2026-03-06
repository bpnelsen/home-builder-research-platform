#!/usr/bin/env node
/**
 * Process Earnings Call Transcripts with AI
 * Analyzes transcripts and generates summaries + highlights
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

async function processEarningsCallTranscripts() {
  try {
    console.log('🔄 Starting earnings call processing...');

    // Get unprocessed transcripts
    const { data: calls, error: fetchError } = await supabase
      .from('earnings_calls')
      .select('id, builder_id, call_date, transcript_text')
      .is('ai_summary', null)
      .limit(5); // Process 5 at a time

    if (fetchError) {
      console.error('❌ Error fetching calls:', fetchError);
      throw fetchError;
    }

    console.log(`📞 Found ${calls.length} unprocessed earnings calls`);

    // Process each call
    for (const call of calls) {
      console.log(`\n⏳ Processing call ${call.id} (${call.call_date})...`);

      // Get builder name
      const { data: builder } = await supabase
        .from('builders')
        .select('name')
        .eq('id', call.builder_id)
        .single();

      const prompt = `Analyze this earnings call transcript for ${builder.name} (${call.call_date}). Provide:

1. 2-3 paragraph summary of call highlights and guidance
2. Top 5 key highlights from management
3. Key CEO quotes (direct quotes from transcript)
4. Key CFO/finance quotes (direct quotes about financial performance)
5. Key financial metrics mentioned

Return valid JSON:
{
  "summary": "...",
  "highlights": ["...", "...", "...", "...", "..."],
  "ceoQuotes": ["...", "..."],
  "cfoQuotes": ["...", "..."],
  "keyMetrics": { "revenue": "...", "eps": "...", "guidance": "..." }
}

TRANSCRIPT:
${call.transcript_text.substring(0, 8000)}`;

      const analysis = await callClaudeAPI(prompt);

      if (analysis) {
        // Update call with analysis
        const { error: updateError } = await supabase
          .from('earnings_calls')
          .update({
            ai_summary: analysis.summary,
            key_highlights: analysis.highlights,
            ceo_quotes: analysis.ceoQuotes,
            cfo_quotes: analysis.cfoQuotes,
          })
          .eq('id', call.id);

        if (updateError) {
          console.error('❌ Error updating call:', updateError);
        } else {
          console.log(`✅ Processed ${builder.name} earnings call`);
        }
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log('\n✅ Earnings call processing complete!');
    return true;
  } catch (error) {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  }
}

// Run processing
processEarningsCallTranscripts();
