'use client';

import React from 'react';
import { MatchCard } from '@/components/MatchCard';
import { MOCK_MATCHES } from '@/lib/mockData';

export default function ResultsPage() {
  const completedMatches = MOCK_MATCHES.filter((m) => m.status === 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-wide uppercase">MATCH RESULTS</h1>
        <p className="text-xs sm:text-sm text-gray-400">Official finalized scores and match archives</p>
      </div>

      {completedMatches.length === 0 ? (
        <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-12 text-center text-gray-500">
          No completed matches yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {completedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
