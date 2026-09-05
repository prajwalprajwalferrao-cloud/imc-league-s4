'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTeam } from '@/lib/firestore/teams';
import toast from 'react-hot-toast';

export default function NewTeamPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    colour: '#E5A93C',
    captain: '',
    manager: '',
    logoUrl: '',
    seasonId: 'season-4', // Hardcoded for now
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createTeam({
        ...formData,
        isDeleted: false,
      });
      toast.success('Team created successfully!');
      router.push('/admin/teams');
    } catch (err) {
      toast.error('Failed to create team');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white uppercase">Add New Team</h1>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm">
          Cancel
        </button>
      </div>

      <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Team Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
                placeholder="e.g. Royal Challengers"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Short Name (3-4 chars) *</label>
              <input
                type="text"
                required
                maxLength={4}
                value={formData.shortName}
                onChange={(e) => setFormData({...formData, shortName: e.target.value.toUpperCase()})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C] uppercase"
                placeholder="e.g. RCB"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Team Theme Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.colour}
                  onChange={(e) => setFormData({...formData, colour: e.target.value})}
                  className="w-10 h-10 rounded border-0 bg-transparent p-0 cursor-pointer"
                />
                <span className="text-gray-400 text-sm font-mono">{formData.colour}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Logo URL (Optional)</label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Captain Name (Optional)</label>
              <input
                type="text"
                value={formData.captain}
                onChange={(e) => setFormData({...formData, captain: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Manager Name (Optional)</label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#232B3E] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#E5A93C] text-black font-bold rounded-md hover:bg-[#D49B35] disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
