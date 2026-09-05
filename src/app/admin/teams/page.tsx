'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams, softDeleteTeam } from '@/lib/supabase/teams';
import { Team } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminTeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (err) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will hide the team from public view.`)) {
      try {
        await softDeleteTeam(id);
        toast.success(`${name} deleted successfully`);
        loadTeams();
      } catch (err) {
        toast.error('Failed to delete team');
      }
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white uppercase">Manage Teams</h1>
        <Link 
          href="/admin/teams/new"
          className="px-4 py-2 bg-[#E5A93C] text-black hover:bg-[#D49B35] text-sm font-bold rounded-md"
        >
          Add Team
        </Link>
      </div>

      <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2D384E]">
            <thead className="bg-[#0B0E14]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Short</th>
                <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Captain</th>
                <th className="px-6 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D384E]">
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                    No teams found. Create one to get started.
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id} className="hover:bg-[#1C2333]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full border-2 border-[#232B3E] bg-[#0B0E14] flex items-center justify-center overflow-hidden">
                          {team.logo_url ? (
                            <img src={team.logo_url} alt={team.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold" style={{ color: team.colour || '#fff' }}>{team.short_name}</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{team.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {team.short_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {team.captain || 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/teams/${team.id}`} className="text-[#E5A93C] hover:text-[#FFC857] mr-4">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(team.id, team.name)} className="text-red-500 hover:text-red-400">
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
