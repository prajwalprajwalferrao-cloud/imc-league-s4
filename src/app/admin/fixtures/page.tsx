'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { MOCK_TEAMS, MOCK_SEASON, MOCK_MATCHES } from '@/lib/mockData';
import { generateFixtures, GeneratedMatchPreview } from '@/lib/generator';
import { Match, TournamentFormat } from '@/lib/types';
import { format } from 'date-fns';

export default function AdminFixturesPage() {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Generator form state
  const [tournamentFormat, setTournamentFormat] = useState<TournamentFormat>('Round Robin');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [breakMins, setBreakMins] = useState(15);
  const [venue, setVenue] = useState('IMC Main Arena');

  const [previews, setPreviews] = useState<GeneratedMatchPreview[]>([]);

  const handleGeneratePreview = () => {
    const generated = generateFixtures(MOCK_TEAMS, {
      seasonId: MOCK_SEASON.id,
      format: tournamentFormat,
      startDate,
      startTime,
      matchDurationMinutes: duration,
      breakMinutes: breakMins,
      venue,
    });
    setPreviews(generated);
  };

  const handleConfirmSchedule = () => {
    const newMatches: Match[] = previews.map((p, index) => ({
      id: `gen-match-${index}-${Date.now()}`,
      season_id: MOCK_SEASON.id,
      home_team_id: p.homeTeam.id,
      away_team_id: p.awayTeam.id,
      home_score: 0,
      away_score: 0,
      match_date: p.matchDate.toISOString(),
      venue: p.venue,
      status: 'Scheduled',
      current_minute: '0',
      round_number: p.roundNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      home_team: p.homeTeam,
      away_team: p.awayTeam,
    }));

    setMatches([...matches, ...newMatches]);
    setIsGeneratorOpen(false);
    setPreviews([]);
  };

  const handleDeleteMatch = (id: string) => {
    if (confirm('Are you sure you want to delete this match fixture?')) {
      setMatches(matches.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 pb-16">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-6">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wide">FIXTURE & SCHEDULE MANAGEMENT</h1>
            <p className="text-xs text-gray-400">Auto-generate Round Robin/Knockout schedules or edit existing matches</p>
          </div>

          <button
            onClick={() => {
              setIsGeneratorOpen(true);
              handleGeneratePreview();
            }}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <span>⚡ Auto-Generate Schedule</span>
          </button>
        </div>

        {/* Existing Fixtures List */}
        <div className="bg-[#141923] border border-[#232B3E] rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#232B3E] bg-[#0B0E14] flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Scheduled League Fixtures</h3>
            <span className="text-xs text-gray-400">{matches.length} Total Matches</span>
          </div>

          <div className="divide-y divide-[#1C2333]">
            {matches.map((m) => (
              <div key={m.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#1C2333]/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-[#E5A93C]">Round {m.round_number}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{format(new Date(m.match_date), 'MMM dd, yyyy @ HH:mm')}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{m.venue}</span>
                  </div>
                  <div className="text-sm font-black text-white">
                    {m.home_team?.name} ({m.home_score}) vs ({m.away_score}) {m.away_team?.name}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`/admin/live-score/${m.id}`}
                    className="px-3 py-1.5 rounded bg-[#E5A93C] hover:bg-[#FFC857] text-black font-extrabold text-xs"
                  >
                    Live Score Console
                  </a>
                  <button
                    onClick={() => handleDeleteMatch(m.id)}
                    className="px-3 py-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 max-w-2xl w-full space-y-6 shadow-2xl my-8">
            <div>
              <h3 className="text-xl font-black text-white uppercase">Automatic Fixture Generator</h3>
              <p className="text-xs text-gray-400">Configure parameters to preview fairness-optimized match schedules</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Format</label>
                <select
                  value={tournamentFormat}
                  onChange={(e) => {
                    setTournamentFormat(e.target.value as TournamentFormat);
                    setTimeout(handleGeneratePreview, 50);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-xs text-white"
                >
                  <option value="Round Robin">Round Robin</option>
                  <option value="Double Round Robin">Double Round Robin</option>
                  <option value="Knockout">Knockout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setTimeout(handleGeneratePreview, 50);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setTimeout(handleGeneratePreview, 50);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Match Duration (mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => {
                    setDuration(parseInt(e.target.value) || 60);
                    setTimeout(handleGeneratePreview, 50);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Break Between (mins)</label>
                <input
                  type="number"
                  value={breakMins}
                  onChange={(e) => {
                    setBreakMins(parseInt(e.target.value) || 15);
                    setTimeout(handleGeneratePreview, 50);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Venue Name</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => {
                    setVenue(e.target.value);
                    setTimeout(handleGeneratePreview, 50);
                  }}
                  className="w-full bg-[#0B0E14] border border-[#232B3E] rounded px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Generated Schedule Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#E5A93C] uppercase tracking-wider">
                  Generated Preview ({previews.length} Matches)
                </h4>
                <button
                  onClick={handleGeneratePreview}
                  className="text-xs text-gray-400 hover:text-white underline"
                >
                  Re-calculate
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto border border-[#232B3E] bg-[#0B0E14] rounded-lg p-3 divide-y divide-[#1C2333]">
                {previews.map((p, idx) => (
                  <div key={idx} className="py-2 text-xs flex justify-between items-center text-gray-300">
                    <div>
                      <strong className="text-white">Round {p.roundNumber}:</strong> {p.homeTeam.name} vs {p.awayTeam.name}
                    </div>
                    <div className="text-gray-500 font-mono">
                      {format(p.matchDate, 'MMM dd, HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(false)}
                className="px-4 py-2 rounded bg-[#1C2333] text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                disabled={previews.length === 0}
                className="px-5 py-2 rounded bg-[#E5A93C] text-black font-black text-xs hover:brightness-110 disabled:opacity-50"
              >
                Confirm & Add Fixtures
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
