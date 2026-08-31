'use client';

import React from 'react';
import { MOCK_TEAMS } from '@/lib/mockData';
import Link from 'next/link';

export default function TeamsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-wide uppercase">TEAMS</h1>
        <p className="text-xs sm:text-sm text-gray-400">Participating squads in IMC League Season 04</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_TEAMS.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="group bg-[#141923] border border-[#232B3E] hover:border-[#E5A93C] rounded-xl p-6 transition-all shadow-lg flex flex-col items-center text-center space-y-4"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl text-black shadow-lg group-hover:scale-110 transition-transform"
              style={{ backgroundColor: team.color_hex }}
            >
              {team.short_name}
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white group-hover:text-[#E5A93C] transition-colors">
                {team.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Captain: {team.captain_name || 'Unassigned'}</p>
            </div>

            <div className="w-full pt-4 border-t border-[#1C2333] text-xs text-gray-400 flex items-center justify-between">
              <span>Coach: {team.coach_name || 'N/A'}</span>
              <span className="text-[#E5A93C] font-bold group-hover:underline">View Squad →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
