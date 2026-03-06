'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Compare() {
  const [builders, setBuilders] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const fetchBuilders = async () => {
      const { data } = await supabase.from('builders').select('*').order('name');
      setBuilders(data || []);
    };

    fetchBuilders();
  }, []);

  const toggleBuilder = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Compare Builders</h1>

      {/* Builder Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {builders.map((builder) => (
          <button
            key={builder.id}
            onClick={() => toggleBuilder(builder.id)}
            className={`card p-4 text-left transition ${
              selected.includes(builder.id)
                ? 'ring-2 ring-navy-700 bg-navy-50'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(builder.id)}
                readOnly
                className="w-5 h-5 text-navy-700 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">{builder.name}</p>
                <p className="text-sm text-gray-500">{builder.ticker}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparison</h2>
          <p className="text-gray-600">
            Detailed comparison metrics coming soon. Selected: {selected.length} builders
          </p>
        </div>
      )}

      {selected.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Select 2 or more builders to compare their metrics, stock performance, and 10-K data.
        </div>
      )}
    </div>
  );
}
