#!/usr/bin/env node
/**
 * Daily Stock Price Update Script
 * Runs via GitHub Actions every morning
 * Updates stock prices for all tracked home builders
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Home builder tickers
const HOME_BUILDERS = [
  'LEN', // Lennar
  'DHI', // D.R. Horton
  'KBH', // KB Home
  'TOL', // Toll Brothers
  'PHM', // PulteGroup
  'NVR', // NVR Inc
  'TPH', // Tri Pointe
  'MDC', // M.D.C. Holdings
  'CVCO', // Cavco
  'LGIH', // LGI Homes
];

async function getStockPrice(ticker) {
  try {
    const response = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    const data = response.data.quoteSummary.result[0].price;
    return {
      ticker,
      price: data.regularMarketPrice.raw,
      marketCap: data.marketCap?.raw,
      changePercent: data.regularMarketChangePercent.raw,
      volume: data.regularMarketVolume.raw,
      dayHigh: data.regularMarketDayHigh.raw,
      dayLow: data.regularMarketDayLow.raw,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch ${ticker}:`, error.message);
    return null;
  }
}

async function updateStockPrices() {
  try {
    console.log('🔄 Starting stock price update...');
    console.log(`📊 Updating ${HOME_BUILDERS.length} builders`);

    // Fetch current quotes
    const quotes = [];
    for (const ticker of HOME_BUILDERS) {
      const quote = await getStockPrice(ticker);
      if (quote) {
        quotes.push(quote);
        console.log(`✓ ${ticker}: $${quote.price}`);
      }
      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`\n📈 Retrieved ${quotes.length} stock prices`);

    // Get builder IDs from database
    const { data: builders } = await supabase
      .from('builders')
      .select('id, ticker')
      .in('ticker', quotes.map((q) => q.ticker));

    console.log(`📋 Found ${builders.length} builders in database`);

    // Insert stock prices
    const today = new Date().toISOString().split('T')[0];
    const priceRecords = quotes.map((quote) => {
      const builder = builders.find((b) => b.ticker === quote.ticker);
      return {
        builder_id: builder?.id,
        ticker: quote.ticker,
        price: quote.price,
        market_cap: quote.marketCap,
        change_percent: quote.changePercent,
        volume: quote.volume,
        date: today,
      };
    });

    const { error: insertError } = await supabase
      .from('stock_prices')
      .upsert(priceRecords, { onConflict: 'builder_id,date' });

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      throw insertError;
    }

    console.log(`✅ Updated ${priceRecords.length} stock prices`);
    console.log(`📅 Date: ${today}`);
    console.log('✅ Stock price update complete!');

    return true;
  } catch (error) {
    console.error('❌ Stock price update failed:', error);
    process.exit(1);
  }
}

// Run update
updateStockPrices();
