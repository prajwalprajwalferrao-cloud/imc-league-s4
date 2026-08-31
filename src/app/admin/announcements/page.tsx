'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { MOCK_ANNOUNCEMENTS } from '@/lib/mockData';
import { Announcement } from '@/lib/types';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement: Announcement = {
      id: `a-${Date.now()}`,
      title,
      description,
      priority,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 pb-16">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-6">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wide">ANNOUNCEMENTS</h1>
            <p className="text-xs text-gray-400">Post news alerts and priority updates for public view</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <span>+ Post Announcement</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {announcements.map((a) => (
            <div key={a.id} className="bg-[#141923] border border-[#232B3E] rounded-xl p-5 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  a.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {a.priority}
                </span>
                <button
                  onClick={() => setAnnouncements(announcements.filter((item) => item.id !== a.id))}
                  className="text-xs text-rose-400 font-bold hover:underline"
                >
                  Delete
                </button>
              </div>

              <h3 className="font-extrabold text-white text-base">{a.title}</h3>
              <p className="text-xs text-gray-400">{a.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white uppercase">Post Announcement</h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule Update"
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Announcement details..."
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
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
