'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTeams } from '@/lib/supabase/teams';
import { createMatch, getMatches } from '@/lib/supabase/matches';
import { generateFixtures } from '@/lib/fixtureGenerator';
import { Team } from '@/lib/types';
import toast from 'react-hot-toast';

export default function GenerateFixturesPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [format, setFormat] = useState<'single' | 'double'>('single');
  const [startDate, setStartDate] = useState('');
  const [venue, setVenue] = useState('Main Stadium');
  const [timeSlots, setTimeSlots] = useState('10:00, 14:00, 18:00');
  const [matchesPerDay, setMatchesPerDay] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    getTeams().then(setTeams).catch(() => toast.error('Failed to load teams'));
    // Default start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleGenerate = async () => {
    if (teams.length < 2) {
      toast.error('Need at least 2 teams');
      return;
    }

    if (!confirm('This will append new fixtures to the database. Ensure you haven\'t already generated them to avoid duplicates. Continue?')) {
      return;
    }

    setIsGenerating(true);
    try {
      const timesArray = timeSlots.split(',').map(s => s.trim());
      const fixtures = generateFixtures(
        teams.map(t => t.id),
        format,
        new Date(startDate),
        venue,
        timesArray,
        'season-4',
        matchesPerDay
      );

      let created = 0;
      for (const match of fixtures) {
        await createMatch(match);
        created++;
      }
      
      toast.success(`Successfully generated ${created} fixtures!`);
      router.push('/admin/fixtures');
    } catch (err) {
      toast.error('Error generating fixtures');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white uppercase">Fixture Generator</h1>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm">Cancel</button>
      </div>

      <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 space-y-6">
        
        <div className="bg-[#1C2333] border border-[#2D384E] p-4 rounded-lg">
          <p className="text-sm text-gray-300">
            This will generate a round-robin schedule for <span className="font-bold text-[#E5A93C]">{teams.length} teams</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-300">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
            >
              <option value="single">Single Round Robin (Plays once)</option>
              <option value="double">Double Round Robin (Plays twice)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-300">Matches Per Day</label>
            <input
              type="number"
              min="1"
              max="10"
              value={matchesPerDay}
              onChange={(e) => setMatchesPerDay(parseInt(e.target.value))}
              className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-300">Time Slots (comma separated)</label>
            <input
              type="text"
              value={timeSlots}
              onChange={(e) => setTimeSlots(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-bold text-gray-300">Default Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#2D384E] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#E5A93C]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#232B3E] flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || teams.length < 2}
            className="px-6 py-2 bg-[#E5A93C] text-black font-bold rounded-md hover:bg-[#D49B35] disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Fixtures'}
          </button>
        </div>
      </div>
    </div>
  );
}
