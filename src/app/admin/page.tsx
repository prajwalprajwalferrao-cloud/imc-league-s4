'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams } from '@/lib/supabase/teams';
import { getPlayers } from '@/lib/supabase/players';
import { getMatches } from '@/lib/supabase/matches';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ teams: 0, players: 0, matches: 0, live: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [teams, players, matches] = await Promise.all([
          getTeams(),
          getPlayers(),
          getMatches()
        ]);
        
        setStats({
          teams: teams.length,
          players: players.length,
          matches: matches.length,
          live: matches.filter(m => m.status === 'Live').length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-[#141B29] via-[#101520] to-[#0D111A] border border-[#232B3E] shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/20 text-[#E5A93C] text-[11px] font-black uppercase tracking-widest mb-3">
            <span>🏏</span> IMC LEAGUE SEASON 4
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            League Operations <span className="text-gradient-gold">Center</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
            Manage franchise teams, player registrations, real-time live match scoring, and automatic round-robin fixtures.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-[#232B3E] hover:border-[#E5A93C]/40 transition-all group">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-black uppercase tracking-wider">Franchise Teams</span>
            <span className="text-xl group-hover:scale-110 transition-transform">🛡️</span>
          </div>
          <p className="text-4xl font-black text-white mt-4 tracking-tight">{stats.teams}</p>
          <div className="mt-4 pt-4 border-t border-[#1F2637] flex items-center justify-between">
            <Link href="/admin/teams" className="text-xs font-bold text-[#E5A93C] hover:underline">
              Manage Teams →
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-[#232B3E] hover:border-[#E5A93C]/40 transition-all group">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-black uppercase tracking-wider">Registered Players</span>
            <span className="text-xl group-hover:scale-110 transition-transform">👤</span>
          </div>
          <p className="text-4xl font-black text-white mt-4 tracking-tight">{stats.players}</p>
          <div className="mt-4 pt-4 border-t border-[#1F2637] flex items-center justify-between">
            <Link href="/admin/players" className="text-xs font-bold text-[#E5A93C] hover:underline">
              View Roster →
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-[#232B3E] hover:border-[#E5A93C]/40 transition-all group">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-black uppercase tracking-wider">Total Matches</span>
            <span className="text-xl group-hover:scale-110 transition-transform">🏏</span>
          </div>
          <p className="text-4xl font-black text-white mt-4 tracking-tight">{stats.matches}</p>
          <div className="mt-4 pt-4 border-t border-[#1F2637] flex items-center justify-between">
            <Link href="/admin/fixtures" className="text-xs font-bold text-[#E5A93C] hover:underline">
              Schedule →
            </Link>
          </div>
        </div>

        <div className={`glass-card p-6 rounded-2xl border transition-all group ${
          stats.live > 0 ? 'border-rose-500/50 glow-red' : 'border-[#232B3E]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full bg-rose-500 ${stats.live > 0 ? 'animate-ping' : ''}`} />
              Live Matches
            </span>
            <span className="text-xl">⚡</span>
          </div>
          <p className="text-4xl font-black text-white mt-4 tracking-tight">{stats.live}</p>
          <div className="mt-4 pt-4 border-t border-[#1F2637] flex items-center justify-between">
            <Link href="/admin/fixtures" className="text-xs font-bold text-rose-400 hover:underline">
              {stats.live > 0 ? 'Control Live Score →' : 'No Live Matches'}
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/admin/teams/new" 
          className="glass-card p-6 rounded-2xl border border-[#232B3E] hover:border-[#E5A93C] hover:bg-[#161D2B] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-xl text-[#E5A93C] mb-4 group-hover:scale-110 transition-transform">
            ➕
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wider">Register Team</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Create franchise profiles with custom jersey colors, captain, and manager details.
          </p>
        </Link>

        <Link 
          href="/admin/players/new" 
          className="glass-card p-6 rounded-2xl border border-[#232B3E] hover:border-[#E5A93C] hover:bg-[#161D2B] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl text-blue-400 mb-4 group-hover:scale-110 transition-transform">
            🏏
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wider">Add Player</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Enroll players into teams with role selection and automated duplicate jersey validation.
          </p>
        </Link>

        <Link 
          href="/admin/fixtures/generate" 
          className="glass-card p-6 rounded-2xl border border-[#E5A93C]/40 bg-gradient-to-br from-[#1C2333] to-[#121722] hover:border-[#E5A93C] transition-all group shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-xl text-black mb-4 group-hover:scale-110 transition-transform shadow-md">
            ⚡
          </div>
          <h3 className="text-base font-black text-[#E5A93C] uppercase tracking-wider">Auto Schedule</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Generate round-robin fixtures automatically across custom time slots and match days.
          </p>
        </Link>
      </div>
    </div>
  );
}
