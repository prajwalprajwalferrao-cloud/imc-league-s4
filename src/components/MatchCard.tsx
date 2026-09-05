'use client';

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
    getTeams().then(teams => {
      setHomeTeam(teams.find(t => t.id === match.home_team_id) || null);
      setAwayTeam(teams.find(t => t.id === match.away_team_id) || null);
    });
  }, [match.home_team_id, match.away_team_id]);

  const isLive = match.status === 'Live';
  const isCompleted = match.status === 'Completed';
  const homeWon = isCompleted && match.home_score > match.away_score;
  const awayWon = isCompleted && match.away_score > match.home_score;

  const resultText = isCompleted && homeTeam && awayTeam
    ? getMatchResult(match, homeTeam.short_name, awayTeam.short_name)
    : '';

  return (
    <div className={`glass-card rounded-xl overflow-hidden transition-all hover:border-[#E5A93C]/40 group ${isLive ? 'border-red-500/40 glow-red' : ''}`}>
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#0B0E14]/60 border-b border-[#232B3E]/50">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider">
          {match.date} • {match.time} {match.venue ? `• ${match.venue}` : ''}
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
          isLive ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
          isCompleted ? 'text-gray-500' :
          'text-[#E5A93C]/70'
        }`}>
          {isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />}
          {match.status}
        </span>
      </div>

      {/* Teams */}
      <div className="p-4 space-y-3">
        {/* Home Team Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B0E14] border border-[#2D384E] flex items-center justify-center overflow-hidden flex-shrink-0"
              style={homeTeam?.colour ? {borderColor: homeTeam.colour + '40'} : {}}>
              {homeTeam?.logo_url
                ? <img src={homeTeam.logo_url} alt="" className="w-full h-full object-cover" />
                : <span className="text-[10px] font-black" style={{color: homeTeam?.colour || '#fff'}}>{homeTeam?.short_name}</span>
              }
            </div>
            <span className={`text-sm font-bold truncate ${homeWon ? 'text-white' : 'text-gray-300'}`}>
              {homeTeam?.name || 'TBA'}
            </span>
          </div>
          {(isLive || isCompleted) && (
            <span className={`font-mono text-sm font-black tabular-nums ${homeWon ? 'text-[#E5A93C]' : 'text-gray-400'}`}>
              {formatScore(match.home_score, match.home_wickets, isLive ? match.home_overs : undefined)}
            </span>
          )}
        </div>

        {/* Away Team Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B0E14] border border-[#2D384E] flex items-center justify-center overflow-hidden flex-shrink-0"
              style={awayTeam?.colour ? {borderColor: awayTeam.colour + '40'} : {}}>
              {awayTeam?.logo_url
                ? <img src={awayTeam.logo_url} alt="" className="w-full h-full object-cover" />
                : <span className="text-[10px] font-black" style={{color: awayTeam?.colour || '#fff'}}>{awayTeam?.short_name}</span>
              }
            </div>
            <span className={`text-sm font-bold truncate ${awayWon ? 'text-white' : 'text-gray-300'}`}>
              {awayTeam?.name || 'TBA'}
            </span>
          </div>
          {(isLive || isCompleted) && (
            <span className={`font-mono text-sm font-black tabular-nums ${awayWon ? 'text-[#E5A93C]' : 'text-gray-400'}`}>
              {formatScore(match.away_score, match.away_wickets, isLive ? match.away_overs : undefined)}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      {showDetails && (
        <div className="px-4 py-2.5 border-t border-[#232B3E]/50 bg-[#0B0E14]/30 text-center">
          {isCompleted ? (
            <span className="text-[11px] font-bold text-[#E5A93C]">{resultText}</span>
          ) : (
            <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors">View Details →</span>
          )}
        </div>
      )}
    </div>
  );
}
