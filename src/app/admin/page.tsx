'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams } from '@/lib/supabase/teams';
import { getPlayers } from '@/lib/supabase/players';
import { getMatches } from '@/lib/supabase/matches';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { signOut } = useAuth();
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

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white uppercase">Dashboard Overview</h1>
        <button 
          onClick={signOut}
          className="px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 text-sm font-bold rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#141923] p-6 rounded-xl border border-[#232B3E]">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Teams</h3>
          <p className="text-4xl font-black text-white mt-2">{stats.teams}</p>
        </div>
        <div className="bg-[#141923] p-6 rounded-xl border border-[#232B3E]">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Players</h3>
          <p className="text-4xl font-black text-white mt-2">{stats.players}</p>
        </div>
        <div className="bg-[#141923] p-6 rounded-xl border border-[#232B3E]">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Matches</h3>
          <p className="text-4xl font-black text-white mt-2">{stats.matches}</p>
        </div>
        <div className="bg-[#1C2333] p-6 rounded-xl border border-[#E5A93C]/30 shadow-[0_0_15px_-3px_rgba(229,169,60,0.2)]">
          <h3 className="text-[#E5A93C] text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-ping"></span> Live Matches
          </h3>
          <p className="text-4xl font-black text-[#E5A93C] mt-2">{stats.live}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-[#141923] p-6 rounded-xl border border-[#232B3E]">
          <h3 className="text-white text-lg font-bold uppercase mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/teams/new" className="block w-full text-center px-4 py-2 bg-[#1C2333] hover:bg-[#252E42] border border-[#2D384E] text-white text-sm font-bold rounded-md">Add New Team</Link>
            <Link href="/admin/players/new" className="block w-full text-center px-4 py-2 bg-[#1C2333] hover:bg-[#252E42] border border-[#2D384E] text-white text-sm font-bold rounded-md">Register Player</Link>
            <Link href="/admin/fixtures/generate" className="block w-full text-center px-4 py-2 bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black text-sm font-bold rounded-md">Generate Fixtures</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
