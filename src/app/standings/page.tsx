'use client';

import React from 'react';
import { StandingsTable } from '@/components/StandingsTable';
import { MOCK_TEAMS, MOCK_MATCHES } from '@/lib/mockData';
import { calculateStandings } from '@/lib/standings';

export default function StandingsPage() {
  const standings = calculateStandings(MOCK_TEAMS, MOCK_MATCHES);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-wide uppercase">LEAGUE STANDINGS</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Official auto-calculated points table for IMC League Season 04
        </p>
      </div>

      <StandingsTable standings={standings} />

      {/* Rules Legend */}
      <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-4 text-xs text-gray-400 flex flex-wrap gap-4 justify-between">
        <div><strong className="text-white">P</strong> = Played</div>
        <div><strong className="text-white">W</strong> = Wins (3 pts)</div>
        <div><strong className="text-white">D</strong> = Draws (1 pt)</div>
        <div><strong className="text-white">L</strong> = Losses (0 pts)</div>
        <div><strong className="text-white">GF</strong> = Goals For</div>
        <div><strong className="text-white">GA</strong> = Goals Against</div>
        <div><strong className="text-white">GD</strong> = Goal Difference</div>
      </div>
    </div>
  );
}
