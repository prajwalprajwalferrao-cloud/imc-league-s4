'use client';

import { useEffect, useState } from 'react';
import { getTeams } from '@/lib/firestore/teams';
import { getMatches } from '@/lib/firestore/matches';
import { calculateStandings } from '@/lib/standings';
import { Team, Match, StandingRow } from '@/lib/types';
import StandingsTable from '@/components/StandingsTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function StandingsPage() {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
        setStandings(calculateStandings(teams, matches));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">League <span className="text-[#E5A93C]">Standings</span></h1>
        <p className="text-gray-400 text-sm">Official rankings based on Net Run Rate (NRR). Points: Win (2), No Result (1), Loss (0).</p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <StandingsTable standings={standings} />
      )}
      
      <div className="bg-[#141923] p-4 rounded-lg border border-[#232B3E] mt-8 text-xs text-gray-400 space-y-2">
        <h4 className="font-bold text-white uppercase">Tie-breaking Rules:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Total Points</li>
          <li>Net Run Rate (NRR)</li>
          <li>Total Runs Scored</li>
        </ol>
      </div>
    </div>
  );
}
