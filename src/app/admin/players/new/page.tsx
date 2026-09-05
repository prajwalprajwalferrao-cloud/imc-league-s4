'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPlayer, checkDuplicateJersey } from '@/lib/supabase/players';
import { getTeams } from '@/lib/supabase/teams';
import { Team, PlayerPosition } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function NewPlayerPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    team_id: '',
    jersey_number: '',
    position: 'Batsman' as PlayerPosition,
    photo_url: '',
  });

  useEffect(() => {
    async function loadTeams() {
      try {
        const t = await getTeams();
        setTeams(t);
        if (t.length > 0) setFormData(f => ({ ...f, team_id: t[0].id }));
      } catch (err) {
        toast.error('Failed to load teams');
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team_id) {
      toast.error('Please select a team');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const jersey = parseInt(formData.jersey_number);
      const isDuplicate = await checkDuplicateJersey(formData.team_id, jersey);
      if (isDuplicate) {
        toast.error(`Jersey number ${jersey} is already taken in this team`);
        setIsSubmitting(false);
        return;
      }
      
      await createPlayer({
        name: formData.name,
        team_id: formData.team_id,
        jersey_number: jersey,
        position: formData.position,
        photo_url: formData.photo_url,
        season_id: 'season-4',
        runs_scored: 0,
        balls_faced: 0,
        wickets_taken: 0,
        overs_bowled: 0,
        runs_conceded: 0,
        catches: 0,
        run_outs: 0,
        appearances: 0,
        motm: 0,
        is_active: true
      });
      
      toast.success('Player registered successfully!');
      router.push('/admin/players');
    } catch (err) {
      toast.error('Failed to register player');
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white uppercase">Register New Player</h1>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm">Cancel</button>
      </div>

      <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Team *</label>
              <select
                required
                value={formData.team_id}
                onChange={(e) => setFormData({...formData, team_id: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Jersey Number *</label>
              <input
                type="number"
                required
                min="0"
                max="99"
                value={formData.jersey_number}
                onChange={(e) => setFormData({...formData, jersey_number: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-300">Role *</label>
              <select
                required
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value as PlayerPosition})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
              >
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-rounder">All-rounder</option>
                <option value="Wicket-keeper">Wicket-keeper</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-gray-300">Photo URL (Optional)</label>
              <input
                type="url"
                value={formData.photo_url}
                onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#232B3E] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#E5A93C] text-black font-bold rounded-md hover:bg-[#D49B35] disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
