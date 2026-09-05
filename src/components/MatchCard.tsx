import Link from 'next/link';
import { Match, Team } from '@/lib/types';
import { getTeams } from '@/lib/supabase/teams';
import { useEffect, useState } from 'react';
import { formatScore, getMatchResult } from '@/lib/matchUtils';

interface Props {
  match: Match;
  showDetails?: boolean;
}

export default function MatchCard({ match, showDetails = true }: Props) {
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);

  useEffect(() => {
    // In a real app we'd fetch teams globally or pass them in to avoid N+1 queries.
    // Doing it here for component independence.
    getTeams().then(teams => {
      setHomeTeam(teams.find(t => t.id === match.home_team_id) || null);
      setAwayTeam(teams.find(t => t.id === match.away_team_id) || null);
    });
  }, [match.home_team_id, match.away_team_id]);

  const homeScoreStr = formatScore(match.home_score, match.home_wickets, match.status === 'Completed' ? undefined : match.home_overs);
  const awayScoreStr = formatScore(match.away_score, match.away_wickets, match.status === 'Completed' ? undefined : match.away_overs);
  
  const resultText = match.status === 'Completed' && homeTeam && awayTeam
    ? getMatchResult(match, homeTeam.short_name, awayTeam.short_name)
    : '';

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className={`bg-[#141923] rounded-xl border transition-all hover:bg-[#1A2130] group
        ${match.status === 'Live' ? 'border-[#FF3B30] shadow-[0_0_15px_-3px_rgba(255,59,48,0.2)]' : 'border-[#232B3E] hover:border-[#E5A93C]/50'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-[#232B3E] bg-[#0B0E14] rounded-t-xl">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
            {new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {match.time}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border
            ${match.status === 'Live' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 
              match.status === 'Completed' ? 'bg-[#1C2333] text-gray-400 border-transparent' : 
              'bg-[#1C2333] text-[#E5A93C] border-[#E5A93C]/20'}`}>
            {match.status}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-[#0B0E14] border border-[#2D384E] flex items-center justify-center overflow-hidden">
                {homeTeam?.logo_url ? <img src={homeTeam.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-[8px] font-bold text-white">{homeTeam?.short_name}</span>}
              </div>
              <span className={`font-bold text-sm ${match.status === 'Completed' && match.home_score > match.away_score ? 'text-white' : 'text-gray-300'}`}>
                {homeTeam?.name || 'TBA'}
              </span>
            </div>
            {(match.status === 'Live' || match.status === 'Completed') && (
              <span className={`font-mono text-sm font-bold ${match.status === 'Completed' && match.home_score > match.away_score ? 'text-white' : 'text-gray-400'}`}>
                {homeScoreStr}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-[#0B0E14] border border-[#2D384E] flex items-center justify-center overflow-hidden">
                {awayTeam?.logo_url ? <img src={awayTeam.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-[8px] font-bold text-white">{awayTeam?.short_name}</span>}
              </div>
              <span className={`font-bold text-sm ${match.status === 'Completed' && match.away_score > match.home_score ? 'text-white' : 'text-gray-300'}`}>
                {awayTeam?.name || 'TBA'}
              </span>
            </div>
            {(match.status === 'Live' || match.status === 'Completed') && (
              <span className={`font-mono text-sm font-bold ${match.status === 'Completed' && match.away_score > match.home_score ? 'text-white' : 'text-gray-400'}`}>
                {awayScoreStr}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        {showDetails && (
          <div className="px-4 py-2 border-t border-[#232B3E] bg-[#0B0E14]/50 rounded-b-xl text-[11px] font-bold text-gray-500 text-center">
            {match.status === 'Completed' ? (
              <span className="text-[#E5A93C]">{resultText}</span>
            ) : (
              <span>Match Center →</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
