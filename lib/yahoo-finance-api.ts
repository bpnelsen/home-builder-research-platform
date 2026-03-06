/**
 * Yahoo Finance API Integration
 * Fetches stock prices, market cap, and trading data
 */

import axios from 'axios';

export interface StockQuote {
  ticker: string;
  price: number;
  currency: string;
  marketCap: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  peRatio: number;
  dividendYield: number;
  lastUpdate: Date;
}

export class YahooFinanceAPI {
  private static readonly API_BASE = 'https://query2.finance.yahoo.com';
  private static readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  /**
   * Get current stock quote for a ticker
   */
  static async getQuote(ticker: string): Promise<StockQuote | null> {
    try {
      const url = `${this.API_BASE}/v10/finance/quoteSummary/${ticker}?modules=price`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
        },
      });

      const priceData = response.data.quoteSummary.result[0].price;

      return {
        ticker,
        price: priceData.regularMarketPrice.raw,
        currency: priceData.currency,
        marketCap: priceData.marketCap.raw,
        dayChange: priceData.regularMarketChange.raw,
        dayChangePercent: priceData.regularMarketChangePercent.raw,
        volume: priceData.regularMarketVolume.raw,
        dayHigh: priceData.regularMarketDayHigh.raw,
        dayLow: priceData.regularMarketDayLow.raw,
        fiftyTwoWeekHigh: priceData.fiftyTwoWeekHigh.raw,
        fiftyTwoWeekLow: priceData.fiftyTwoWeekLow.raw,
        peRatio: priceData.trailingPE?.raw || 0,
        dividendYield: priceData.dividendYield?.raw || 0,
        lastUpdate: new Date(),
      };
    } catch (error) {
      console.error(`Failed to fetch quote for ${ticker}:`, error);
      return null;
    }
  }

  /**
   * Get multiple stock quotes
   */
  static async getQuotes(tickers: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];

    for (const ticker of tickers) {
      const quote = await this.getQuote(ticker);
      if (quote) {
        quotes.push(quote);
      }
      // Rate limiting - avoid hitting API too hard
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return quotes;
  }

  /**
   * Get historical price data
   */
  static async getHistoricalPrices(
    ticker: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    try {
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      const url =
        `${this.API_BASE}/v7/finance/download/${ticker}` +
        `?period1=${startTimestamp}&period2=${endTimestamp}` +
        `&interval=1d&events=history&includeAdjustedClose=true`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
        },
      });

      // Parse CSV response
      const lines = response.data.split('\n');
      const headers = lines[0].split(',');
      const prices = [];

      for (let i = 1; i < lines.length - 1; i++) {
        const values = lines[i].split(',');
        prices.push({
          date: values[0],
          open: parseFloat(values[1]),
          high: parseFloat(values[2]),
          low: parseFloat(values[3]),
          close: parseFloat(values[4]),
          volume: parseInt(values[6]),
        });
      }

      return prices;
    } catch (error) {
      console.error(
        `Failed to fetch historical prices for ${ticker}:`,
        error
      );
      return [];
    }
  }

  /**
   * Build Yahoo Finance profile URL
   */
  static getProfileUrl(ticker: string): string {
    return `https://finance.yahoo.com/quote/${ticker}`;
  }
}

export default YahooFinanceAPI;
