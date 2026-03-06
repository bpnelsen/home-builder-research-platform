/**
 * Claude AI Integration
 * Summarizes 10-K filings and earnings call transcripts
 * Extracts key metrics, headwinds, tailwinds, and highlights
 */

import axios from 'axios';

interface SummaryResult {
  summary: string;
  keyMetrics: Record<string, any>;
  headwinds: string[];
  tailwinds: string[];
  highlights: string[];
  markets?: string[];
}

interface EarningsAnalysis {
  summary: string;
  highlights: string[];
  ceoQuotes: string[];
  cfoQuotes: string[];
  keyMetrics: Record<string, any>;
}

export class ClaudeAI {
  private static readonly API_URL = 'https://api.anthropic.com/v1/messages';
  private static readonly MODEL = 'claude-3-5-sonnet-20241022';
  private static readonly API_KEY = process.env.CLAUDE_API_KEY;

  /**
   * Summarize 10-K filing with AI
   */
  static async summarize10K(
    filingContent: string,
    companyName: string,
    fiscalYear: number
  ): Promise<SummaryResult> {
    const prompt = `You are a financial analyst. Analyze this 10-K filing for ${companyName} (${fiscalYear}) and provide:

1. A 2-3 paragraph executive summary of key business highlights
2. Key financial metrics (revenue, net income, margins, returns)
3. Major business headwinds (challenges, risks)
4. Business tailwinds (opportunities, growth drivers)
5. Geographic markets being focused on

Format your response as valid JSON with these exact keys:
{
  "summary": "...",
  "keyMetrics": { "revenue": "...", "netIncome": "...", "operatingMargin": "...", "grossMargin": "..." },
  "headwinds": ["...", "..."],
  "tailwinds": ["...", "..."],
  "markets": ["...", "..."]
}

10-K CONTENT:
${filingContent.substring(0, 10000)}`;

    return this.sendMessage(prompt);
  }

  /**
   * Analyze earnings call transcript
   */
  static async analyzeEarningsCall(
    transcript: string,
    companyName: string,
    quarterDate: string
  ): Promise<EarningsAnalysis> {
    const prompt = `You are a financial analyst. Analyze this earnings call transcript for ${companyName} (${quarterDate}) and provide:

1. A 2-3 paragraph summary of the call highlights and guidance
2. Top 5 key highlights from management commentary
3. Key CEO quotes (1-3 direct quotes)
4. Key CFO quotes about financials (1-3 direct quotes)
5. Key financial metrics mentioned

Format your response as valid JSON:
{
  "summary": "...",
  "highlights": ["...", "..."],
  "ceoQuotes": ["...", "..."],
  "cfoQuotes": ["...", "..."],
  "keyMetrics": { "revenue": "...", "eps": "...", "guidance": "..." }
}

TRANSCRIPT:
${transcript.substring(0, 10000)}`;

    return this.sendMessage(prompt);
  }

  /**
   * Extract key financial metrics from document
   */
  static async extractMetrics(content: string): Promise<Record<string, any>> {
    const prompt = `Extract the following financial metrics from this document. Return only the JSON object with the metrics found.

{
  "totalRevenue": number or null,
  "netIncome": number or null,
  "operatingIncome": number or null,
  "grossMargin": number or null,
  "operatingMargin": number or null,
  "netMargin": number or null,
  "homesDelivered": number or null,
  "averageSellingPrice": number or null,
  "returnOnEquity": number or null,
  "bookValue": number or null,
  "debtToEquity": number or null
}

DOCUMENT:
${content.substring(0, 5000)}`;

    return this.sendMessage(prompt);
  }

  /**
   * Send message to Claude API
   */
  private static async sendMessage(prompt: string): Promise<any> {
    try {
      if (!this.API_KEY) {
        throw new Error('CLAUDE_API_KEY not set');
      }

      const response = await axios.post(
        this.API_URL,
        {
          model: this.MODEL,
          max_tokens: 2048,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'x-api-key': this.API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
        }
      );

      const content = response.data.content[0].text;

      // Parse JSON from response
      try {
        return JSON.parse(content);
      } catch (e) {
        // If not valid JSON, return as string
        return { raw: content };
      }
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  /**
   * Identify business headwinds and tailwinds
   */
  static async identifyHeadwindsTailwinds(
    content: string,
    companyName: string
  ): Promise<{ headwinds: string[]; tailwinds: string[] }> {
    const prompt = `For ${companyName}, identify major business headwinds (risks, challenges) and tailwinds (opportunities, growth drivers) from this document.

Return JSON:
{
  "headwinds": ["...", "..."],
  "tailwinds": ["...", "..."]
}

CONTENT:
${content.substring(0, 8000)}`;

    return this.sendMessage(prompt);
  }

  /**
   * Identify geographic markets
   */
  static async identifyMarkets(content: string): Promise<string[]> {
    const prompt = `List all geographic markets mentioned in this document. Return only a JSON array of market names.

["Market 1", "Market 2", ...]

CONTENT:
${content.substring(0, 5000)}`;

    const result = await this.sendMessage(prompt);
    return Array.isArray(result) ? result : [];
  }
}

export default ClaudeAI;
