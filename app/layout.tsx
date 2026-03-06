import type { Metadata } from 'next';
import { TrendingUp, BarChart3 } from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Home Builder Financial Research Platform',
  description: 'Enterprise-grade AI-powered financial research for residential home builders. Track 10-K filings, earnings calls, and real-time market data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Premium Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-navy-700 to-teal-500 rounded-lg group-hover:shadow-lg transition">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-navy-700 to-teal-500 bg-clip-text text-transparent">Builder Research</span>
                  <span className="text-xs text-gray-600">Financial Intelligence</span>
                </div>
              </a>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-8">
                <a 
                  href="/" 
                  className="text-sm font-medium text-gray-700 hover:text-navy-700 transition relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-navy-700 to-teal-500 group-hover:w-full transition-all duration-300" />
                </a>
                <a 
                  href="/compare" 
                  className="text-sm font-medium text-gray-700 hover:text-navy-700 transition relative group"
                >
                  Compare
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-navy-700 to-teal-500 group-hover:w-full transition-all duration-300" />
                </a>
                <a 
                  href="/alerts" 
                  className="text-sm font-medium text-gray-700 hover:text-navy-700 transition relative group"
                >
                  Email Alerts
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-navy-700 to-teal-500 group-hover:w-full transition-all duration-300" />
                </a>
              </div>

              {/* CTA Button */}
              <a 
                href="/alerts"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-navy-700 to-navy-800 text-white rounded-lg hover:shadow-lg hover:from-navy-800 hover:to-navy-900 transition-all font-medium text-sm"
              >
                <TrendingUp className="w-4 h-4" />
                Subscribe
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-160px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </div>
        </main>

        {/* Professional Footer */}
        <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* About */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">About</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Enterprise financial research platform for home builders with real-time data, AI analysis, and market intelligence.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><a href="/" className="hover:text-navy-700 transition">Home Builders</a></li>
                  <li><a href="/compare" className="hover:text-navy-700 transition">Compare Builders</a></li>
                  <li><a href="/alerts" className="hover:text-navy-700 transition">Email Alerts</a></li>
                </ul>
              </div>

              {/* Data Sources */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Data Sources</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><a href="https://www.sec.gov" target="_blank" rel="noopener noreferrer" className="hover:text-navy-700 transition">SEC Edgar</a></li>
                  <li><a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="hover:text-navy-700 transition">Yahoo Finance</a></li>
                  <li><a href="https://www.anthropic.com" target="_blank" rel="noopener noreferrer" className="hover:text-navy-700 transition">Claude AI</a></li>
                </ul>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">All systems operational</span>
                  </div>
                  <p className="text-xs text-gray-500">Updated daily • Real-time data</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                © 2026 Home Builder Financial Research Platform. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Enterprise v1.0</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>Last updated: Today</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
