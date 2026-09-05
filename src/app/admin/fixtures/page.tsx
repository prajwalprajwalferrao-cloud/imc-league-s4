'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMatches, updateMatch } from '@/lib/firestore/matches';
import { getTeams } from '@/lib/firestore/teams';
import { Match, Team } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminFixturesList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [m, t] = await Promise.all([getMatches(), getTeams()]);
      setMatches(m);
      const teamMap: Record<string, Team> = {};
      t.forEach(team => { teamMap[team.id] = team; });
      setTeams(teamMap);
    } catch (err) {
      toast.error('Failed to load fixtures');
    } finally {
      setLoading(false);
    }
  }

  const handleStartMatch = async (id: string) => {
    if (confirm('Start this match? This will change status to Live.')) {
      try {
        await updateMatch(id, { status: 'Live' });
        toast.success('Match started!');
        loadData();
      } catch (err) {
        toast.error('Failed to start match');
      }
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white uppercase">Fixtures & Matches</h1>
        <div className="space-x-3">
          <Link href="/admin/fixtures/new" className="px-4 py-2 border border-[#2D384E] text-white hover:bg-[#1C2333] text-sm font-bold rounded-md">
            Manual Add
          </Link>
          <Link href="/admin/fixtures/generate" className="px-4 py-2 bg-[#E5A93C] text-black hover:bg-[#D49B35] text-sm font-bold rounded-md">
            Generate Fixtures
          </Link>
        </div>
      </div>

      <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2D384E]">
            <thead className="bg-[#0B0E14]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Date / Time</th>
                <th className="px-6 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Matchup</th>
                <th className="px-6 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D384E]">
              {matches.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">No fixtures found. Generate some!</td></tr>
              ) : (
                matches.map((match) => (
                  <tr key={match.id} className="hover:bg-[#1C2333]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="font-bold text-white">{match.date}</div>
                      <div className="text-xs text-gray-500">{match.time} | Round {match.round}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-sm font-bold text-white w-24 text-right">
                          {teams[match.homeTeamId]?.shortName || 'TBA'}
                        </span>
                        <span className="text-xs text-gray-500 bg-[#0B0E14] px-2 py-1 rounded border border-[#2D384E]">vs</span>
                        <span className="text-sm font-bold text-white w-24 text-left">
                          {teams[match.awayTeamId]?.shortName || 'TBA'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border 
                        ${match.status === 'Live' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                          match.status === 'Completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                          'bg-[#1C2333] text-gray-300 border-[#2D384E]'}`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {match.status === 'Upcoming' && (
                        <button onClick={() => handleStartMatch(match.id)} className="text-green-400 hover:text-green-300 mr-4 font-bold">
                          START MATCH
                        </button>
                      )}
                      {(match.status === 'Live' || match.status === 'Completed') && (
                        <Link href={`/admin/matches/${match.id}`} className="text-[#E5A93C] hover:text-[#FFC857] font-bold mr-4">
                          {match.status === 'Live' ? 'MATCH CONTROL' : 'VIEW / EDIT'}
                        </Link>
                      )}
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
