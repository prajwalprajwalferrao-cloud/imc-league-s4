'use client';

import { useEffect, useState } from 'react';
import { getPlayers } from '@/lib/firestore/players';
import { getTeams } from '@/lib/firestore/teams';
import { Player, Team } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function StatisticsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);

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

  const topScorers = [...players].sort((a, b) => b.runsScored - a.runsScored).slice(0, 10);
  const topWicketTakers = [...players].sort((a, b) => b.wicketsTaken - a.wicketsTaken).slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="space-y-2 border-b border-[#232B3E] pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">League <span className="text-[#E5A93C]">Statistics</span></h1>
        <p className="text-gray-400 text-sm">Top performers across the tournament.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Scorers */}
        <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#1C2333] px-6 py-4 border-b border-[#2D384E]">
            <h2 className="text-lg font-black text-[#E5A93C] uppercase tracking-wider">Top Run Scorers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2D384E]">
              <thead className="bg-[#0B0E14]">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Player</th>
                  <th className="px-6 py-3 text-center text-[10px] font-black text-white uppercase">Runs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D384E]">
                {topScorers.map((player, index) => (
                  <tr key={player.id} className="hover:bg-[#1C2333]">
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-400">{index + 1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{player.name}</div>
                      <div className="text-xs text-gray-500">{teams[player.teamId]?.shortName || 'TBA'}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-black text-[#E5A93C]">{player.runsScored}</td>
                  </tr>
                ))}
                {topScorers.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Wicket Takers */}
        <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden shadow-lg">
          <div className="bg-[#1C2333] px-6 py-4 border-b border-[#2D384E]">
            <h2 className="text-lg font-black text-[#E5A93C] uppercase tracking-wider">Top Wicket Takers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2D384E]">
              <thead className="bg-[#0B0E14]">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase">Player</th>
                  <th className="px-6 py-3 text-center text-[10px] font-black text-white uppercase">Wickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D384E]">
                {topWicketTakers.map((player, index) => (
                  <tr key={player.id} className="hover:bg-[#1C2333]">
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-400">{index + 1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{player.name}</div>
                      <div className="text-xs text-gray-500">{teams[player.teamId]?.shortName || 'TBA'}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-black text-[#E5A93C]">{player.wicketsTaken}</td>
                  </tr>
                ))}
                {topWicketTakers.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
