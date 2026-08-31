'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { MOCK_TEAMS } from '@/lib/mockData';
import { Player } from '@/lib/types';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'p1',
      team_id: MOCK_TEAMS[0].id,
      full_name: 'Alex Mercer',
      photo_url: null,
      jersey_number: 10,
      position: 'Forward',
      is_captain: true,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'p2',
      team_id: MOCK_TEAMS[1].id,
      full_name: 'David Vance',
      photo_url: null,
      jersey_number: 7,
      position: 'Midfielder',
      is_captain: true,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(MOCK_TEAMS[0].id);
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState('Forward');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      team_id: selectedTeamId,
      full_name: fullName,
      photo_url: null,
      jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
      position,
      is_captain: false,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setPlayers([...players, newPlayer]);
    setIsModalOpen(false);
    setFullName('');
    setJerseyNumber('');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 pb-16">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-6">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wide">PLAYER ROSTER</h1>
            <p className="text-xs text-gray-400">Add, edit, or assign squad players to teams</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <span>+ Add Player</span>
          </button>
        </div>

        {/* Players List */}
        <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0B0E14] text-gray-400 font-bold uppercase tracking-wider text-[11px] border-b border-[#232B3E]">
              <tr>
                <th className="py-3 px-4">PLAYER NAME</th>
                <th className="py-3 px-4">TEAM</th>
                <th className="py-3 px-4 text-center">JERSEY #</th>
                <th className="py-3 px-4">POSITION</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2333]">
              {players.map((p) => {
                const team = MOCK_TEAMS.find((t) => t.id === p.team_id);
                return (
                  <tr key={p.id} className="hover:bg-[#1C2333]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                      <span>{p.full_name}</span>
                      {p.is_captain && (
                        <span className="text-[10px] font-black bg-[#E5A93C] text-black px-1.5 py-0.5 rounded">
                          C
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 font-semibold">{team?.name || 'Unassigned'}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#E5A93C]">{p.jersey_number || '-'}</td>
                    <td className="py-3.5 px-4 text-gray-400">{p.position}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setPlayers(players.filter((item) => item.id !== p.id))}
                        className="text-rose-400 font-bold text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white uppercase">Add Player to Squad</h3>

            <form onSubmit={handleAddPlayer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Leo Sterling"
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Team</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                >
                  {MOCK_TEAMS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Jersey Number</label>
                  <input
                    type="number"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    placeholder="10"
                    className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="Forward">Forward</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                  </select>
                </div>
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
                  Save Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
