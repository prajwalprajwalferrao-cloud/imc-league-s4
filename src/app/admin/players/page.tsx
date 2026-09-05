'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers, deletePlayer } from '@/lib/supabase/players';
import { getTeams } from '@/lib/supabase/teams';
import { Player, Team } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminPlayersList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [p, t] = await Promise.all([getPlayers(), getTeams()]);
      setPlayers(p);
      
      const teamMap: Record<string, Team> = {};
      t.forEach(team => { teamMap[team.id] = team; });
      setTeams(teamMap);
    } catch (err) {
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to deactivate ${name}?`)) {
      try {
        await deletePlayer(id);
        toast.success(`${name} deactivated`);
        loadData();
      } catch (err) {
        toast.error('Failed to delete player');
      }
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white uppercase">Manage Players</h1>
        <Link 
          href="/admin/players/new"
          className="px-4 py-2 bg-[#E5A93C] text-black hover:bg-[#D49B35] text-sm font-bold rounded-md"
        >
          Add Player
        </Link>
      </div>

      <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2D384E]">
            <thead className="bg-[#0B0E14]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Player Name</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D384E]">
              {players.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                    No active players found.
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr key={player.id} className="hover:bg-[#1C2333]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#0B0E14] border border-[#2D384E] flex items-center justify-center overflow-hidden">
                          {player.photo_url ? (
                            <img src={player.photo_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-gray-500 text-xs">👤</span>
                          )}
                        </div>
                        <div className="ml-4 text-sm font-bold text-white">{player.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {teams[player.team_id]?.name || 'Unknown Team'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#1C2333] text-gray-300 border border-[#2D384E]">
                        {player.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300 font-mono">
                      {player.jersey_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/players/${player.id}`} className="text-[#E5A93C] hover:text-[#FFC857] mr-4">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(player.id, player.name)} className="text-red-500 hover:text-red-400">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
