'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { MOCK_SEASON } from '@/lib/mockData';
import { Season } from '@/lib/types';

export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([MOCK_SEASON]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [seasonNumber, setSeasonNumber] = useState(5);
  const [format, setFormat] = useState<'Round Robin' | 'Double Round Robin' | 'Knockout'>('Round Robin');

  const handleCreateSeason = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeason: Season = {
      id: `s-${Date.now()}`,
      name,
      season_number: Number(seasonNumber),
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      format,
      status: 'Upcoming',
      is_active: false,
      points_per_win: 3,
      points_per_draw: 1,
      points_per_loss: 0,
      created_at: new Date().toISOString(),
    };
    setSeasons([...seasons, newSeason]);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 pb-16">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-6">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wide">SEASON MANAGEMENT</h1>
            <p className="text-xs text-gray-400">Create new seasons or switch active league seasons</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <span>+ Create New Season</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {seasons.map((s) => (
            <div key={s.id} className="bg-[#141923] border border-[#232B3E] rounded-xl p-5 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  s.is_active ? 'bg-[#E5A93C] text-black' : 'bg-gray-800 text-gray-400'
                }`}>
                  {s.is_active ? 'Active Season' : s.status}
                </span>
                <span className="text-xs text-gray-500 font-mono">Format: {s.format}</span>
              </div>

              <h3 className="font-extrabold text-white text-lg">{s.name}</h3>
              <p className="text-xs text-gray-400">
                Win: {s.points_per_win} pts | Draw: {s.points_per_draw} pts | Loss: {s.points_per_loss} pts
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white uppercase">Create New Season</h3>

            <form onSubmit={handleCreateSeason} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Season Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. IMC LEAGUE - SEASON 05"
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Season Number</label>
                  <input
                    type="number"
                    value={seasonNumber}
                    onChange={(e) => setSeasonNumber(Number(e.target.value))}
                    className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="Round Robin">Round Robin</option>
                    <option value="Double Round Robin">Double Round Robin</option>
                    <option value="Knockout">Knockout</option>
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
                  Create Season
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
