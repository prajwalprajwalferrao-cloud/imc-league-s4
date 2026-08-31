'use client';

import React from 'react';
import { MOCK_TEAMS, MOCK_MATCHES } from '@/lib/mockData';
import { MatchCard } from '@/components/MatchCard';
import Link from 'next/link';

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = MOCK_TEAMS.find((t) => t.id === params.id) || MOCK_TEAMS[0];
  const teamMatches = MOCK_MATCHES.filter(
    (m) => m.home_team_id === team.id || m.away_team_id === team.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Team Header Banner */}
      <div className="bg-gradient-to-r from-[#141923] via-[#1A2232] to-[#141923] border border-[#232B3E] rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div
          className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: team.color_hex }}
        ></div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 relative z-10 text-center sm:text-left">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center font-black text-3xl text-black shadow-xl"
            style={{ backgroundColor: team.color_hex }}
          >
            {team.short_name}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">{team.name}</h1>
            <p className="text-gray-300 text-sm max-w-xl">{team.description}</p>
            
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-gray-400 justify-center sm:justify-start">
              <span className="bg-[#0B0E14] px-3 py-1 rounded border border-[#232B3E]">
                Captain: <strong className="text-white">{team.captain_name || 'N/A'}</strong>
              </span>
              <span className="bg-[#0B0E14] px-3 py-1 rounded border border-[#232B3E]">
                Vice Captain: <strong className="text-white">{team.vice_captain_name || 'N/A'}</strong>
              </span>
              <span className="bg-[#0B0E14] px-3 py-1 rounded border border-[#232B3E]">
                Coach: <strong className="text-white">{team.coach_name || 'N/A'}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Matches */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">TEAM MATCHES & FIXTURES</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {teamMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}
