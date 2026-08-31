'use client';

import React, { useState } from 'react';
import { MatchCard } from '@/components/MatchCard';
import { MOCK_MATCHES } from '@/lib/mockData';

export default function FixturesPage() {
  const [filter, setFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Completed'>('All');

  const matches = MOCK_MATCHES.filter((m) => {
    if (filter === 'Live') return m.status === 'Live' || m.status === 'Half Time';
    if (filter === 'Upcoming') return m.status === 'Scheduled';
    if (filter === 'Completed') return m.status === 'Completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-wide uppercase">MATCH FIXTURES</h1>
        <p className="text-xs sm:text-sm text-gray-400">Schedule, live scoring status and match venues for Season 04</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#232B3E] pb-3 overflow-x-auto">
        {(['All', 'Live', 'Upcoming', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              filter === tab
                ? 'bg-[#E5A93C] text-black shadow-md'
                : 'bg-[#141923] text-gray-400 hover:text-white border border-[#232B3E]'
            }`}
          >
            {tab} {tab === 'Live' && '🔴'}
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-12 text-center text-gray-500">
          No matches found for the selected filter.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
