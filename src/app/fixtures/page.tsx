'use client';

import { useEffect, useState } from 'react';
import { getMatches } from '@/lib/supabase/matches';
import { Match } from '@/lib/types';
import MatchCard from '@/components/MatchCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function FixturesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const m = await getMatches();
        setMatches(m.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="py-12"><LoadingSpinner size="lg" /></div>;

  const liveMatches = matches.filter(m => m.status === 'Live');
  const upcomingMatches = matches.filter(m => m.status === 'Upcoming');
  const completedMatches = matches.filter(m => m.status === 'Completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Match <span className="text-[#E5A93C]">Center</span></h1>
        <p className="text-gray-400 text-sm">Live scores, upcoming fixtures, and recent results.</p>
      </div>

      {liveMatches.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-red-500 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map(match => <MatchCard key={match.id} match={match} />)}
          </div>
        </section>
      )}

      {upcomingMatches.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase border-b border-[#232B3E] pb-2">Upcoming Fixtures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map(match => <MatchCard key={match.id} match={match} />)}
          </div>
        </section>
      )}

      {completedMatches.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-400 uppercase border-b border-[#232B3E] pb-2">Recent Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity">
            {completedMatches.slice(0, 6).map(match => <MatchCard key={match.id} match={match} />)}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No matches found for this season yet.
        </div>
      )}
    </div>
  );
}
