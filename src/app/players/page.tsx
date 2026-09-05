'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers } from '@/lib/firestore/players';
import { getTeams } from '@/lib/firestore/teams';
import { Player, Team } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      try {
        const [p, t] = await Promise.all([getPlayers(), getTeams()]);
        setPlayers(p);
        
        const teamMap: Record<string, Team> = {};
        t.forEach(team => { teamMap[team.id] = team; });
        setTeams(teamMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="py-12"><LoadingSpinner size="lg" /></div>;

  const positions = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
  const filteredPlayers = filter === 'All' ? players : players.filter(p => p.position === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#232B3E] pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Player <span className="text-[#E5A93C]">Roster</span></h1>
          <p className="text-gray-400 text-sm">Season 4 registered players and statistics.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-3 py-1 text-xs font-bold uppercase rounded-full whitespace-nowrap transition-colors ${filter === pos ? 'bg-[#E5A93C] text-black' : 'bg-[#1C2333] text-gray-400 border border-[#2D384E] hover:text-white'}`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlayers.map(player => (
          <div key={player.id} className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden hover:border-[#E5A93C]/50 transition-colors group">
            <div className="p-4 flex items-start justify-between">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#0B0E14] border-2 border-[#2D384E] flex items-center justify-center overflow-hidden">
                {player.photoUrl ? (
                  <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#E5A93C]/20 group-hover:text-[#E5A93C]/40 transition-colors">
                  {player.jerseyNumber.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <h3 className="text-lg font-bold text-white truncate">{player.name}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{teams[player.teamId]?.name || 'TBA'}</p>
              
              <div className="mt-4 pt-4 border-t border-[#232B3E] flex justify-between text-xs">
                <div>
                  <span className="block text-gray-500 uppercase font-black text-[10px]">Role</span>
                  <span className="font-bold text-white">{player.position}</span>
                </div>
                <div className="text-right">
                  <span className="block text-gray-500 uppercase font-black text-[10px]">Stats</span>
                  <span className="font-bold text-white">{player.runsScored} R / {player.wicketsTaken} W</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No players found matching the selected filter.
        </div>
      )}
    </div>
  );
}
