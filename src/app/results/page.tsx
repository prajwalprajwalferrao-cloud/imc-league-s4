'use client';

import { useEffect, useState } from 'react';
import { getMatches } from '@/lib/supabase/matches';
import { Match } from '@/lib/types';
import MatchCard from '@/components/MatchCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ResultsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const m = await getMatches();
        setMatches(m.filter(match => match.status === 'Completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2 border-b border-[#232B3E] pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Match <span className="text-[#E5A93C]">Results</span></h1>
        <p className="text-gray-400 text-sm">All completed fixtures for the current season.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(match => <MatchCard key={match.id} match={match} />)}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-[#141923] rounded-xl border border-[#232B3E]">
          <p className="text-lg font-bold">No results yet.</p>
          <p className="text-sm mt-1">Check back after the first match is completed.</p>
        </div>
      )}
    </div>
  );
}
