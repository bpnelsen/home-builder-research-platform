'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Mail, Check } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Alerts() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Insert subscription
      const { error: dbError } = await supabase.from('alert_subscriptions').insert({
        email,
        alert_types: ['10-K Filed', 'Earnings Call'],
        active: true,
      });

      if (dbError) throw dbError;

      // Send confirmation email via API
      const confirmResponse = await fetch('/api/alerts/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!confirmResponse.ok) {
        console.warn('Failed to send confirmation email');
      }

      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Get Alerts</h1>
      <p className="text-xl text-gray-600 mb-12">
        Be notified when home builders file new 10-K reports or announce earnings calls.
      </p>

      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Subscribe to Alerts</h2>

        {submitted ? (
          <div className="flex items-center gap-3 text-green-600 p-4 bg-green-50 rounded-lg">
            <Check className="w-6 h-6" />
            <div>
              <p className="font-semibold">Subscribed!</p>
              <p className="text-sm">Check your email to confirm.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-700 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="space-y-3">
              <p className="font-semibold text-gray-900">You'll get alerts for:</p>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" defaultChecked disabled className="w-5 h-5" />
                <span className="text-gray-700">New 10-K filings</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" defaultChecked disabled className="w-5 h-5" />
                <span className="text-gray-700">Earnings call announcements</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 font-semibold disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe to Alerts'}
            </button>
          </form>
        )}
      </div>

      <div className="mt-12 space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900">What You'll Receive</h3>
        <div className="grid gap-4">
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-2">📄 10-K Alerts</h4>
            <p className="text-gray-600">
              Get notified within 24 hours of a 10-K filing with AI-generated summary.
            </p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-2">📞 Earnings Calls</h4>
            <p className="text-gray-600">
              Alerts when earnings calls are announced with transcript links.
            </p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-2">✨ AI Insights</h4>
            <p className="text-gray-600">
              Summaries, highlights, and key metrics extracted automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
