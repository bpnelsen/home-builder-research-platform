/**
 * SEC Edgar API Integration
 * Fetches 10-K and 10-Q filings for home builders
 */

import axios from 'axios';

interface EdgarFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  filedUrl: string;
  rawUrl: string;
}

interface CompanyFacts {
  cik: string;
  entityName: string;
  facts: Record<string, any>;
}

const EDGAR_API_BASE = 'https://data.sec.gov/api/xbrl';
const EDGAR_BASE = 'https://www.sec.gov';

export class EdgarAPI {
  /**
   * Get CIK number for company (SEC Central Index Key)
   */
  static async getCIK(ticker: string): Promise<string | null> {
    try {
      const response = await axios.get(
        `${EDGAR_API_BASE}/companyfacts/CIK0000${ticker}.json`
      );
      return response.data.cik_str;
    } catch (error) {
      console.error(`Failed to get CIK for ${ticker}:`, error);
      return null;
    }
  }

  /**
   * Search for 10-K filings by company CIK
   */
  static async search10K(cik: string, limit = 5): Promise<EdgarFiling[]> {
    try {
      const response = await axios.get(
        `${EDGAR_API_BASE}/submissions/CIK${cik.padStart(10, '0')}.json`
      );

      const filings = response.data.filings.recent.filter(
        (f: any) => f.form === '10-K'
      );

      return filings.slice(0, limit).map((f: any) => ({
        accessionNumber: f.accessionNumber,
        filingDate: f.filingDate,
        reportDate: f.reportDate,
        form: f.form,
        filedUrl: `${EDGAR_BASE}/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=10-K&dateb=&owner=exclude&count=100`,
        rawUrl: `${EDGAR_BASE}/Archives/${f.primaryDocument}`,
      }));
    } catch (error) {
      console.error(`Failed to search 10-K for CIK ${cik}:`, error);
      return [];
    }
  }

  /**
   * Get company facts (financial data) from Edgar
   */
  static async getCompanyFacts(cik: string): Promise<CompanyFacts | null> {
    try {
      const response = await axios.get(
        `${EDGAR_API_BASE}/companyfacts/CIK${cik.padStart(10, '0')}.json`
      );

      return {
        cik: response.data.cik_str,
        entityName: response.data.entityName,
        facts: response.data.facts,
      };
    } catch (error) {
      console.error(`Failed to get company facts for CIK ${cik}:`, error);
      return null;
    }
  }

  /**
   * Extract key financial metrics from 10-K filing
   * Common metrics: Revenue, Net Income, Operating Margin, etc.
   */
  static async extract10KMetrics(filingUrl: string): Promise<Record<string, any>> {
    try {
      const response = await axios.get(filingUrl);
      const html = response.data;

      // This is simplified - real implementation would parse SEC HTML
      // We'd look for key metrics in the filing
      return {
        revenue: this.extractValue(html, 'total revenues'),
        netIncome: this.extractValue(html, 'net income'),
        operatingMargin: this.extractValue(html, 'operating margin'),
        grossMargin: this.extractValue(html, 'gross margin'),
      };
    } catch (error) {
      console.error(`Failed to extract metrics from ${filingUrl}:`, error);
      return {};
    }
  }

  /**
   * Helper to extract values from text
   */
  private static extractValue(text: string, pattern: string): string | null {
    const regex = new RegExp(`${pattern}[:\s]+([0-9,%.]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Check for new filings since last update
   */
  static async checkForNewFilings(
    cik: string,
    sinceDate: Date
  ): Promise<EdgarFiling[]> {
    const filings = await this.search10K(cik, 10);
    return filings.filter(
      (f) => new Date(f.filingDate) > sinceDate
    );
  }
}

// Ticker to CIK mapping for major home builders
export const HOME_BUILDERS = {
  LEN: 'Lennar Corporation',
  DHI: 'D.R. Horton Inc',
  KBH: 'KB Home',
  TOL: 'Toll Brothers Inc',
  PHM: 'PulteGroup Inc',
  NVR: 'NVR Inc',
  TRI: 'Tri Pointe Homes Inc',
  MHO: 'M.D.C. Holdings Inc',
  TPH: 'Toll Brothers Inc',
  CVCO: 'Cavco Industries Inc',
  LGIH: 'LGI Homes Inc',
  ORE: 'Orion Group Holdings Inc',
  LSL: 'Limoneira Company',
  BZH: 'Beazer Homes USA Inc',
  UVV: 'Universal Technical Institute Inc',
};

export default EdgarAPI;
