'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BuilderDetail({ params }: { params: { id: string } }) {
  const [builder, setBuilder] = useState<any>(null);
  const [filings, setFilings] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'10k' | 'earnings'>('10k');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get builder
        const { data: builderData } = await supabase
          .from('builders')
          .select('*')
          .eq('id', params.id)
          .single();

        setBuilder(builderData);

        // Get 10-K filings
        const { data: filingData } = await supabase
          .from('filings_10k')
          .select('*')
          .eq('builder_id', params.id)
          .order('filing_date', { ascending: false });

        setFilings(filingData || []);

        // Get earnings calls
        const { data: earningsData } = await supabase
          .from('earnings_calls')
          .select('*')
          .eq('builder_id', params.id)
          .order('call_date', { ascending: false })
          .limit(4);

        setEarnings(earningsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading || !builder) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{builder.name}</h1>
        <div className="flex gap-4 items-center">
          <span className="text-lg font-semibold text-navy-700">{builder.ticker}</span>
          {builder.website && (
            <a
              href={builder.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-navy-600 hover:text-navy-700"
            >
              Visit Website <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        {builder.markets && (
          <div className="mt-4 flex flex-wrap gap-2">
            {builder.markets.map((market: string) => (
              <span key={market} className="px-3 py-1 bg-navy-100 text-navy-700 rounded-full text-sm">
                {market}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('10k')}
            className={`py-4 px-2 border-b-2 font-semibold transition ${
              activeTab === '10k'
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            10-K Filings ({filings.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`py-4 px-2 border-b-2 font-semibold transition ${
              activeTab === 'earnings'
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Earnings Calls ({earnings.length})
          </button>
        </div>
      </div>

      {/* 10-K Filings */}
      {activeTab === '10k' && (
        <div className="space-y-6">
          {filings.length === 0 ? (
            <p className="text-gray-500">No 10-K filings found.</p>
          ) : (
            filings.map((filing) => (
              <Link
                key={filing.id}
                href={`/builders/${builder.id}/10k/${filing.fiscal_year}`}
                className="card p-6 hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Fiscal Year {filing.fiscal_year}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(filing.filing_date).toLocaleDateString()}
                  </span>
                </div>

                {filing.summary && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{filing.summary}</p>
                )}

                {filing.key_metrics && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {Object.entries(filing.key_metrics as Record<string, any>)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="metric-box">
                          <p className="text-xs text-gray-600 uppercase">{key}</p>
                          <p className="text-lg font-semibold text-gray-900">{String(value)}</p>
                        </div>
                      ))}
                  </div>
                )}

                <div className="text-navy-600 hover:text-navy-700 font-semibold">
                  View Full Report →
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Earnings Calls */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          {earnings.length === 0 ? (
            <p className="text-gray-500">No earnings calls found.</p>
          ) : (
            earnings.map((call) => (
              <Link
                key={call.id}
                href={`/builders/${builder.id}/earnings/${call.id}`}
                className="card p-6 hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Q{call.fiscal_quarter} {call.fiscal_year}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(call.call_date).toLocaleDateString()}
                  </span>
                </div>

                {call.ai_summary && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{call.ai_summary}</p>
                )}

                {call.key_highlights && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Key Highlights</p>
                    <ul className="space-y-1">
                      {call.key_highlights.slice(0, 3).map((highlight: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">
                          • {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-navy-600 hover:text-navy-700 font-semibold">
                  Read Transcript →
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
