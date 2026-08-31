'use client';

import React from 'react';
import { MOCK_MATCHES, MOCK_TEAMS } from '@/lib/mockData';
import { calculateStandings } from '@/lib/standings';

export default function StatisticsPage() {
  const standings = calculateStandings(MOCK_TEAMS, MOCK_MATCHES);
  const leader = standings[0]?.team;

  const totalMatchesPlayed = MOCK_MATCHES.filter((m) => m.status === 'Completed').length;
  const totalGoalsScored = MOCK_MATCHES.reduce((acc, m) => acc + m.home_score + m.away_score, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-wide uppercase">LEAGUE STATISTICS</h1>
        <p className="text-xs sm:text-sm text-gray-400">Season 04 key performance metrics and leaderboard insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Matches Played" value={totalMatchesPlayed} icon="⚽" />
        <StatCard title="Total Goals / Points Scored" value={totalGoalsScored} icon="🔥" />
        <StatCard title="Current League Leader" value={leader?.name || 'N/A'} icon="🏆" highlight />
        <StatCard title="Active Teams" value={MOCK_TEAMS.length} icon="🛡️" />
      </div>

      {/* Leaderboard Summary */}
      <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-extrabold text-white uppercase tracking-wider">Top Performing Squads</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {standings.slice(0, 3).map((item, idx) => (
            <div key={item.team.id} className="bg-[#0B0E14] border border-[#232B3E] p-4 rounded-lg flex items-center space-x-3">
              <div className="text-2xl font-black text-[#E5A93C]">#{idx + 1}</div>
              <div>
                <h4 className="font-extrabold text-white">{item.team.name}</h4>
                <p className="text-xs text-gray-400">{item.points} Points • {item.won} Wins</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, highlight }: { title: string; value: string | number; icon: string; highlight?: boolean }) {
  return (
    <div className={`bg-[#141923] border ${highlight ? 'border-[#E5A93C] glow-gold' : 'border-[#232B3E]'} rounded-xl p-6 space-y-2`}>
      <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
        <span>{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl font-black text-white tracking-tight">{value}</div>
    </div>
  );
}
