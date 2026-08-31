'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { MOCK_TEAMS } from '@/lib/mockData';
import { Team } from '@/lib/types';

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [colorHex, setColorHex] = useState('#E5A93C');
  const [captain, setCaptain] = useState('');
  const [coach, setCoach] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      season_id: '11111111-1111-1111-1111-111111111111',
      name,
      short_name: shortName.toUpperCase(),
      logo_url: null,
      color_hex: colorHex,
      captain_name: captain,
      vice_captain_name: null,
      coach_name: coach,
      description,
      created_at: new Date().toISOString(),
    };

    setTeams([...teams, newTeam]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      setTeams(teams.filter((t) => t.id !== id));
    }
  };

  const resetForm = () => {
    setName('');
    setShortName('');
    setColorHex('#E5A93C');
    setCaptain('');
    setCoach('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 pb-16">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-6">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wide">TEAM MANAGEMENT</h1>
            <p className="text-xs text-gray-400">Create, edit, or delete teams in Season 04</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <span>+ Create Team</span>
          </button>
        </div>

        {/* Teams List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div key={team.id} className="bg-[#141923] border border-[#232B3E] rounded-xl p-5 space-y-4 shadow-lg relative">
              <div className="flex items-center space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-black text-base text-black shadow-md"
                  style={{ backgroundColor: team.color_hex }}
                >
                  {team.short_name}
                </div>

                <div>
                  <h3 className="font-extrabold text-white text-base">{team.name}</h3>
                  <p className="text-xs text-gray-400">Captain: {team.captain_name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Coach: {team.coach_name || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C2333] flex items-center justify-end space-x-2 text-xs">
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="px-3 py-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors font-bold"
                >
                  Delete Team
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white uppercase">Create New Team</h3>

            <form onSubmit={handleCreateTeam} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. IMC Warriors"
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Short Name (3-4 chars)</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="WAR"
                    className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Team Color</label>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-full h-9 bg-[#0B0E14] border border-[#232B3E] rounded cursor-pointer p-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Captain Name</label>
                <input
                  type="text"
                  value={captain}
                  onChange={(e) => setCaptain(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Coach / Manager</label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  placeholder="David Miller"
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#1C2333] text-gray-300 font-bold text-xs hover:bg-[#252E42]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#E5A93C] text-black font-extrabold text-xs hover:brightness-110"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
