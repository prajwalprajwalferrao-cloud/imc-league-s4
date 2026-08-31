'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { MOCK_MATCHES } from '@/lib/mockData';
import { Match, MatchStatus } from '@/lib/types';

export default function AdminLiveScorePage({ params }: { params: { id: string } }) {
  const initialMatch = MOCK_MATCHES.find((m) => m.id === params.id) || MOCK_MATCHES[0];
  const [match, setMatch] = useState<Match>(initialMatch);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  const updateScore = (team: 'home' | 'away', delta: number) => {
    if (team === 'home') {
      const newScore = Math.max(0, match.home_score + delta);
      setMatch({ ...match, home_score: newScore });
    } else {
      const newScore = Math.max(0, match.away_score + delta);
      setMatch({ ...match, away_score: newScore });
    }
  };

  const updateStatus = (status: MatchStatus) => {
    if (status === 'Completed') {
      setShowFinishConfirm(true);
    } else {
      setMatch({ ...match, status });
    }
  };

  const confirmFinish = () => {
    setMatch({ ...match, status: 'Completed', current_minute: "90'" });
    setShowFinishConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 pb-16">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <span>LIVE MATCH SCORING CONSOLE</span>
              {match.status === 'Live' && (
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500 text-white font-extrabold animate-pulse-live">
                  LIVE
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400">Touch-friendly score modifier & status control center</p>
          </div>

          <div className="text-right text-xs">
            <span className="text-gray-400 block font-mono">STATUS</span>
            <span className="text-[#E5A93C] font-black uppercase text-sm">{match.status}</span>
          </div>
        </div>

        {/* Touch Score Board */}
        <div className="bg-[#141923] border border-[#232B3E] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="grid grid-cols-2 gap-6 sm:gap-12">
            
            {/* Home Team */}
            <div className="flex flex-col items-center space-y-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xl text-black shadow-lg"
                style={{ backgroundColor: match.home_team?.color_hex || '#E5A93C' }}
              >
                {match.home_team?.short_name || 'HOME'}
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white text-center">
                {match.home_team?.name || 'Home Team'}
              </h2>

              <div className="text-5xl sm:text-7xl font-black text-[#FFC857] tracking-widest font-mono">
                {match.home_score}
              </div>

              <div className="flex items-center space-x-3 w-full max-w-[180px]">
                <button
                  onClick={() => updateScore('home', -1)}
                  className="flex-1 py-3 rounded-xl bg-[#1C2333] hover:bg-[#252E42] text-white font-black text-xl border border-[#2D384E] shadow"
                >
                  -
                </button>
                <button
                  onClick={() => updateScore('home', 1)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-black text-xl shadow-lg glow-gold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center space-y-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xl text-black shadow-lg"
                style={{ backgroundColor: match.away_team?.color_hex || '#0A84FF' }}
              >
                {match.away_team?.short_name || 'AWAY'}
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white text-center">
                {match.away_team?.name || 'Away Team'}
              </h2>

              <div className="text-5xl sm:text-7xl font-black text-[#FFC857] tracking-widest font-mono">
                {match.away_score}
              </div>

              <div className="flex items-center space-x-3 w-full max-w-[180px]">
                <button
                  onClick={() => updateScore('away', -1)}
                  className="flex-1 py-3 rounded-xl bg-[#1C2333] hover:bg-[#252E42] text-white font-black text-xl border border-[#2D384E] shadow"
                >
                  -
                </button>
                <button
                  onClick={() => updateScore('away', 1)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#B37B1D] text-black font-black text-xl shadow-lg glow-gold"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Match Status Controls */}
          <div className="pt-6 border-t border-[#1C2333] space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider text-center">
              Match State Controls
            </h4>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => updateStatus('Live')}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow"
              >
                START MATCH ⚡
              </button>
              <button
                onClick={() => updateStatus('Half Time')}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow"
              >
                HALF TIME ⏸️
              </button>
              <button
                onClick={() => updateStatus('Live')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
              >
                RESUME MATCH ▶️
              </button>
              <button
                onClick={() => updateStatus('Completed')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow"
              >
                FINISH MATCH 🏁
              </button>
              <button
                onClick={() => updateStatus('Postponed')}
                className="px-4 py-2 rounded-lg bg-[#1C2333] text-gray-300 font-semibold text-xs border border-[#2D384E]"
              >
                Postpone 🛑
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Finish Confirmation Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <h3 className="text-lg font-black text-white uppercase">Finalize Match Result?</h3>
            <p className="text-xs text-gray-400">
              Finishing the match will finalize scores ({match.home_score} - {match.away_score}) and auto-update league standings.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="px-4 py-2 rounded bg-[#1C2333] text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmFinish}
                className="px-5 py-2 rounded bg-emerald-500 text-black font-black text-xs hover:brightness-110"
              >
                Confirm Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
