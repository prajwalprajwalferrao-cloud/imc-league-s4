'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMatch, subscribeToMatch } from '@/lib/supabase/matches';
import { getTeams } from '@/lib/supabase/teams';
import { Match, Team } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatScore, getMatchResult } from '@/lib/matchUtils';

export default function MatchDetailPage({ params }: { params: { matchId: string } }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    async function loadData() {
      try {
        const [m, teams] = await Promise.all([
          getMatch(params.matchId),
          getTeams()
        ]);
        if (m) {
          setMatch(m);
          setHomeTeam(teams.find(t => t.id === m.home_team_id) || null);
          setAwayTeam(teams.find(t => t.id === m.away_team_id) || null);
        }
        unsubscribe = subscribeToMatch(params.matchId, (updated) => {
          if (updated) setMatch(updated);
        });
      } catch (err) {
        console.error('Failed to load match detail', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [params.matchId]);

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;
  if (!match || !homeTeam || !awayTeam) return (
    <div className="py-20 text-center text-gray-400">
      <h2 className="text-xl font-bold">Match not found</h2>
      <Link href="/fixtures" className="text-[#E5A93C] hover:underline mt-4 inline-block">Back to Fixtures</Link>
    </div>
  );

  const isLive = match.status === 'Live';
  const isCompleted = match.status === 'Completed';
  const resultText = isCompleted ? getMatchResult(match, homeTeam.short_name, awayTeam.short_name) : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-slide-up">
      {/* Back button */}
      <Link href="/fixtures" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">
        ← Back to All Fixtures
      </Link>

      {/* Main Scorecard Header */}
      <div className={`glass-card rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden ${
        isLive ? 'border-rose-500/50 glow-red' : 'border-[#232B3E]'
      }`}>
        {/* Match Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#232B3E]">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>ROUND {match.round}</span>
            <span className="mx-2">•</span>
            <span>{match.date}</span>
            <span className="mx-2">•</span>
            <span>{match.time}</span>
            {match.venue && (
              <>
                <span className="mx-2">•</span>
                <span className="text-gray-300">📍 {match.venue}</span>
              </>
            )}
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
            isLive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' :
            isCompleted ? 'bg-[#1C2333] text-gray-400 border border-[#2D384E]' :
            'bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/30'
          }`}>
            {isLive && <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5 align-middle" />}
            {match.status}
          </span>
        </div>

        {/* Big Teams Faceoff */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center py-10 gap-8 text-center">
          {/* Home */}
          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0B0E14] border-2 border-[#2D384E] flex items-center justify-center overflow-hidden shadow-xl"
              style={{ borderColor: homeTeam.colour ? `${homeTeam.colour}80` : '#2D384E' }}
            >
              {homeTeam.logo_url ? (
                <img src={homeTeam.logo_url} alt={homeTeam.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-white">{homeTeam.short_name}</span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{homeTeam.name}</h2>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{homeTeam.short_name}</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-white mt-1">
              {formatScore(match.home_score, match.home_wickets, match.home_overs > 0 ? match.home_overs : undefined)}
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#1C2333] border border-[#2D384E] flex items-center justify-center text-xs font-black text-[#E5A93C] shadow-inner mb-2">
              VS
            </div>
            {isCompleted && (
              <div className="mt-3 px-4 py-1.5 rounded-xl bg-[#0B0E14] border border-[#2D384E] text-xs font-black text-[#E5A93C] text-center max-w-[200px]">
                {resultText}
              </div>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0B0E14] border-2 border-[#2D384E] flex items-center justify-center overflow-hidden shadow-xl"
              style={{ borderColor: awayTeam.colour ? `${awayTeam.colour}80` : '#2D384E' }}
            >
              {awayTeam.logo_url ? (
                <img src={awayTeam.logo_url} alt={awayTeam.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-white">{awayTeam.short_name}</span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{awayTeam.name}</h2>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{awayTeam.short_name}</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-white mt-1">
              {formatScore(match.away_score, match.away_wickets, match.away_overs > 0 ? match.away_overs : undefined)}
            </div>
          </div>
        </div>

        {/* Live status banner */}
        {isLive && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Match in progress • Scores updated in real time
            </p>
          </div>
        )}
      </div>

      {/* Match Notes */}
      {match.notes && (
        <div className="glass-card p-6 rounded-2xl border border-[#232B3E]">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Match Notes</h4>
          <p className="text-sm text-gray-300">{match.notes}</p>
        </div>
      )}
    </div>
  );
}
