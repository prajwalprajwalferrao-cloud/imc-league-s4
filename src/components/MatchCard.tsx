import React from 'react';
import { Match } from '@/lib/types';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
  showDetails?: boolean;
}

export function MatchCard({ match, showDetails = true }: MatchCardProps) {
  const isLive = match.status === 'Live' || match.status === 'Half Time';
  const isCompleted = match.status === 'Completed';

  return (
    <div className={`relative bg-[#141923] border ${isLive ? 'border-[#FF3B30] glow-live' : 'border-[#232B3E] hover:border-[#E5A93C]/50'} rounded-xl p-4 sm:p-5 transition-all`}>
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-semibold mb-3 border-b border-[#1E2638] pb-2">
        <div className="flex items-center space-x-2">
          {isLive ? (
            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40 font-extrabold animate-pulse-live">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
              <span>LIVE {match.current_minute && `• ${match.current_minute}`}</span>
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
              isCompleted ? 'bg-[#1C2333] text-gray-400' : 'bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/30'
            }`}>
              {match.status}
            </span>
          )}
          <span className="text-gray-400 font-normal hidden sm:inline">Round {match.round_number}</span>
        </div>

        <div className="text-gray-400 text-right">
          <span>{format(new Date(match.match_date), 'MMM dd, HH:mm')}</span>
        </div>
      </div>

      {/* Teams Score Grid */}
      <div className="grid grid-cols-7 items-center gap-2 py-2">
        {/* Home Team */}
        <div className="col-span-3 flex items-center justify-end space-x-3 text-right">
          <span className="font-extrabold text-sm sm:text-base text-white truncate">
            {match.home_team?.name || 'Home Team'}
          </span>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-black shadow-md flex-shrink-0"
            style={{ backgroundColor: match.home_team?.color_hex || '#E5A93C' }}
          >
            {match.home_team?.short_name || 'HOME'}
          </div>
        </div>

        {/* Score Center */}
        <div className="col-span-1 flex flex-col items-center justify-center bg-[#0B0E14] py-2 px-1 rounded-lg border border-[#1E2638]">
          {isLive || isCompleted ? (
            <div className="text-xl sm:text-2xl font-black tracking-widest text-[#FFC857] flex items-center space-x-1">
              <span>{match.home_score}</span>
              <span className="text-gray-600 text-base">-</span>
              <span>{match.away_score}</span>
            </div>
          ) : (
            <span className="text-xs font-black text-[#E5A93C] tracking-wider uppercase">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div className="col-span-3 flex items-center justify-start space-x-3 text-left">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-black shadow-md flex-shrink-0"
            style={{ backgroundColor: match.away_team?.color_hex || '#0A84FF' }}
          >
            {match.away_team?.short_name || 'AWAY'}
          </div>
          <span className="font-extrabold text-sm sm:text-base text-white truncate">
            {match.away_team?.name || 'Away Team'}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      {showDetails && (
        <div className="mt-3 pt-2 border-t border-[#1E2638] flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center space-x-1 truncate">
            <svg className="w-3.5 h-3.5 text-[#E5A93C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{match.venue}</span>
          </div>
        </div>
      )}
    </div>
  );
}
